"use client";

import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

interface AdSenseProps {
  slot: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSenseProps {
  slot: string;
}

export default function AdDisplay({ slot }: AdSenseProps) {
  const adCalled = useRef(false); // 중복 호출 방지를 위한 플래그

  useEffect(() => {
    // 1. 이미 광고를 불렀거나, 윈도우 객체가 없으면 실행 안 함
    if (adCalled.current || typeof window === "undefined") return;

    try {
      if (window.adsbygoogle) {
        // 2. 현재 슬롯에 해당하는 태그 중 아직 처리가 안 된 것만 타겟팅
        const insElement = document.querySelector(
          `.adsbygoogle[data-ad-slot="${slot}"]:not([data-adsbygoogle-status="done"])`
        );

        if (insElement) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adCalled.current = true; // 호출 완료 표시
        }
      }
    } catch (e) {
      console.error("AdSense push error:", e);
    }
  }, [slot]); // 슬롯이 변경될 때만 재실행

  return (
    <Box my={10} textAlign="center" overflow="hidden" minH="280px">
      {/* 구글에서 받은 ins 태그 그대로 복사 */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_AD_CLIENT_ID}`} // 본인의 클라이언트 ID
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </Box>
  );
}
