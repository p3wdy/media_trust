import "./globals.css";

export const metadata = {
  title: "MediaTrust",
  description: "AI-Powered Deepfake & Manipulation Detection for Sports Media",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
