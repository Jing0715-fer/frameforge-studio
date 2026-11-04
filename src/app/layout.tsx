import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FrameForge 分镜工坊 — AI 视频分镜与动效灵感库",
  description:
    "汇聚 14 个开源视频项目的精华：36 种影片风格、45 条精选提示词、24 个动效预设。AI 一键生成专业分镜稿与实现提示词，直接驱动 Hyperframes / Remotion / p5.js 出片。",
  keywords: [
    "AI 视频生成",
    "分镜稿",
    "提示词库",
    "Hyperframes",
    "Remotion",
    "动效设计",
    "MG 动画",
    "开源视频项目",
  ],
  authors: [{ name: "FrameForge" }],
  openGraph: {
    title: "FrameForge 分镜工坊",
    description: "从一句话到可拍摄的分镜稿，AI 视频灵感与动效素材库",
    siteName: "FrameForge",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
