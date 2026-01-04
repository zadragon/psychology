"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Progress,
  Container,
  Flex,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getQuestions, getTestData } from "./data";
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

  const testInfo = getTestData(id);
  const allQuestions = getQuestions(id);
  const currentQuestion = allQuestions[step];

  if (!currentQuestion) return null;

  // 상단 프로그레스 바 수치 계산
  const progressValue = ((step + 1) / allQuestions.length) * 100;

  const handleAnswer = (choice: string) => {
    const newAnswers = [...answers, choice];

    if (step < allQuestions.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      let resultData = "";
      if (testInfo.type === "SCORE_RANGE") {
        resultData = newAnswers
          .map((a) => ({ A: "1", B: "2", C: "3", D: "4" }[a] || "1"))
          .join("");
      } else {
        resultData = newAnswers.join("");
      }
      router.push(`/test/${id}/result?data=${resultData}`);
    }
  };

  if (!isMounted) return <Box h="100vh" bg="white" />;

  return (
    <Container maxW="500px" h="100vh" py={10} overflow="hidden">
      <VStack gap={8} h="full" justify="center" align="stretch">
        {/* 1. 상단 프로그레스 바 영역 */}

        <Box w="full" px={2} py={2}>
          <Flex justify="space-between" mb={2} align="end">
            <Text fontWeight="black" color="blue.500" fontSize="lg">
              Q{step + 1}
            </Text>
            <Text fontSize="xs" color="gray.400">
              {step + 1} / {allQuestions.length}
            </Text>
          </Flex>

          {/* v3 표준 구조 */}
          <Progress.Root
            value={progressValue}
            size="sm"
            colorPalette="blue"
            borderRadius="full"
          >
            <Progress.Track bg="blue.50">
              <Progress.Range borderRadius="full" />
            </Progress.Track>
          </Progress.Root>
        </Box>

        {/* 2. 카드 슬라이드 애니메이션 영역 */}
        <Box w="full" h="520px" position="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 100, opacity: 0 }} // 새 카드가 오른쪽(100)에서 나타남
              animate={{ x: 0, opacity: 1 }} // 제자리로 이동
              exit={{ x: -100, opacity: 0 }} // 기존 카드가 왼쪽(-100)으로 나감
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ width: "100%", height: "100%" }}
            >
              <Box
                w="full"
                h="full"
                bg="white"
                p={8}
                borderRadius="3xl"
                shadow="2xl"
                border="1px solid"
                borderColor="gray.100"
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Text
                  fontSize="2xl"
                  fontWeight="black"
                  textAlign="center"
                  mb={12}
                  lineHeight="1.4"
                  wordBreak="keep-all"
                >
                  {currentQuestion.q}
                </Text>

                <VStack gap={4} w="full">
                  {["a", "b", "c"].map((key) => (
                    <Button
                      key={key}
                      w="full"
                      variant="subtle"
                      colorPalette="blue"
                      size="xl"
                      height="64px"
                      borderRadius="2xl"
                      fontSize="md"
                      whiteSpace="normal" // 긴 텍스트 줄바꿈 허용
                      onClick={() => handleAnswer(key.toUpperCase())}
                      _hover={{ transform: "scale(1.02)", bg: "blue.100" }}
                      transition="all 0.2s"
                    >
                      {currentQuestion[key as keyof typeof currentQuestion]}
                    </Button>
                  ))}

                  {currentQuestion.d && (
                    <Button
                      w="full"
                      variant="subtle"
                      colorPalette="blue"
                      size="xl"
                      height="64px"
                      borderRadius="2xl"
                      fontSize="md"
                      whiteSpace="normal"
                      onClick={() => handleAnswer("D")}
                      _hover={{ transform: "scale(1.02)", bg: "blue.100" }}
                      transition="all 0.2s"
                    >
                      {currentQuestion.d}
                    </Button>
                  )}
                </VStack>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* 하단 제어 영역 */}
        <VStack gap={4}>
          <Button
            variant="ghost"
            color="gray.400"
            size="sm"
            onClick={() => router.back()}
            _hover={{ color: "red.400" }}
          >
            테스트 중단하기
          </Button>
        </VStack>
      </VStack>
      <AdSense slot="9912210030" />
    </Container>
  );
}
