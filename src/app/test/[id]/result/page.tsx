"use client";

import React, { useEffect, useState, use, Suspense } from "react";
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
  IconButton,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTestData, getAllTests, ResultDetail } from "../data";
import { FaCopy, FaShareAlt } from "react-icons/fa";
import AdSense from "@/components/AdSense";

// 1. 실제 결과 로직을 담은 컴포넌트
function ResultContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get("data") || "";
  const testInfo = getTestData(id);
  const allTests = getAllTests();
  const [isCopied, setIsCopied] = useState(false);

  // 결과 계산 로직
  const getCalculatedResult = (): ResultDetail => {
    if (testInfo.type === "SCORE_RANGE") {
      const totalScore = data.split("").reduce((acc, curr) => {
        const score = parseInt(curr);
        if (isNaN(score)) {
          if (curr === "A") return acc + 1;
          if (curr === "B") return acc + 2;
          if (curr === "C") return acc + 3;
          if (curr === "D") return acc + 4;
          return acc + 0;
        }
        return acc + score;
      }, 0);

      const results = testInfo.results as ResultDetail[];
      return (
        results.find(
          (r) =>
            totalScore >= (r.range?.[0] || 0) &&
            totalScore <= (r.range?.[1] || 0)
        ) || results[0]
      );
    }

    const counts = {
      A: (data.match(/A/g) || []).length,
      B: (data.match(/B/g) || []).length,
      C: (data.match(/C/g) || []).length,
    };

    let resultKey = "";
    if (id === "2") {
      if (counts.B >= 7) resultKey = "high";
      else if (counts.B >= 4) resultKey = "mid";
      else resultKey = "low";
    } else {
      resultKey = Object.keys(counts).reduce((a, b) =>
        counts[a as keyof typeof counts] > counts[b as keyof typeof counts]
          ? a
          : b
      );
    }
    const results = testInfo.results as Record<string, ResultDetail>;
    return results[resultKey];
  };

  const result = getCalculatedResult();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      alert("링크가 복사되었습니다!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <VStack gap={12} align="stretch">
      <VStack gap={4} textAlign="center">
        <Text color="blue.500" fontWeight="bold" fontSize="xs">
          YOUR TEST RESULT
        </Text>
        <Heading
          size="3xl"
          fontWeight="black"
          color={result.color || "inherit"}
        >
          {result.title}
        </Heading>
        <Text fontSize="lg" color="gray.600" px={4} whiteSpace="pre-wrap">
          {result.desc}
        </Text>
      </VStack>

      <AdSense slot="9912210030" />

      {testInfo.type === "SCORE_RANGE" ? (
        <Box p={8} bg="blue.50" borderRadius="3xl">
          <Heading size="md" mb={8} color="blue.700">
            📋 당신을 위한 맞춤 퀘스트
          </Heading>
          <VStack align="start" gap={5}>
            {result.quests?.map((quest, index) => (
              <Flex key={index} gap={4} align="center">
                <Center
                  w="32px"
                  h="32px"
                  bg="white"
                  color="blue.500"
                  borderRadius="lg"
                  shadow="sm"
                  fontWeight="bold"
                >
                  {index + 1}
                </Center>
                <Text fontSize="md" color="blue.900" fontWeight="bold">
                  {quest}
                </Text>
              </Flex>
            ))}
          </VStack>
        </Box>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Box p={6} bg="green.50" borderRadius="2xl">
              <Text fontWeight="bold" color="green.700">
                💪 강점
              </Text>
              <Text fontSize="sm">{result.strengths}</Text>
            </Box>
            <Box p={6} bg="red.50" borderRadius="2xl">
              <Text fontWeight="bold" color="red.700">
                ⚠️ 주의할 점
              </Text>
              <Text fontSize="sm">{result.weaknesses}</Text>
            </Box>
          </SimpleGrid>
          {result.advice && (
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
          )}
        </>
      )}

      {/* 공유 버튼 및 추천 섹션 */}
      <VStack gap={6} pt={6} borderTop="1px solid" borderColor="gray.100">
        <Text fontWeight="bold" fontSize="sm">
          이 결과를 친구에게 공유하기
        </Text>
        <Flex gap={8}>
          <VStack>
            <IconButton
              aria-label="Copy"
              rounded="full"
              size="xl"
              variant={isCopied ? "solid" : "subtle"}
              colorPalette="blue"
              onClick={handleCopy}
            >
              <FaCopy />
            </IconButton>
            <Text fontSize="xs">{isCopied ? "복사완료!" : "링크복사"}</Text>
          </VStack>
          <VStack>
            <IconButton
              aria-label="Share"
              rounded="full"
              size="xl"
              variant="subtle"
              onClick={handleCopy}
            >
              <FaShareAlt />
            </IconButton>
            <Text fontSize="xs">기타공유</Text>
          </VStack>
        </Flex>
      </VStack>

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
  );
}

// 2. 페이지 메인 (Suspense로 감싸서 Hydration 에러 방지)
export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <Container maxW="600px" py={16}>
      <Suspense
        fallback={
          <Center h="50vh">
            <Text fontWeight="bold" color="blue.500">
              결과 데이터를 불러오는 중입니다...
            </Text>
          </Center>
        }
      >
        <ResultContent id={resolvedParams.id} />
      </Suspense>
    </Container>
  );
}
