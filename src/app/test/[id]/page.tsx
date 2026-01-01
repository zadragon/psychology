"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Progress,
  Container,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getQuestions, getTestData } from "./data"; // getTestData 추가
import AdSense from "@/components/AdSense";

export default function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const testInfo = getTestData(id); // 테스트 정보(type 확인용)
  const allQuestions = getQuestions(id);
  const currentQuestion = allQuestions[step];

  if (!currentQuestion) return null;

  const progressValue = ((step + 1) / allQuestions.length) * 100;

  const handleAnswer = (choice: string) => {
    const newAnswers = [...answers, choice];

    if (step < allQuestions.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      // [로직 수정] 결과 페이지로 이동 시 데이터 변환
      let resultData = "";

      if (testInfo.type === "SCORE_RANGE") {
        // 주부 스트레스(SCORE_RANGE)인 경우 숫자로 변환 (A=1, B=2, C=3, D=4)
        resultData = newAnswers
          .map((a) => {
            if (a === "A") return "1";
            if (a === "B") return "2";
            if (a === "C") return "3";
            if (a === "D") return "4";
            return "1";
          })
          .join("");
      } else {
        // 기존 성향 테스트는 그대로 "ABC" 형태
        resultData = newAnswers.join("");
      }

      router.push(`/test/${id}/result?data=${resultData}`);
    }
  };

  if (!isMounted) return <Box h="100vh" bg="white" />;

  return (
    <Container maxW="500px" h="100vh" py={10}>
      <VStack gap={10} h="full" justify="center">
        {/* 프로그레스 바 영역 생략 (기존과 동일) */}

        <Box w="full" h="500px" position="relative">
          {" "}
          {/* 높이를 약간 늘림 */}
          <AnimatePresence mode="wait">
            <motion.div key={step} /* 애니메이션 설정 생략 (기존과 동일) */>
              <Box /* 카드 스타일 생략 (기존과 동일) */>
                <Text
                  fontSize="2xl"
                  fontWeight="black"
                  textAlign="center"
                  mb={10}
                  wordBreak="keep-all"
                >
                  {currentQuestion.q}
                </Text>

                <VStack gap={3} w="full">
                  {/* A, B, C 버튼은 항상 렌더링 */}
                  {["a", "b", "c"].map((key) => (
                    <Button
                      key={key}
                      w="full"
                      variant="subtle"
                      colorPalette="blue"
                      size="xl"
                      height="56px"
                      borderRadius="2xl"
                      onClick={() => handleAnswer(key.toUpperCase())}
                    >
                      {currentQuestion[key as keyof typeof currentQuestion]}
                    </Button>
                  ))}

                  {/* [핵심] D 선택지가 있을 때만 버튼 렌더링 */}
                  {currentQuestion.d && (
                    <Button
                      w="full"
                      variant="subtle"
                      colorPalette="blue"
                      size="xl"
                      height="56px"
                      borderRadius="2xl"
                      onClick={() => handleAnswer("D")}
                    >
                      {currentQuestion.d}
                    </Button>
                  )}
                </VStack>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>

        <Button
          variant="ghost"
          color="gray.400"
          size="sm"
          onClick={() => router.back()}
        >
          테스트 중단하기
        </Button>
      </VStack>
      <AdSense slot="9912210030" />
    </Container>
  );
}
