import type { Metadata } from "next";
import { ThemeProvider } from "@cot/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cot Demo - See It In Action",
  description: "Live demonstration of an ERP built with Cot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
