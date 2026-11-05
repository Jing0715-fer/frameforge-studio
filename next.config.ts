import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // 不再吞掉类型错误：tsc 必须通过才能构建（本地已验证 bunx tsc --noEmit 通过）
  reactStrictMode: true,
};

export default nextConfig;
