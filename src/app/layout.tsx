import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ThemeProvider } from "@/components/ThemeProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1D" },
  ],
};

export const metadata: Metadata = {
  title: "觉醒日志 | 觉察是改变的开始",
  description: "一个记录个人觉醒过程的私密空间。运用元认知、多巴胺管理和认知科学原理，帮助你在日常中持续觉察与成长。",
  keywords: ["觉醒", "元认知", "多巴胺", "自我成长", "冥想", "认知科学"],
  authors: [{ name: "觉醒日志" }],
  manifest: "/manifest.json",
  applicationName: "觉醒日志",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "觉醒日志",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "觉醒日志",
    description: "觉察是改变的开始。记录你的觉醒之旅。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-warm-100 dark:bg-deep-900 text-ink dark:text-[#E8E6E3] transition-colors duration-300">
        <ThemeProvider>
          <Navigation />

          <main className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {children}
          </main>

          <footer className="text-center py-8 text-sm text-ink-muted dark:text-[#9A9A9E]">
            <p>觉醒日志 &copy; {new Date().getFullYear()} — 觉察是改变的开始</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
