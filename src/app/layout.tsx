// src/app/layout.tsx
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster"; // 경로가 정확한지 확인

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          {children}
          <Toaster /> {/* 컴포넌트 추가 */}
        </Providers>
      </body>
    </html>
  );
}
