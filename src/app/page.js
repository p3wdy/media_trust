"use client";

import { useState, useRef } from "react";
import "./globals.css";

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return "score-high";
    if (score >= 40) return "score-medium";
    return "score-low";
  };

  return (
    <main className="container">
      <div className="header">
        <h1>MediaTrust</h1>
        <p>AI-Powered Deepfake & Manipulation Detection for Sports Media</p>
      </div>

      <div className="upload-card">
        <h2>Upload Media</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
          Select a sports photo or short video to analyze.
        </p>
        
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="file-input"
        />
        
        <label className="upload-label" onClick={() => fileInputRef.current?.click()}>
          Choose File
        </label>

        {preview && (
          <div className="preview-container">
            {file?.type.startsWith("video/") ? (
              <video src={preview} controls className="preview-media" />
            ) : (
              <img src={preview} alt="Preview" className="preview-media" />
            )}
          </div>
        )}

        {file && (
          <button 
            className="btn-analyze" 
            onClick={handleAnalyze} 
            disabled={loading}
          >
            {loading ? (
              <><span className="loader"></span> Analyzing with Gemini & Vision...</>
            ) : (
              "Analyze Media"
            )}
          </button>
        )}

        {error && (
          <div style={{ marginTop: "1rem", color: "var(--danger)" }}>
            Error: {error}
          </div>
        )}
      </div>

      {result && (
        <div className="results-panel">
          <div className="score-container">
            <div className={`score-circle ${getScoreClass(result.credibilityScore)}`}>
              {result.credibilityScore}
            </div>
            <h3>Credibility Score</h3>
          </div>
          
          <div className="explanation">
            <h4 style={{ marginBottom: "0.5rem", color: "var(--accent-color)" }}>Forensic Analysis</h4>
            {result.explanation.split('\n').map((line, i) => (
              <p key={i} style={{ marginBottom: "0.5rem" }}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
