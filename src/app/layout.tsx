// src/app/layout.tsx
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster"; // 경로가 정확한지 확인
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "심리 퀘스트 - 나를 알아가는 심리 테스트",
  description:
    "다양한 심리 테스트로 나의 성향, 스트레스, 연애 스타일, 경영 스타일 등을 알아보세요. 테토/에겐 성향 검사, 직장인 스트레스 진단 등 재미있는 심리 테스트를 제공합니다.",
  keywords: [
    "심리테스트",
    "성향테스트",
    "연애테스트",
    "스트레스테스트",
    "경영스타일",
    "테토에겐",
    "심리퀘스트",
  ],
  authors: [{ name: "심리 퀘스트" }],
  icons: {
    icon: "/favicon.ico", // 또는 "/icon.png", "/icon.svg" 등
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "심리 퀘스트",
    title: "심리 퀘스트 - 나를 알아가는 심리 테스트",
    description:
      "다양한 심리 테스트로 나의 성향, 스트레스, 연애 스타일, 경영 스타일 등을 알아보세요.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

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
        {/* 구글 검색 콘솔 인증 (필요시 추가) */}
        <meta
          name="google-site-verification"
          content="your-verification-code"
        />
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
