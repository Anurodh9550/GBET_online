"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Download, Menu, Star, X } from "lucide-react";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { BrochureDialog } from "@/components/online/brochure-dialog";
import { Reveal } from "@/components/shared/reveal";
import { useI18n } from "@/components/providers/language-provider";
import { CATEGORIES, COURSES, ONLINE_SHOWCASE, courseKind, programmeLabel, type CourseCategory } from "@/lib/courses";
import { SUCCESS_STORIES } from "@/lib/content";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const HERO = [
  { field: "Creative Arts", fieldHi: "क्रिएटिव आर्ट्स", photo: "/photos/fashion.jpg" },
  { field: "Media", fieldHi: "मीडिया", photo: "/photos/film.jpg" },
  { field: "Healthcare", fieldHi: "हेल्थकेयर", photo: "/photos/medical.jpg" },
] as const;

const SHOWCASE = ONLINE_SHOWCASE;
const HOME_CARDS = 8;

const WHY = [
  { en: "Learn what studios and hospitals actually use", hi: "स्टूडियो और अस्पताल में जो काम आता है" },
  { en: "Mentors from the Noida campus faculty", hi: "नोएडा परिसर की फैकल्टी से मेंटर" },
  { en: "Recorded lessons plus live sessions", hi: "रिकॉर्डेड पाठ और लाइव सेशन" },
  { en: "A portfolio you can take to interviews", hi: "इंटरव्यू में ले जाने लायक पोर्टफोलियो" },
  { en: "Workshops and masterclasses through the year", hi: "साल भर वर्कशॉप और मास्टरक्लास" },
  { en: "Career cell for internships and first roles", hi: "इंटर्नशिप और पहली भूमिका का करियर सेल" },
  { en: "Study while you work", hi: "नौकरी के साथ पढ़ाई" },
  { en: "Visit the Noida labs when you want", hi: "जब चाहें नोएडा लैब देखें" },
] as const;

const PATH = [
  {
    step: "01",
    title: "Choose the role",
    titleHi: "भूमिका चुनें",
    body: "Counselling matches a diploma to the desk you want, from design studios to hospital floors.",
    bodyHi: "काउंसलिंग डिप्लोमा को उस डेस्क से जोड़ती है जो आप चाहते हैं, डिज़ाइन स्टूडियो से अस्पताल तक।",
    photo: "/photos/interior.jpg",
  },
  {
    step: "02",
    title: "Build work you can show",
    titleHi: "दिखाने लायक काम बनाएँ",
    body: "Lessons, live sessions and Noida lab hours end in a portfolio piece for interviews.",
    bodyHi: "पाठ, लाइव सेशन और नोएडा लैब का समय इंटरव्यू के लिए एक पोर्टफोलियो पीस में खत्म होता है।",
    photo: "/photos/fashion.jpg",
  },
  {
    step: "03",
    title: "Practise the interview",
    titleHi: "इंटरव्यू की तैयारी",
    body: "The career cell runs briefings and mock rounds before an internship conversation.",
    bodyHi: "इंटर्नशिप की बात से पहले करियर सेल ब्रीफिंग और मॉक राउंड कराता है।",
    photo: "/photos/culinary.jpg",
  },
  {
    step: "04",
    title: "Start the first role",
    titleHi: "पहली भूमिका शुरू करें",
    body: "Internship support stays with you until the first role is confirmed.",
    bodyHi: "पहली भूमिका पक्की होने तक इंटर्नशिप सहायता साथ रहती है।",
    photo: "/photos/film.jpg",
  },
] as const;

const STUDIOS = [
  { title: "Interior Design", titleHi: "इंटीरियर डिज़ाइन", photo: "/photos/interior.jpg" },
  { title: "Fashion Design", titleHi: "फैशन डिज़ाइन", photo: "/photos/fashion.jpg" },
  { title: "Culinary Arts", titleHi: "कलिनरी आर्ट्स", photo: "/photos/culinary.jpg" },
  { title: "Wellness", titleHi: "वेलनेस", photo: "/photos/yoga.jpg" },
  { title: "Screen & Media", titleHi: "स्क्रीन और मीडिया", photo: "/photos/film.jpg" },
  { title: "Psychology", titleHi: "साइकोलॉजी", photo: "/photos/psychology.jpg" },
] as const;

const WORKSHOPS = [
  { title: "Kitchen workshop", titleHi: "किचन वर्कशॉप", role: "Culinary studio", roleHi: "कलिनरी स्टूडियो", photo: "/photos/culinary.jpg" },
  { title: "Design critique", titleHi: "डिज़ाइन क्रिटिक", role: "Interior studio", roleHi: "इंटीरियर स्टूडियो", photo: "/photos/interior.jpg" },
  { title: "Lookbook day", titleHi: "लुकबुक डे", role: "Fashion studio", roleHi: "फैशन स्टूडियो", photo: "/photos/fashion.jpg" },
  { title: "Story lab", titleHi: "स्टोरी लैब", role: "Media studio", roleHi: "मीडिया स्टूडियो", photo: "/photos/film.jpg" },
  { title: "Wellness circle", titleHi: "वेलनेस सर्कल", role: "Health studio", roleHi: "हेल्थ स्टूडियो", photo: "/photos/yoga.jpg" },
  { title: "Lab briefing", titleHi: "लैब ब्रीफिंग", role: "Healthcare studio", roleHi: "हेल्थकेयर स्टूडियो", photo: "/photos/medical.jpg" },
] as const;

const FAQS = [
  {
    q: "What is GBET Online?",
    qHi: "GBET Online क्या है?",
    a: "It is the online desk of Gautam Buddha Educational Trust. You study diploma, degree and certificate programmes with recorded lessons, live sessions and counselling from the Noida campus.",
    aHi: "यह गौतम बुद्ध एजुकेशनल ट्रस्ट का ऑनलाइन डेस्क है। रिकॉर्डेड पाठ, लाइव सेशन और नोएडा परिसर की काउंसलिंग के साथ डिप्लोमा, डिग्री और सर्टिफिकेट पढ़े जाते हैं।",
  },
  {
    q: "Who can apply?",
    qHi: "कौन आवेदन कर सकता है?",
    a: "Anyone who meets the eligibility of the chosen programme. Counselling checks your marks and the latest rules before a seat is confirmed.",
    aHi: "जो चुने हुए कार्यक्रम की पात्रता पूरी करता है। सीट से पहले काउंसलिंग अंक और नवीनतम नियम जाँचती है।",
  },
  {
    q: "Can I study while working?",
    qHi: "क्या नौकरी के साथ पढ़ सकते हैं?",
    a: "Yes. Lessons stay available online, and live sessions are scheduled so working learners can join.",
    aHi: "हाँ। पाठ ऑनलाइन रहते हैं और लाइव सेशन ऐसे समय पर होते हैं कि कामकाजी छात्र जुड़ सकें।",
  },
  {
    q: "How does admission work?",
    qHi: "प्रवेश कैसे होता है?",
    a: "Send an enquiry. An advisor calls, confirms the programme, and helps with documents, fees and scholarship options.",
    aHi: "पूछताछ भेजें। सलाहकार कॉल करता है, कार्यक्रम पक्का करता है, और दस्तावेज़, शुल्क व छात्रवृत्ति में मदद करता है।",
  },
  {
    q: "Can I visit the campus?",
    qHi: "क्या परिसर देख सकते हैं?",
    a: "Yes. Book a visit to C-77, Sector 63A, Noida, or call +91 9355470710.",
    aHi: "हाँ। सी-77, सेक्टर 63ए, नोएडा का दौरा बुक करें, या +91 9355470710 पर कॉल करें।",
  },
] as const;

export function OnlineView() {
  const { locale } = useI18n();
  const hi = locale === "hi";
  const [hero, setHero] = useState(0);
  const [category, setCategory] = useState<CourseCategory | "all">("all");
  const [menu, setMenu] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);
  const closeCourses = useRef<number | null>(null);

  const openCourses = () => {
    if (closeCourses.current) window.clearTimeout(closeCourses.current);
    setCoursesOpen(true);
  };
  const hideCourses = () => {
    closeCourses.current = window.setTimeout(() => setCoursesOpen(false), 140);
  };

  useEffect(() => {
    const timer = window.setInterval(() => setHero((n) => (n + 1) % HERO.length), 6500);
    return () => {
      window.clearInterval(timer);
      if (closeCourses.current) window.clearTimeout(closeCourses.current);
    };
  }, []);

  const courses = useMemo(() => {
    const showcase = SHOWCASE.map((slug) => COURSES.find((c) => c.slug === slug)).filter((c) => c != null);
    return (category === "all" ? showcase : showcase.filter((c) => c.category === category)).slice(0, HOME_CARDS);
  }, [category]);

  const stories = SUCCESS_STORIES.slice(0, 6);

  return (
    <div className="bg-[#fff8f2] text-[#3d2918]">
      <header className="sticky top-0 z-50 border-b border-[#eedfd0] bg-[#fff8f2]/95 backdrop-blur">
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
            <a href="#top">{hi ? "होम" : "Home"}</a>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1"
              aria-expanded={coursesOpen}
              onMouseEnter={openCourses}
              onMouseLeave={hideCourses}
              onFocus={openCourses}
            >
              {hi ? "कोर्स" : "Courses"} <ChevronDown className={cn("size-4 transition", coursesOpen && "rotate-180")} />
            </Link>
            <Link href="/courses">{hi ? "एक्सप्लोर" : "Explore"}</Link>
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <a href={`${SITE.campusUrl}/login/student`} className="px-3 py-2 text-sm font-semibold">{hi ? "लॉगिन" : "Login"}</a>
            <a href="#enquiry" className="rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white">{hi ? "शुरू करें" : "Get started"}</a>
          </div>
          <button type="button" className="grid size-10 place-items-center rounded-full border border-[#eedfd0] lg:hidden" onClick={() => setMenu((v) => !v)} aria-label="Menu">
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {coursesOpen ? (
          <div className="hidden border-t border-[#eedfd0] bg-white lg:block" onMouseEnter={openCourses} onMouseLeave={hideCourses}>
            <div className="mx-auto grid max-w-7xl grid-cols-4 gap-3 px-6 py-5 text-sm">
              {SHOWCASE.map((slug) => {
                const course = COURSES.find((c) => c.slug === slug);
                if (!course) return null;
                return (
                  <Link key={slug} href={`/courses/${slug}`} className="rounded-xl px-3 py-2 hover:bg-[#fff8f2]" onClick={() => setCoursesOpen(false)}>
                    {course.shortName}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
        {menu ? (
          <div className="space-y-3 border-t border-[#eedfd0] px-4 py-4 text-sm font-semibold lg:hidden">
            <Link href="/courses" onClick={() => setMenu(false)} className="block">{hi ? "कोर्स" : "Courses"}</Link>
            <a href="#stories" onClick={() => setMenu(false)} className="block">{hi ? "कहानियाँ" : "Stories"}</a>
            <a href="#faq" onClick={() => setMenu(false)} className="block">FAQ</a>
            <a href={`${SITE.campusUrl}/login/student`} className="block">{hi ? "लॉगिन" : "Login"}</a>
          </div>
        ) : null}
      </header>

      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
          <motion.div
            className="min-w-0"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-serif text-4xl leading-[1.08] sm:text-6xl">
              {hi ? "ऑनलाइन सीखें। असर बनाएँ। भविष्य का नेतृत्व करें।" : "Learn Online. Create Impact. Lead the Future."}
            </h1>
            <p className="mt-6 max-w-md text-lg text-stone-600">
              {hi
                ? "हमारे नोएडा परिसर से मीडिया में लचीली ऑनलाइन डिग्री और डिप्लोमा के साथ अपना भविष्य बनाएँ।"
                : "Build your future in media with flexible online degrees and diplomas from our Noida campus."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquiry" className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white">
                {hi ? "पूछताछ करें" : "Enquire now"} <ArrowRight className="size-4" />
              </a>
              <button type="button" className="inline-flex h-12 items-center rounded-full bg-[#3d2918] px-6 text-sm font-semibold text-white" onClick={() => setBrochureOpen(true)}>
                {hi ? "ब्रोशर डाउनलोड" : "Download brochure"}
              </button>
            </div>
          </motion.div>
          <motion.div
            className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {HERO.map((item, i) => (
              <Image key={item.field} src={item.photo} alt="" fill priority={i === 0} className={cn("object-cover transition duration-700", i === hero ? "opacity-100" : "opacity-0")} sizes="(max-width:1024px) 100vw, 50vw" />
            ))}
          </motion.div>
        </div>
      </section>

      <Reveal as="section" hover={false} lift={false} amount={0.4} className="relative z-0 overflow-hidden border-y border-[#eedfd0] bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6">
          <p className="shrink-0 text-xs font-semibold tracking-[0.16em] text-stone-500 uppercase">{hi ? "अध्ययन क्षेत्र" : "Study areas"}</p>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="animate-marquee flex w-max gap-10 pr-10 text-sm font-semibold text-navy">
              {[...STUDIOS, ...STUDIOS].map((item, i) => (
                <span key={`${item.title}-${i}`} className="shrink-0">{hi ? item.titleHi : item.title}</span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <section id="courses" className="relative z-10 mx-auto max-w-7xl bg-[#fff8f2] px-4 py-16 sm:px-6 sm:py-24">
        <Reveal hover={false} amount={0.45} className="max-w-3xl">
          <p className="text-sm font-semibold text-brand">{hi ? "डिप्लोमा कोर्स" : "Diploma courses"}</p>
          <h2 className="mt-2 font-serif text-4xl leading-[1.05] sm:text-6xl">
            {hi ? "वह कोर्स चुनें जो आपके लक्ष्य से मेल खाए" : "Find the course that aligns with your goals"}
          </h2>
          <p className="mt-4 max-w-2xl text-stone-600">
            {hi ? "डिज़ाइन, मीडिया, कला, वेलनेस, हॉस्पिटैलिटी, बिज़नेस और टेक्नोलॉजी में से अपना कार्यक्रम चुनें। पूछताछ के बाद सलाहकार कॉल करता है।" : "Choose a programme in design, media, arts, wellness, hospitality, business or technology. An advisor calls after you enquire."}
          </p>
        </Reveal>
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => ["all", "design", "media", "arts", "wellness", "hospitality", "business", "ai"].includes(c.id)).map((cat) => (
            <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} className={cn("rounded-full px-4 py-2 text-sm font-semibold", category === cat.id ? "bg-[#3d2918] text-white" : "bg-white ring-1 ring-[#eedfd0]")}>
              {hi ? cat.labelHi : cat.label}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, i) => (
            <Reveal key={course.slug} hover={false} amount={0.2} delay={(i % 4) * 0.05} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#eedfd0] bg-white">
                <div className="relative h-44">
                  <Image src={course.image} alt="" fill className="object-cover" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" />
                  <span className="absolute top-3 left-3 rounded-full bg-[#3d2918] px-2.5 py-1 text-[11px] font-semibold text-white">{programmeLabel(courseKind(course), hi)}</span>
                  <span className="absolute top-3 right-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold">{hi ? course.durationHi : course.duration}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="min-h-[3.5rem] text-lg leading-snug font-semibold">{hi ? course.nameHi : course.name}</h3>
                  <p className="mt-2 flex items-center gap-1.5 text-sm">
                    <Star className="size-4 fill-brand text-brand" />
                    {course.rating}
                    <span className="text-stone-400">({course.reviews})</span>
                    <span className="ml-auto text-xs text-stone-500">{course.enrolled} {hi ? "नामांकित" : "enrolled"}</span>
                  </p>
                  <p className="mt-4 text-[11px] font-bold tracking-wide text-brand uppercase">{hi ? "अभ्यास" : "Studio practice"}</p>
                  <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
                    {(hi ? course.learnHi : course.learn).slice(0, 4).map((item) => (
                      <li key={item} className="flex items-start gap-1">
                        <Check className="mt-0.5 size-3 shrink-0 text-brand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[11px] font-bold tracking-wide text-brand uppercase">{hi ? "पहली भूमिका" : "First roles"}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(hi ? course.careersHi : course.careers).slice(0, 3).map((item) => (
                      <span key={item} className="rounded-full border border-[#eedfd0] px-2 py-1 text-[11px]">{item}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-5">
                    <Link href={`/courses/${course.slug}`} className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#3d2918] text-sm font-semibold text-white">
                      {hi ? "और जानें" : "Learn more"} <ArrowRight className="size-4" />
                    </Link>
                    <button type="button" onClick={() => setBrochureOpen(true)} className="grid size-10 place-items-center rounded-full border border-[#eedfd0]" aria-label={hi ? "ब्रोशर" : "Brochure"}>
                      <Download className="size-4" />
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        {courses.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-[#eedfd0] bg-white p-6 text-sm">{hi ? "इस क्षेत्र के सभी कोर्स नीचे वाले बटन से देखें।" : "See every course in this area from the button below."}</p>
        ) : null}
        <div className="relative z-20 mt-10 text-center">
          <a href="/courses" className="inline-flex h-12 items-center rounded-full border border-[#3d2918] px-6 text-sm font-semibold hover:bg-[#3d2918] hover:text-white">
            {hi ? "सभी डिप्लोमा कोर्स देखें" : "Explore all diploma courses"}
          </a>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal hover={false} amount={0.45} className="max-w-xl">
            <h2 className="font-serif text-4xl leading-tight sm:text-6xl">{hi ? "पहली भूमिका तक का रास्ता" : "Your gateway to a first role"}</h2>
            <p className="mt-3 text-stone-600">
              {hi
                ? "ऑनलाइन पढ़ाई यहीं नहीं रुकती। करियर सेल भूमिका चुनने से लेकर पहली नौकरी तक साथ रहता है।"
                : "Online study does not stop at the lesson. The career cell stays with you from the role you choose to the first job."}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PATH.map((item, i) => (
              <Reveal key={item.step} hover={false} amount={0.28} delay={(i % 4) * 0.08} className="h-full">
                <article className="flex h-full flex-col overflow-hidden border border-[#eedfd0] bg-[#fff8f2]">
                  <div className="relative h-40">
                    <Image src={item.photo} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 25vw" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-bold tracking-[0.16em] text-brand">{item.step}</p>
                    <h3 className="mt-2 text-lg font-semibold">{hi ? item.titleHi : item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{hi ? item.bodyHi : item.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal hover={false} amount={0.45}>
          <h2 className="font-serif text-4xl sm:text-6xl">{hi ? "असली कहानियाँ।" : "Real stories."}<span className="block italic text-brand">{hi ? "असली प्रगति।" : "Real progress."}</span></h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {stories.map((story, i) => (
            <Reveal key={story.name} hover={false} amount={0.28} delay={(i % 3) * 0.08} className="h-full">
            <article className="h-full overflow-hidden border border-[#eedfd0] bg-white">
              <div className="relative h-44">
                <Image src={story.photo} alt="" fill className="object-cover" sizes="400px" />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">{hi ? story.courseHi : story.course}</p>
                <h3 className="mt-2 text-xl font-semibold">{hi ? story.nameHi : story.name}</h3>
                <p className="mt-2 line-clamp-4 text-sm leading-6 text-stone-600">{hi ? story.reviewHi : story.review}</p>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-[#3d2918] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal hover={false} amount={0.45} className="max-w-xl">
            <h2 className="font-serif text-4xl leading-tight sm:text-6xl">{hi ? "शिक्षार्थी GBET Online क्यों चुनते हैं" : "Why learners choose GBET Online"}</h2>
          </Reveal>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((item, i) => (
              <Reveal key={item.en} hover={false} amount={0.3} delay={(i % 4) * 0.07} className="h-full">
                <p className="flex h-full items-center rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm leading-6 text-white/90">
                  {hi ? item.hi : item.en}
                </p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 lg:grid-cols-4">
            {[
              ["95%", hi ? "प्लेसमेंट सहायता" : "Placement support"],
              ["100+", hi ? "हायरिंग पार्टनर" : "Hiring partners"],
              [SITE.year, hi ? "प्रवेश खुला" : "Admissions open"],
              ["Noida", hi ? "काउंसलिंग डेस्क" : "Counselling desk"],
            ].map(([value, label], i) => (
              <Reveal key={String(label)} hover={false} amount={0.35} delay={i * 0.08}>
                <div className="bg-[#3d2918] px-6 py-8">
                  <p className="font-serif text-5xl text-brand">{value}</p>
                  <p className="mt-2 text-sm text-white/75">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal hover={false} amount={0.45} className="max-w-xl">
          <h2 className="font-serif text-4xl sm:text-6xl">{hi ? "हर कोर्स के पीछे एक स्टूडियो" : "A studio behind each course"}</h2>
          <p className="mt-3 text-stone-600">{hi ? "डिज़ाइन, मीडिया, वेलनेस और हेल्थकेयर की पढ़ाई नोएडा टीम से जुड़ी है।" : "Design, media, wellness and healthcare study stays linked to the Noida team."}</p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIOS.map((studio, i) => (
            <Reveal key={studio.title} hover={false} amount={0.28} delay={(i % 3) * 0.08}>
            <article className="relative h-64 overflow-hidden">
              <Image src={studio.photo} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3d2918] via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 text-lg font-semibold text-white">{hi ? studio.titleHi : studio.title}</p>
            </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <Reveal hover={false} amount={0.35}>
            <article className="rounded-3xl bg-[#fff8f2] p-8">
              <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">{hi ? "परिसर रिकॉर्ड" : "Campus record"}</p>
              <h2 className="mt-3 font-serif text-4xl">{hi ? "पढ़ाई का प्रमाण" : "A record of the work you did"}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">{hi ? "कोर्स पूरा होने पर दस्तावेज़ काउंसलिंग डेस्क से मिलता है। नियम हर कार्यक्रम के अनुसार होते हैं।" : "On completion, the counselling desk issues the programme document. Rules follow the programme you join."}</p>
            </article>
          </Reveal>
          <Reveal hover={false} amount={0.35} delay={0.1}>
            <article className="rounded-3xl bg-[#3d2918] p-8 text-white">
              <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">{hi ? "अभ्यास" : "Practice"}</p>
              <h2 className="mt-3 font-serif text-4xl">{hi ? "दिखाने लायक काम" : "Work you can show"}</h2>
              <p className="mt-4 text-sm leading-7 text-white/75">{hi ? "प्रोजेक्ट, लैब फाइल और लाइव सेशन उसी पोर्टफोलियो में जाते हैं जिसे आप इंटरव्यू में रखते हैं।" : "Projects, lab files and live sessions go into the portfolio you take to an interview."}</p>
            </article>
          </Reveal>
        </div>
      </section>

      <section id="workshops" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal hover={false} amount={0.45} className="max-w-xl">
          <h2 className="font-serif text-4xl sm:text-6xl">{hi ? "विशेषज्ञ वर्कशॉप" : "Expert-led workshops"}</h2>
          <p className="mt-3 text-stone-600">{hi ? "साल भर स्टूडियो सत्र जो ऑनलाइन बैच का हिस्सा हैं।" : "Studio sessions through the year, as part of the online batch."}</p>
        </Reveal>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
          {WORKSHOPS.map((item, i) => (
            <Reveal key={item.title} hover={false} amount={0.28} delay={i * 0.07} className="w-64 shrink-0">
            <article>
              <div className="relative h-72 overflow-hidden">
                <Image src={item.photo} alt="" fill className="object-cover" sizes="256px" />
              </div>
              <h3 className="mt-3 text-lg font-semibold">{hi ? item.titleHi : item.title}</h3>
              <p className="text-sm text-stone-500">{hi ? item.roleHi : item.role}</p>
            </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="enquiry" className="border-t border-[#eedfd0] bg-white">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal hover={false} amount={0.3}>
          <article className="rounded-3xl bg-[#fff8f2] p-8">
            <p className="text-sm font-semibold text-brand">{stories[0] ? (hi ? stories[0].courseHi : stories[0].course) : ""}</p>
            <h2 className="mt-4 font-serif text-3xl">{hi ? "हुनर से काम तक" : "From practice to a role"}</h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">“{stories[0] ? (hi ? stories[0].reviewHi : stories[0].review) : ""}”</p>
            <div className="mt-6 flex items-center gap-3">
              {stories[0] ? (
                <span className="relative size-12 overflow-hidden rounded-full">
                  <Image src={stories[0].photo} alt="" fill className="object-cover" sizes="48px" />
                </span>
              ) : null}
              <div>
                <p className="font-semibold">{stories[0] ? (hi ? stories[0].nameHi : stories[0].name) : ""}</p>
                <p className="text-xs text-stone-500">{hi ? "सत्यापित छात्र" : "Verified learner"}</p>
              </div>
            </div>
          </article>
          </Reveal>
          <Reveal hover={false} amount={0.3} delay={0.1}>
          <div>
            <h2 className="mb-4 font-serif text-4xl">{hi ? "अपना करियर पथ तय करें" : "Let's plan your career path"}</h2>
            <p className="mb-4 text-sm text-stone-500">{hi ? "सिर्फ करियर से जुड़ी कॉल।" : "No spam. Only career-related calls."}</p>
            <EnquiryForm compact />
          </div>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Reveal hover={false} amount={0.45}>
          <h2 className="text-center font-serif text-4xl sm:text-6xl">{hi ? "सवाल हैं?" : "Got questions?"}<span className="block">{hi ? "जवाब हैं।" : "We've got answers."}</span></h2>
        </Reveal>
        <div className="mt-8 divide-y divide-[#eedfd0] overflow-hidden rounded-3xl border border-[#eedfd0] bg-white">
          {FAQS.map((item, i) => (
            <Reveal key={item.q} hover={false} lift={false} amount={0.4} delay={i * 0.06}>
              <details className="px-5 py-4">
                <summary className="cursor-pointer font-semibold">{hi ? item.qHi : item.q}</summary>
                <p className="mt-2 text-sm leading-7 text-stone-600">{hi ? item.aHi : item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
        <Reveal hover={false} amount={0.5} className="mt-6 text-center text-sm">
          <a href={`${SITE.campusUrl}/contact`} className="font-semibold text-brand">{hi ? "और सवाल हों तो प्रवेश टीम से बात करें" : "Have more questions? Contact the admissions team"}</a>
        </Reveal>
      </section>
      <BrochureDialog open={brochureOpen} onClose={() => setBrochureOpen(false)} />
    </div>
  );
}
