import { COURSES } from "@/lib/courses";
import { SITE } from "@/lib/site";

export function whatsappLink(text?: string) {
  const message =
    text ??
    `Hello GBTE, I want admission counselling for ${SITE.year}. Please call me.`;
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function enquiryWhatsappMessage(payload: {
  fullName: string;
  mobile: string;
  email?: string;
  course?: string;
  city?: string;
  state?: string;
  message?: string;
}) {
  return [
    "New GBTE admission enquiry",
    `Name: ${payload.fullName}`,
    `Mobile: ${payload.mobile}`,
    payload.email ? `Email: ${payload.email}` : null,
    payload.course ? `Course: ${payload.course}` : null,
    payload.city || payload.state ? `Location: ${[payload.city, payload.state].filter(Boolean).join(", ")}` : null,
    payload.message ? `Message: ${payload.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export const COURSE_OPTIONS = COURSES.map((course) => course.name);
