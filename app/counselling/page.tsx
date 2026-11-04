import { CheckCircle2 } from "lucide-react";
import { CourseHeader } from "@/components/courses/course-header";
import { PhotoPanel } from "@/components/courses/photo-panel";
import { CounsellingForm } from "@/components/site/counselling-form";
import { PageHero } from "@/components/site/page-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Free Counselling",
  "Book a free counselling session with the GBET Online admissions team by phone, WhatsApp video or at the Noida office.",
  "/counselling",
);

const TOPICS = [
  "Which course suits your goals and background",
  "Eligibility and the documents you need",
  "Batch dates and how online classes work",
  "Fees, installments and scholarship categories",
  "Career areas the course prepares you for",
];

export default function CounsellingPage() {
  return (
    <div className="bg-white text-ink">
      <CourseHeader />
      <PageHero
        crumb="Free counselling"
        eyebrow="Talk to an advisor"
        title="Free counselling"
        intro="Not sure which course is right for you? Book a free session with an admissions advisor – by phone, WhatsApp video or at our Noida office."
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:py-16">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">What we cover</h2>
            <ul className="mt-4 space-y-3">
              {TOPICS.map((topic) => (
                <li key={topic} className="flex items-start gap-3 text-sm">
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-azure"
                    aria-hidden
                  />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          <PhotoPanel
            src="/photos/hero-class.jpg"
            alt="Learners talking with an advisor"
            className="aspect-[16/10]"
            caption="Counselling is free and there is no obligation to join."
          />
        </div>
        <CounsellingForm />
      </div>
    </div>
  );
}
