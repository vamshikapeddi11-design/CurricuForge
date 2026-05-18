import "./globals.css";

export const metadata = {
  title: "CurricuForge",
  description: "AI Curriculum Generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}