import type { MetadataRoute } from "next";
import { ONLINE_COURSES } from "@/lib/courses";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...["", "/courses", "/contact", "/brochure", "/apply", "/counselling", "/compare", "/scholarships", "/faq", "/news"].map((path) => ({
      url: `${SITE.url}${path || "/"}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...ONLINE_COURSES.map((course) => ({
      url: `${SITE.url}/courses/${course.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
