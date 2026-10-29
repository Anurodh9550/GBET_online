"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Calendar, Check, ChevronDown, Clock, FolderOpen, MapPin, Menu, Phone, Star, X } from "lucide-react";
import { BrochureDialog } from "@/components/online/brochure-dialog";
import { CoursesMenu } from "@/components/online/courses-menu";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { useI18n } from "@/components/providers/language-provider";
import { SUCCESS_STORIES } from "@/lib/content";
import { curriculumTotals, formatClock, getCurriculum } from "@/lib/curriculum";
import { CATEGORIES, ONLINE_COURSES, courseKind, getOnlineCourse, programmeLabel, type CourseCategory } from "@/lib/courses";
import { HIRING_COMPANIES, SITE } from "@/lib/site";

const TOOLS: Record<CourseCategory, string[]> = {
  design: ["CAD", "Illustration", "Pattern", "Lookbook"],
  media: ["Edit desk", "Shot list", "Script", "Audio"],
  arts: ["Studio", "Lighting", "Reel", "Portfolio"],
  wellness: ["Diet sheet", "Case log", "Session", "Notes"],
  hospitality: ["Front desk", "Guest log", "Budget", "Service"],
  business: ["CRM", "Brief", "Reports", "Follow-up"],
  ai: ["Python", "Notebook", "Data", "Capstone"],
  pharmacy: ["Dispensing", "Drug chart", "Store", "Lab notes"],
  education: ["Lesson", "Classroom", "Internship", "Assessment"],
  paramedical: ["Lab book", "Samples", "Safety", "Reports"],
};

function splitTitle(name: string) {
  const markers = ["Diploma in ", "Certificate in ", "Bachelor of ", "डिप्लोमा इन ", "सर्टिफिकेट इन ", "बैचलर ऑफ "];
  for (const marker of markers) {
    if (name.startsWith(marker)) {
      return { lead: marker.trim(), accent: name.slice(marker.length) };
    }
  }
  return { lead: name, accent: "" };
}

export function CourseDetail({ slug }: { slug: string }) {
  const course = getOnlineCourse(slug);
  const { locale } = useI18n();
  const hi = locale === "hi";
  const [menu, setMenu] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [panel, setPanel] = useState<"lessons" | "pieces">("lessons");
  const [openModule, setOpenModule] = useState(0);

  useEffect(() => {
    setPanel("lessons");
    setOpenModule(0);
  }, [slug]);

  if (!course) return null;

  const category = CATEGORIES.find((item) => item.id === course.category);
  const learn = hi ? course.learnHi : course.learn;
  const careers = hi ? course.careersHi : course.careers;
  const title = splitTitle(hi ? course.nameHi : course.name);
  const kind = programmeLabel(courseKind(course), hi);
  const tools = TOOLS[course.category];
  const stories = SUCCESS_STORIES.slice(0, 3);
  const related = ONLINE_COURSES.filter((item) => item.category === course.category && item.slug !== course.slug).slice(0, 3);
  const modules = getCurriculum(course);
  const totals = curriculumTotals(modules);

  return (
    <div className="bg-[#fcfaf7] text-[#3d2918]">
      <header className="sticky top-0 z-50 border-b border-[#ebe4dc] bg-[#fcfaf7]/95 backdrop-blur">
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="GBET Online home">
            <span className="relative size-11 overflow-hidden rounded-full ring-2 ring-brand">
              <Image src="/logo.png" alt="" fill className="object-cover" sizes="44px" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-bold">GBET Online</span>
              <span className="hidden text-[11px] text-stone-500 sm:block">Gautam Buddha Educational Trust</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            <Link href="/">{hi ? "होम" : "Home"}</Link>
            <CoursesMenu active onBrochure={() => setBrochureOpen(true)} />
            <Link href="/#stories">{hi ? "कहानियाँ" : "Stories"}</Link>
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <a href={`${SITE.campusUrl}/login/student`} className="px-3 py-2 text-sm font-semibold">{hi ? "लॉगिन" : "Login"}</a>
            <a href="#enquiry" className="rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white">{hi ? "पूछताछ करें" : "Enquire now"}</a>
          </div>
          <button type="button" className="grid size-10 place-items-center rounded-full border border-[#ebe4dc] lg:hidden" onClick={() => setMenu((value) => !value)} aria-label="Menu">
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {menu ? (
          <div className="space-y-3 border-t border-[#ebe4dc] px-4 py-4 text-sm font-semibold lg:hidden">
            <Link href="/" onClick={() => setMenu(false)} className="block">{hi ? "होम" : "Home"}</Link>
            <Link href="/courses" onClick={() => setMenu(false)} className="block">{hi ? "कोर्स" : "Courses"}</Link>
            <a href="#enquiry" onClick={() => setMenu(false)} className="block">{hi ? "पूछताछ करें" : "Enquire now"}</a>
          </div>
        ) : null}
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:py-12">
        <div>
          <p className="text-sm text-stone-500">
            <Link href="/" className="hover:text-brand">{hi ? "होम" : "Home"}</Link>
            <span className="px-2">/</span>
            <Link href="/courses" className="hover:text-brand">{hi ? "ऑनलाइन कोर्स" : "Online courses"}</Link>
            <span className="px-2">/</span>
            <span>{hi ? course.nameHi : course.name}</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white">
              {kind}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-[#ebe4dc]">
              {hi ? course.durationHi : course.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ebe4dc] bg-white px-3 py-1.5 text-xs font-semibold">
              <MapPin className="size-3.5 text-brand" /> {category ? (hi ? category.labelHi : category.label) : (hi ? "ऑनलाइन" : "Online")}
            </span>
          </div>
          <h1 className="mt-5 font-serif text-4xl leading-[1.05] text-[#3d2918] sm:text-6xl">
            {title.lead}
            {title.accent ? <span className="mt-1 block text-brand">{title.accent}</span> : null}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">{hi ? course.overviewHi : course.overview}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 ring-1 ring-[#ebe4dc]">
              <Star className="size-4 fill-brand text-brand" />
              <strong>{course.rating}</strong>
              <span className="text-stone-500">({course.reviews} {hi ? "समीक्षा" : "reviews"})</span>
            </span>
            <span className="font-semibold">{course.enrolled} {hi ? "नामांकित" : "enrolled"}</span>
          </p>
          <div className="mt-5 space-y-2 text-sm font-medium">
            <p className="flex items-center gap-2">
              <Calendar className="size-4 text-brand" />
              {hi ? `${SITE.year} सत्र की काउंसलिंग खुली है` : `Counselling is open for the ${SITE.year} session`}
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="size-4 text-brand" />
              {hi ? "बैच नोएडा डेस्क की कॉल पर पक्का होता है" : "The Noida desk confirms your batch on the call"}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a href="#enquiry" className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white">
              {hi ? "पूछताछ करें" : "Enquire now"} <ArrowRight className="size-4" />
            </a>
            <button type="button" className="inline-flex h-12 items-center rounded-full bg-[#3d2918] px-6 text-sm font-semibold text-white" onClick={() => setBrochureOpen(true)}>
              {hi ? "ब्रोशर डाउनलोड" : "Download brochure"}
            </button>
          </div>
          <p className="mt-3 text-xs text-stone-500">
            {hi ? "काउंसलिंग कॉल इसी कोर्स की सीट, दस्तावेज़ और शुल्क पर होती है।" : "The counselling call covers the seat, documents and fee for this course."}
          </p>
        </div>
        <div className="relative min-h-80 overflow-hidden rounded-[1.6rem] sm:min-h-[28rem]">
          <Image src={course.image} alt={hi ? course.nameHi : course.name} fill priority className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="flex flex-col gap-4 rounded-full border border-[#ebe4dc] bg-white px-5 py-3 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-8 pr-8 text-sm font-semibold text-stone-600">
              {[...HIRING_COMPANIES, ...HIRING_COMPANIES].map((name, index) => (
                <span key={`${name}-${index}`} className="shrink-0">{name}</span>
              ))}
            </div>
          </div>
          <a href={`tel:${SITE.phoneTel}`} className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold">
            <Phone className="size-4" />
            {hi ? "नोएडा डेस्क" : "Noida desk"}: {SITE.phone}
          </a>
        </div>
      </div>

      <section className="border-y border-[#ebe4dc] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3">
          <div>
            <h2 className="font-serif text-3xl text-[#3d2918]">{hi ? "पहली भूमिका" : "First roles"}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {careers.map((item) => (
                <span key={item} className="rounded-full border border-[#ebe4dc] bg-[#fcfaf7] px-3 py-1.5 text-sm">{item}</span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-[#3d2918]">{hi ? "स्टूडियो अभ्यास" : "Studio practice"}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {learn.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-[#3d2918]">{hi ? "डेस्क पर काम" : "Work on the desk"}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {tools.map((tool) => (
                <div key={tool} className="grid h-20 place-items-center rounded-2xl border border-[#ebe4dc] bg-[#fcfaf7] px-2 text-center text-xs font-bold text-[#3d2918]">
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase">{hi ? "प्रोग्राम रोडमैप" : "Programme roadmap"}</p>
        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl text-[#3d2918] sm:text-5xl">
              {hi ? "यह बैच कैसे चलता है" : "How this batch is built"}
            </h2>
            <p className="mt-3 text-stone-600">
              {hi
                ? "हर विषय एक छोटा मॉड्यूल है: रिकॉर्डेड पाठ, एक लाइव समीक्षा, और पोर्टफोलियो में एक काम।"
                : "Each topic is a short module: recorded lessons, one live review, and one piece for the portfolio."}
            </p>
          </div>
          <button type="button" className="inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-[#3d2918] px-6 text-sm font-semibold text-white" onClick={() => setBrochureOpen(true)}>
            {hi ? "ब्रोशर डाउनलोड" : "Download brochure"}
          </button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 lg:grid-cols-4">
          {[
            { icon: BookOpen, value: String(totals.modules), label: hi ? "मॉड्यूल" : "Modules" },
            { icon: FolderOpen, value: String(totals.pieces), label: hi ? "स्टूडियो पीस" : "Studio pieces" },
            { icon: BookOpen, value: String(totals.lectures), label: hi ? "पाठ" : "Lectures" },
            { icon: Clock, value: formatClock(totals.minutes), label: hi ? "पढ़ाई का समय" : "Learning time" },
          ].map((item) => {
            const Icon = item.icon;
            return (
            <div key={item.label} className="flex items-center gap-2.5 rounded-2xl border border-[#ebe4dc] bg-white px-3 py-3 sm:gap-3 sm:px-4 sm:py-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#fcfaf7] text-brand sm:size-10">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xl font-semibold whitespace-nowrap text-[#3d2918] sm:text-2xl">{item.value}</p>
                <p className="text-xs text-stone-500">{item.label}</p>
              </div>
            </div>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPanel("lessons")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${panel === "lessons" ? "bg-[#3d2918] text-white" : "border border-[#ebe4dc] bg-white"}`}
            >
              <BookOpen className="size-4" />
              {hi ? "पाठ" : "Lessons"}
            </button>
            <button
              type="button"
              onClick={() => setPanel("pieces")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${panel === "pieces" ? "bg-[#3d2918] text-white" : "border border-[#ebe4dc] bg-white"}`}
            >
              <FolderOpen className="size-4" />
              {hi ? "स्टूडियो पीस" : "Studio pieces"}
            </button>
          </div>
          <p className="text-xs text-stone-500">{hi ? "हर मॉड्यूल खोलें" : "Open each module"}</p>
        </div>
        <div className="mt-4 space-y-3">
          {modules.map((item, index) => {
            const open = openModule === index;
            const chips = panel === "lessons"
              ? item.lessons.map((lesson) => (hi ? lesson.hi : lesson.en))
              : [hi ? item.piece.hi : item.piece.en];
            return (
              <article key={item.title} className={`overflow-hidden rounded-2xl border border-[#ebe4dc] ${open ? "bg-[#fcfaf7]" : "bg-white"}`}>
                <button type="button" className="flex w-full items-center gap-3 px-4 py-4 text-left sm:gap-4" onClick={() => setOpenModule(open ? -1 : index)} aria-expanded={open}>
                  <span className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${open ? "bg-brand text-white" : "bg-[#fcfaf7] text-[#3d2918]"}`}>
                    {String(index).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 font-semibold text-[#3d2918]">{hi ? item.titleHi : item.title}</span>
                  <span className="hidden items-center gap-4 text-xs text-stone-500 sm:flex">
                    <span className="inline-flex items-center gap-1"><BookOpen className="size-3.5" /> {item.lessons.length} {hi ? "पाठ" : "lectures"}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {formatClock(item.minutes)}</span>
                  </span>
                  <ChevronDown className={`size-4 shrink-0 transition ${open ? "rotate-180" : ""}`} />
                </button>
                {open ? (
                  <div className="flex flex-wrap gap-2 px-4 pb-4 sm:pl-16">
                    {chips.map((step) => (
                      <span key={step} className="rounded-full border border-[#ebe4dc] bg-white px-3 py-1.5 text-sm">{step}</span>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#3d2918] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-5 px-4 py-8 sm:gap-6 sm:px-6 lg:grid-cols-4">
          {[
            [hi ? "अवधि" : "Duration", hi ? course.durationHi : course.duration],
            [hi ? "पढ़ाई" : "Study", hi ? "रिकॉर्डेड पाठ और लाइव सेशन" : "Recorded lessons plus live sessions"],
            [hi ? "करियर सेल" : "Career cell", hi ? "पहली भूमिका तक साथ" : "Stays with you until the first role"],
            [hi ? "पता" : "Desk", hi ? "सी-77, सेक्टर 63ए, नोएडा" : "C-77, Sector 63A, Noida"],
          ].map(([titleText, body]) => (
            <div key={titleText}>
              <p className="font-semibold">{titleText}</p>
              <p className="mt-1 text-sm text-white/75">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#3d2918] pb-16 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">{hi ? "पढ़ाई का रिकॉर्ड" : "Study record"}</p>
            <h2 className="mt-3 font-serif text-[2rem] leading-tight sm:text-5xl">
              {hi ? "जो काम आप पूरा करते हैं" : "The work you finish"}
              <span className="block text-brand">{hi ? "वही आपका रिकॉर्ड है" : "is the record you keep"}</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
              {hi
                ? "पाठ, लाइव सेशन और पोर्टफोलियो पूरा होने पर GBET Online आपका कोर्स रिकॉर्ड तैयार करता है। काउंसलिंग दस्तावेज़ और शुल्क की बात पक्की करती है।"
                : "When the lessons, live sessions and portfolio are complete, GBET Online prepares your course record. Counselling confirms the documents and the fee."}
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="rounded-xl bg-white/10 px-4 py-3">{hi ? "रिकॉर्डेड पाठ और लाइव सेशन" : "Recorded lessons and live sessions"}</li>
              <li className="rounded-xl bg-white/10 px-4 py-3">{hi ? "इंटरव्यू के लिए पोर्टफोलियो" : "A portfolio you can take to interviews"}</li>
              <li className="rounded-xl bg-white/10 px-4 py-3">{hi ? "नोएडा करियर सेल" : "Noida career cell"}</li>
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-sm bg-[#fffdf8] p-5 text-[#1c1c1c] shadow-lg">
              <p className="text-xs font-bold tracking-wide text-brand">GBET ONLINE</p>
              <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-stone-500">{hi ? "कोर्स रिकॉर्ड" : "Course record"}</p>
              <p className="mt-3 text-center font-serif text-2xl">{hi ? course.nameHi : course.name}</p>
              <p className="mt-4 text-center text-xs text-stone-500">{SITE.year}</p>
              <p className="mt-6 border-t border-[#ebe4dc] pt-3 text-center text-[11px] text-stone-500">{SITE.trust}</p>
            </article>
            <div className="relative hidden min-h-64 overflow-hidden rounded-sm shadow-lg sm:block">
              <Image src={course.image} alt="" fill className="object-cover" sizes="400px" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="font-serif text-[2rem] text-[#3d2918] sm:text-5xl">
          {hi ? "परिसर की बातें" : "Notes from the campus"}
        </h2>
        <p className="mt-2 text-stone-600">{hi ? "नोएडा बैच के शिक्षार्थी अपनी पहली भूमिका के बारे में।" : "Learners from the Noida batches, on the move into a first role."}</p>
        <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mt-8 sm:grid sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-3">
          {stories.map((story) => (
            <article key={story.name} className="w-[84%] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#ebe4dc] bg-white sm:w-auto">
              <div className="flex items-center gap-3 p-5">
                <span className="relative size-12 overflow-hidden rounded-full">
                  <Image src={story.photo} alt="" fill className="object-cover" sizes="48px" />
                </span>
                <div>
                  <p className="font-semibold">{hi ? story.nameHi : story.name}</p>
                  <p className="text-xs text-stone-500">{hi ? story.courseHi : story.course}</p>
                </div>
              </div>
              <p className="px-5 pb-5 text-sm leading-7 text-stone-600">{hi ? story.reviewHi : story.review}</p>
            </article>
          ))}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16">
          <h2 className="font-serif text-3xl text-[#3d2918]">{hi ? "इसी डेस्क के और कोर्स" : "Other courses on this desk"}</h2>
          <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/courses/${item.slug}`} className="w-[72%] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#ebe4dc] bg-white sm:w-auto">
                <div className="relative h-36">
                  <Image src={item.image} alt="" fill className="object-cover" sizes="400px" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{hi ? item.nameHi : item.name}</h3>
                  <p className="mt-2 text-sm font-semibold text-brand">{hi ? "और जानें" : "Learn more"} →</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section id="enquiry" className="border-t border-[#ebe4dc] bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="mb-2 font-serif text-3xl text-[#3d2918] sm:text-4xl">{hi ? "इस कोर्स की काउंसलिंग" : "Counselling for this course"}</h2>
          <p className="mb-6 text-sm text-stone-600">{hi ? "फॉर्म इसी कार्यक्रम के नाम के साथ जाता है।" : "The form goes out with this programme already selected."}</p>
          <EnquiryForm compact defaultCourse={course.name} />
        </div>
      </section>

      <div className="mobile-cta-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-[#ebe4dc] bg-white/95 p-3 backdrop-blur sm:inset-x-auto sm:right-4 sm:bottom-4 sm:flex sm:items-center sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <a href="#enquiry" className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-white shadow-lg">
          {hi ? "पूछताछ" : "Enquire"}
        </a>
        <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center rounded-full bg-[#3d2918] px-4 text-sm font-semibold text-white shadow-lg">
          {hi ? "व्हाट्सएप" : "WhatsApp"}
        </a>
      </div>
      <BrochureDialog open={brochureOpen} onClose={() => setBrochureOpen(false)} />
    </div>
  );
}
