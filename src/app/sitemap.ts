import { MetadataRoute } from "next";
import { getAllTests } from "./test/[id]/data";

export default function sitemap(): MetadataRoute.Sitemap {
  // 배포 후 .env 파일에 NEXT_PUBLIC_SITE_URL을 설정하세요
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  const tests = getAllTests();

  // 메인 페이지
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // 각 테스트 페이지 추가
  tests.forEach((test) => {
    routes.push({
      url: `${baseUrl}/test/${test.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  return routes;
}
