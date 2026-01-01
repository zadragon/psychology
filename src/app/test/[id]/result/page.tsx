"use client";

import React from "react";
import {
  Box,
  VStack,
  Text,
  Heading,
  Button,
  Container,
  SimpleGrid,
  Flex,
  Center,
  useClipboard,
  IconButton,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTestData, getAllTests } from "../data";
import { FaCopy, FaShareAlt } from "react-icons/fa";
import AdSense from "@/components/AdSense"; // 아까 만든 광고 컴포넌트

export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get("data") || "";

  const testInfo = getTestData(id);
  const allTests = getAllTests();

  // 1. 답변 통계 및 결과 타입 결정
  const counts = {
    A: (data.match(/A/g) || []).length,
    B: (data.match(/B/g) || []).length,
    C: (data.match(/C/g) || []).length,
  };

  const getResultKey = () => {
    if (id === "2") {
      if (counts.B >= 7) return "high";
      if (counts.B >= 4) return "mid";
      return "low";
    }
    return Object.keys(counts).reduce((a, b) =>
      counts[a as keyof typeof counts] > counts[b as keyof typeof counts]
        ? a
        : b
    );
  };

  const result = testInfo.results[getResultKey()];

  // 2. 공유 관련 로직 (URL 복사)
  const currentResultUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const { copy, copied } = useClipboard({ value: currentResultUrl });

  // 3. 웹 표준 공유 API
  const shareWeb = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `[${testInfo.title}] 결과 확인`,
          text: `당신은 '${result.title}' 유형입니다! 결과를 확인해보세요.`,
          url: currentResultUrl,
        });
      } catch (error) {
        console.log("공유 실패:", error);
      }
    } else {
      copy(); // 공유 API 미지원 시 자동으로 클립보드 복사 실행
      alert("링크가 복사되었습니다!");
    }
  };

  return (
    <Container maxW="600px" py={16}>
      <VStack gap={12} align="stretch">
        {/* 상단 타이틀 섹션 */}
        <VStack gap={4} textAlign="center">
          <Text
            color="blue.500"
            fontWeight="bold"
            letterSpacing="widest"
            fontSize="xs"
          >
            YOUR TEST RESULT
          </Text>
          <Heading
            size="3xl"
            fontWeight="black"
            lineHeight="1.2"
            wordBreak="keep-all"
          >
            {result.title}
          </Heading>
          <Text
            fontSize="lg"
            color="gray.600"
            px={4}
            whiteSpace="pre-wrap"
            lineHeight="tall"
          >
            {result.desc}
          </Text>
        </VStack>

        {/* --- 광고 배치 포인트 A: 결과 요약 바로 아래 --- */}
        <AdSense slot="9912210030" />

        {/* 강점 & 약점 카드 */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Box
            p={6}
            bg="green.50"
            borderRadius="2xl"
            border="1px solid"
            borderColor="green.100"
          >
            <Text fontWeight="bold" color="green.700" mb={2}>
              💪 강점
            </Text>
            <Text fontSize="sm" color="green.900">
              {result.strengths}
            </Text>
          </Box>
          <Box
            p={6}
            bg="red.50"
            borderRadius="2xl"
            border="1px solid"
            borderColor="red.100"
          >
            <Text fontWeight="bold" color="red.700" mb={2}>
              ⚠️ 주의할 점
            </Text>
            <Text fontSize="sm" color="red.900">
              {result.weaknesses}
            </Text>
          </Box>
        </SimpleGrid>

        {/* 10줄 조언 (솔루션 리스트) */}
        <Box
          p={8}
          bg="white"
          borderRadius="3xl"
          shadow="sm"
          border="1px solid"
          borderColor="gray.100"
        >
          <Heading size="md" mb={8} color="blue.700">
            ✨ 당신을 위한 10계명 솔루션
          </Heading>
          <VStack align="start" gap={5}>
            {result.advice.split("\n").map((line, index) => (
              <Flex key={index} gap={4} align="start">
                <Center
                  minW="24px"
                  h="24px"
                  bg="blue.50"
                  color="blue.500"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {index + 1}
                </Center>
                <Text fontSize="md" color="gray.700" lineHeight="1.6">
                  {line.trim().replace(/^\d+\.\s*/, "")}
                </Text>
              </Flex>
            ))}
          </VStack>
        </Box>

        {/* --- 공유하기 섹션 --- */}
        <VStack
          gap={6}
          w="full"
          pt={6}
          borderTop="1px solid"
          borderColor="gray.100"
        >
          <Text fontWeight="bold" color="gray.600" fontSize="sm">
            이 결과를 친구에게 공유하기
          </Text>
          <Flex gap={8}>
            <VStack>
              <IconButton
                aria-label="Copy Link"
                rounded="full"
                size="xl"
                // hasCopied 대신 copied를 사용합니다.
                variant={copied ? "solid" : "subtle"}
                colorPalette="blue"
                // onCopy 대신 copy 함수를 호출합니다.
                onClick={copy}
              >
                <FaCopy />
              </IconButton>

              <Text fontSize="xs" color="gray.500">
                {copied ? "복사완료!" : "링크복사"}
              </Text>
            </VStack>

            <VStack>
              <IconButton
                aria-label="More Share"
                rounded="full"
                size="xl"
                variant="subtle"
                colorPalette="gray"
                onClick={shareWeb}
              >
                <FaShareAlt />
              </IconButton>
              <Text fontSize="xs" color="gray.500">
                기타공유
              </Text>
            </VStack>
          </Flex>
        </VStack>

        {/* --- 다른 테스트 추천 --- */}
        <Box pt={8} borderTop="1px solid" borderColor="gray.100">
          <Text fontWeight="bold" mb={4} fontSize="lg">
            다른 테스트 추천
          </Text>
          <SimpleGrid columns={2} gap={4}>
            {allTests
              .filter((t) => t.id !== id)
              .map((test) => (
                <Box
                  key={test.id}
                  p={5}
                  border="1px solid"
                  borderColor="gray.100"
                  borderRadius="xl"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ shadow: "md", transform: "translateY(-4px)" }}
                  onClick={() => router.push(`/test/${test.id}`)}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    {test.title}
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    자세히 보기 &gt;
                  </Text>
                </Box>
              ))}
          </SimpleGrid>
        </Box>

        <Button
          size="xl"
          colorPalette="blue"
          w="full"
          borderRadius="full"
          height="64px"
          onClick={() => router.push("/")}
        >
          메인으로 돌아가기
        </Button>
      </VStack>
    </Container>
  );
}
