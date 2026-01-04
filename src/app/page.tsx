"use client";

import {
  SimpleGrid,
  Box,
  Heading,
  Text,
  Container,
  VStack,
  Center,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { getAllTests } from "./test/[id]/data"; // 데이터 통합 로드
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const tests = getAllTests();

  return (
    <Box bg="gray.50" minH="100vh" py={20}>
      <Container maxW="1000px">
        <VStack gap={10} align="center" mb={16} textAlign="center">
          <Box width="100%">
            <Image
              src="/images/title/title.png"
              width={1200} // 원본의 가로 비율 (큰 값 입력)
              height={400} // 원하는 세로 비율 (예: 3:1 비율)
              style={{ width: "100%", height: "auto" }} // 가로는 꽉 차고 세로는 자동
              alt="타이틀"
              placeholder="blur"
              blurDataURL="..."
            />
          </Box>

          <Heading size="3xl" fontWeight="black" color="blue.700">
            심리 퀘스트에 오신 것을 환영합니다!
          </Heading>
          <Text fontSize="xl" color="gray.500" maxW="600px">
            아래에서 진행하고 싶은 테스트를 선택하세요.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
          {tests.reverse().map((test) => (
            <Box
              key={test.id}
              bg="white"
              borderRadius="3xl"
              overflow="hidden"
              cursor="pointer"
              transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              onClick={() => router.push(`/test/${test.id}`)}
              _hover={{
                transform: "translateY(-12px)",
                shadow: "2xl",
              }}
              border="1px solid"
              borderColor="gray.100"
              position="relative"
            >
              <div>
                <Box
                  position="relative"
                  width="100%" // 좌우 꽉 차게
                  height="200px" // 높이 200 고정
                  overflow="hidden"
                >
                  <Image
                    src={test.imageUrl}
                    fill // 부모 Box 크기에 맞게 꽉 채움
                    style={{ objectFit: "cover" }} // 이미지 비율 유지하며 꽉 채우기
                    alt={test.description}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPdw676agAAAABJRU5ErkJggg=="
                  />
                </Box>
              </div>

              <VStack p={8} align="start" gap={4}>
                <Badge
                  colorPalette="blue"
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="lg"
                >
                  {test.genderBased
                    ? test.genderQuestions?.male.length || 0
                    : test.questions.length}
                  QUESTIONS
                </Badge>
                <Heading size="md" fontWeight="bold">
                  {test.title}
                </Heading>
                <Text fontSize="sm" color="gray.500" lineHeight="tall">
                  {test.description}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
