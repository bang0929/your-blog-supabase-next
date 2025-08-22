import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Nav from "@/components/nav";
import { AuthProvider } from "@/components/auth-provider";

import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Your Blog | 你的博客",
    template: "%s | Your Blog",
    absolute: ''
  },
  description: "这是一个分享、记录和学习Web技术的个人博客",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Nav />
              <main className="flex-1 bg-blue-100/50 bg-background dark:bg-neutral-900 pb-8">{children}</main>
              <footer className="border-t py-6">
                <div className="container mx-auto px-4 md:px-48 text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Your Blog. All rights reserved.
                </div>
              </footer>
            </div>
          </AuthProvider>

        </ThemeProvider>
      </body>
    </html>
  );
}
