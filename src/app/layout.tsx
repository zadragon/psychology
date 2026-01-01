// src/app/layout.tsx
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster"; // 경로가 정확한지 확인
import Script from "next/script";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 구글 애드센스 스크립트 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5902490793024726"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        ></Script>
      </head>
      <body>
        <Providers>
          {children}
          <Toaster /> {/* 컴포넌트 추가 */}
        </Providers>
      </body>
    </html>
  );
}
