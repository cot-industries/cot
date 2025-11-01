import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cot Marketplace - Coming Soon",
  description: "Module registry for Cot business software platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
