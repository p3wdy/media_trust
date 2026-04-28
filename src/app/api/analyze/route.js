import { NextResponse } from 'next/server';

export const maxDuration = 10; // Maximum duration for Vercel Hobby tier
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Configure Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || '');

export async function POST(request) {
  let tempFilePath = null;
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    // Convert file to buffer and save it to a temporary file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tempDir = os.tmpdir();
    tempFilePath = path.join(tempDir, `upload-${Date.now()}-${file.name}`);
    await fs.writeFile(tempFilePath, buffer);

    // Upload to Gemini via File Manager
    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
      mimeType: file.type,
      displayName: file.name,
    });
    
    // Wait for processing if it's a video
    if (isVideo) {
      let fileState = await fileManager.getFile(uploadResponse.file.name);
      while (fileState.state === 'PROCESSING') {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        fileState = await fileManager.getFile(uploadResponse.file.name);
      }
      if (fileState.state === 'FAILED') {
        throw new Error('Video processing failed in Gemini API.');
      }
    }

    // Call Gemini with Fallbacks and Retries to handle 503 errors
    const modelsToTry = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
    
    const prompt = `
      You are an elite digital forensics analyst specializing in detecting advanced AI-generated deepfakes and face-swaps.
      Carefully analyze this ${isVideo ? 'video' : 'image'}. You must scrutinize it specifically for:
      1. Face-swapping artifacts: Blurring or harsh boundaries around the jawline, chin, and hair.
      2. Biometric inconsistencies: Unnatural blinking, lack of micro-expressions, or weird eye movements.
      3. Rendering flaws: Misshapen teeth, unnatural skin texture, and inconsistent lighting between the face and body.
      4. Temporal anomalies (for video): Jittery facial features, lip-sync mismatches, or flickering.
      
      Do NOT assume it is simply a "lookalike". If it resembles a celebrity but has slight inconsistencies, it is highly likely a face-swap deepfake. Be highly critical and skeptical.
      
      Return ONLY a JSON object with this exact format:
      {
        "credibilityScore": <number between 0 and 100, where 100 is completely authentic and 0 is completely fake>,
        "explanation": "<detailed explanation of your findings and reasoning, formatted as markdown. Focus on why it looks real or fake based on the visual evidence and metadata.>"
      }
    `;

    let result = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      if (result) break;
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Try each model up to 2 times
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          result = await model.generateContent([
            {
              fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri
              }
            },
            { text: prompt },
          ]);
          break; // Success! Break out of retry loop
        } catch (err) {
          lastError = err;
          console.warn(`Attempt ${attempt} with ${modelName} failed:`, err.message);
          // Wait 3 seconds before retrying
          await new Promise(res => setTimeout(res, 3000));
        }
      }
    }

    if (!result) {
      throw lastError || new Error("All AI models are currently busy. Please try again later.");
    }

    let textResponse = result.response.text();
    textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(textResponse);

    // Cleanup file from Gemini and local OS
    await fileManager.deleteFile(uploadResponse.file.name);
    if (tempFilePath) await fs.unlink(tempFilePath);

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Error analyzing media:', error);
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (e) {} // ignore cleanup errors
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
