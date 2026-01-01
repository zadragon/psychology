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
import { getQuestions } from "./data";
import AdSense from "@/components/AdSense";

export default function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Next.js 16 비동기 파라미터 Unwrapping
  const { id } = React.use(params);
  const router = useRouter();

  // 2. 상태 관리
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 3. Hydration 에러 방지 (setTimeout으로 Cascading 렌더링 방지)
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 4. 데이터 로드 및 진행률 계산
  const allQuestions = getQuestions(id);
  const currentQuestion = allQuestions[step];

  // 방어 코드: 데이터가 로드되지 않았을 경우 대비
  if (!currentQuestion) return null;

  const progressValue = ((step + 1) / allQuestions.length) * 100;

  const handleAnswer = (type: string) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (step < allQuestions.length - 1) {
      setStep(step + 1);
    } else {
      alert("테스트가 완료되었습니다! 결과 페이지로 이동합니다.");
      const resultData = newAnswers.join("");
      router.push(`/test/${id}/result?data=${resultData}`);
    }
  };

  // 클라이언트 마운트 전에는 레이아웃 구조만 렌더링 (깜빡임 방지)
  if (!isMounted) return <Box h="100vh" bg="white" />;

  return (
    <Container maxW="500px" h="100vh" py={10}>
      <VStack gap={10} h="full" justify="center">
        {/* [UI] 상단 프로그레스 바 영역 */}
        <Box w="full">
          <Text
            mb={3}
            textAlign="right"
            fontSize="sm"
            fontWeight="bold"
            color="blue.600"
          >
            STEP {step + 1} / {allQuestions.length}
          </Text>

          <Progress.Root
            value={progressValue}
            colorPalette="blue"
            size="sm"
            shape="rounded"
          >
            <Progress.Track bg="blue.50">
              <Progress.Range transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" />
            </Progress.Track>
          </Progress.Root>
        </Box>

        {/* [UI] 질문 카드 영역 (기존 애니메이션 유지) */}
        <Box w="full" h="450px" position="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ width: "100%", height: "100%" }}
            >
              <Box
                bg="white"
                p={10}
                borderRadius="3xl"
                shadow="0 20px 50px rgba(0,0,0,0.1)"
                h="full"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                border="1px solid"
                borderColor="gray.50"
              >
                <Text
                  fontSize="2xl"
                  fontWeight="black"
                  textAlign="center"
                  mb={12}
                  lineHeight="base"
                  wordBreak="keep-all"
                >
                  {currentQuestion.q}
                </Text>

                <VStack gap={4} w="full">
                  <Button
                    w="full"
                    variant="subtle"
                    colorPalette="blue"
                    size="xl"
                    height="60px"
                    fontSize="md"
                    borderRadius="2xl"
                    onClick={() => handleAnswer("A")}
                    _hover={{ transform: "scale(1.02)" }}
                    transition="all 0.2s"
                  >
                    {currentQuestion.a}
                  </Button>
                  <Button
                    w="full"
                    variant="subtle"
                    colorPalette="blue"
                    size="xl"
                    height="60px"
                    fontSize="md"
                    borderRadius="2xl"
                    onClick={() => handleAnswer("B")}
                    _hover={{ transform: "scale(1.02)" }}
                    transition="all 0.2s"
                  >
                    {currentQuestion.b}
                  </Button>
                  <Button
                    w="full"
                    variant="subtle"
                    colorPalette="blue"
                    size="xl"
                    height="60px"
                    fontSize="md"
                    borderRadius="2xl"
                    onClick={() => handleAnswer("C")}
                    _hover={{ transform: "scale(1.02)" }}
                    transition="all 0.2s"
                  >
                    {currentQuestion.c}
                  </Button>
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
