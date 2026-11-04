import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { AdmissionEnquiryForm } from "@/components/courses/admission-enquiry-form";
import { CareerSection } from "@/components/courses/career-section";
import { CourseDetailsHero } from "@/components/courses/course-details-hero";
import { CourseHeader } from "@/components/courses/course-header";
import { CourseMobileCta } from "@/components/courses/course-mobile-cta";
import { CurriculumAccordion } from "@/components/courses/curriculum-accordion";
import { FacultyCard } from "@/components/courses/faculty-card";
import { FAQAccordion } from "@/components/courses/faq-accordion";
import { LearningFeatures } from "@/components/courses/learning-features";
import { PhotoPanel } from "@/components/courses/photo-panel";
import { RelatedCourses } from "@/components/courses/related-courses";
import { getRelatedCourses, type CatalogCourse } from "@/lib/course-catalog";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "curriculum", label: "Curriculum" },
  { id: "features", label: "Learning features" },
  { id: "faculty", label: "Faculty" },
  { id: "careers", label: "Careers" },
  { id: "faqs", label: "FAQs" },
  { id: "enquiry", label: "Enquire" },
] as const;

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  invert = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  invert?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p
        className={cn(
          "text-xs font-bold tracking-[0.16em] uppercase",
          invert ? "text-sky-300" : "text-azure",
        )}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          "mt-2 text-2xl leading-tight font-bold sm:text-3xl",
          invert ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3 leading-7",
            invert ? "text-white/70" : "text-ink-soft",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

function Section({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-32", className)}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        {children}
      </div>
    </section>
  );
}

export function CourseDetailsView({ course }: { course: CatalogCourse }) {
  const related = getRelatedCourses(course);
  const topics = course.curriculum.reduce(
    (sum, module) => sum + module.topics.length,
    0,
  );

  return (
    <div className="bg-white text-ink">
      <CourseHeader courseTitle={course.title} />
      <CourseDetailsHero course={course} />

      <nav
        aria-label="Course sections"
        className="sticky top-[4.25rem] z-30 border-b border-line bg-white/95 backdrop-blur"
      >
        <ul className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {SECTIONS.map((section) => (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                className="inline-flex h-12 items-center border-b-2 border-transparent px-3 text-sm font-semibold whitespace-nowrap text-ink-soft transition hover:border-azure hover:text-ink"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section id="overview">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-azure uppercase">
              Course overview
            </p>
            <h2
              id="overview-heading"
              className="mt-2 text-2xl leading-tight font-bold sm:text-3xl"
            >
              What you will learn
            </h2>
            <p className="mt-4 leading-7 text-ink-soft">{course.description}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {course.learningOutcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-start gap-3 rounded-xl bg-mist p-4 text-sm text-ink"
                >
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-azure"
                    aria-hidden
                  />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
          <aside className="h-fit rounded-2xl border border-line p-6">
            <h3 className="font-semibold">At a glance</h3>
            <dl className="mt-4 divide-y divide-line text-sm">
              {[
                ["Programme", course.programmeType],
                ["Category", course.categoryLabel],
                ["Duration", course.duration],
                [
                  "Modules",
                  `${course.curriculum.length} modules, ${topics} topics`,
                ],
                ["Delivery", "Recorded lectures and live sessions"],
                ["Eligibility", course.eligibility],
                ["Fees", "Shared during counselling"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-ink-soft">{label}</dt>
                  <dd className="text-right font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </Section>

      <Section id="curriculum" className="bg-mist">
        <div>
          <SectionHeading
            id="curriculum-heading"
            eyebrow="Course curriculum"
            title={`${course.curriculum.length} modules, from foundations to a final project`}
            description="Each module combines recorded lectures, a live session and a practical assignment. Open a module to see the topics and what you will be able to do by the end of it."
          />
        </div>
        <div className="mt-8">
          <CurriculumAccordion modules={course.curriculum} />
        </div>
      </Section>

      <Section id="features">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="flex flex-col">
            <SectionHeading
              id="features-heading"
              eyebrow="Learning features"
              title="How the course is delivered"
              description="Study online at your own pace, with scheduled live sessions for guidance and review."
            />
            <PhotoPanel
              src="/photos/hero-class.jpg"
              alt="Learners working together on laptops"
              caption="Recorded lectures, live sessions and practical work"
              className="mt-8 aspect-[16/10] lg:aspect-auto lg:min-h-72 lg:flex-1"
            />
          </div>
          <LearningFeatures features={course.learningFeatures} />
        </div>
      </Section>

      <Section id="faculty" className="bg-mist">
        <div>
          <SectionHeading
            id="faculty-heading"
            eyebrow="Faculty"
            title="Who teaches the course"
            description="Faculty names and profiles are confirmed for each batch. The profiles below are placeholders that show the roles involved in teaching this course."
          />
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {course.faculty.map((member) => (
            <li key={member.name}>
              <FacultyCard faculty={member} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="careers" className="bg-ink">
        <div>
          <SectionHeading
            id="careers-heading"
            invert
            eyebrow="Career opportunities"
            title="Where these skills are used"
            description={`Roles where the skills from the ${course.title} are relevant.`}
          />
        </div>
        <div className="mt-8">
          <CareerSection
            careers={course.careerOpportunities}
            courseTitle={course.title}
          />
        </div>
      </Section>

      <Section id="faqs">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading
              id="faqs-heading"
              eyebrow="FAQs"
              title="Frequently asked questions"
              description={`Still have a question? Call the admissions team on ${SITE.phone}.`}
            />
            <PhotoPanel
              src="/photos/library.jpg"
              alt="Shelves of books"
              className="mt-8 hidden aspect-[4/3] lg:block"
            />
          </div>
          <FAQAccordion faqs={course.faqs} />
        </div>
      </Section>

      <Section id="enquiry" className="bg-mist">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              id="enquiry-heading"
              eyebrow={`Admissions ${SITE.year}`}
              title={`Enquire about the ${course.shortTitle} course`}
              description="Fill in the form and an admissions advisor will call you to explain eligibility, batch dates and fees."
            />
            <div className="mt-6 rounded-2xl border border-line bg-white p-5 text-sm">
              <p className="font-semibold">Prefer to talk now?</p>
              <a
                href={`tel:${SITE.phoneTel}`}
                className="mt-1 block text-azure hover:text-azure-dark"
              >
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-1 block text-azure hover:text-azure-dark"
              >
                {SITE.email}
              </a>
            </div>
            <PhotoPanel
              src="/photos/computer.jpg"
              alt="Learner using a laptop"
              className="mt-6 hidden aspect-[16/11] lg:block"
            />
          </div>
          <AdmissionEnquiryForm
            defaultCourse={course.title}
            title={`Enquire about ${course.shortTitle}`}
          />
        </div>
      </Section>

      <RelatedCourses courses={related} />
      <CourseMobileCta courseTitle={course.title} />
    </div>
  );
}
