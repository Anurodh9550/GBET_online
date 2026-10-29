"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Download, Menu, Search, Star, X } from "lucide-react";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { BrochureDialog } from "@/components/online/brochure-dialog";
import { CoursesMenu } from "@/components/online/courses-menu";
import { useI18n } from "@/components/providers/language-provider";
import {
  CATEGORIES,
  COURSES,
  ONLINE_SHOWCASE,
  courseKind,
  programmeLabel,
  type Course,
  type CourseCategory,
} from "@/lib/courses";
import { HIRING_COMPANIES, SITE } from "@/lib/site";

const PAGE_SIZE = 6;

const COLLAGE = ["/photos/fashion.jpg", "/photos/film.jpg", "/photos/computer.jpg", "/photos/makeup.jpg"] as const;

function durationKey(duration: string) {
  if (duration.startsWith("6")) return "6";
  if (duration.startsWith("1")) return "1";
  if (duration.startsWith("2")) return "2";
  if (duration.startsWith("3")) return "3";
  return "other";
}

export function ExploreView() {
  const { locale } = useI18n();
  const hi = locale === "hi";
  const [menu, setMenu] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [durations, setDurations] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const catalogue = useMemo(
    () => ONLINE_SHOWCASE.map((slug) => COURSES.find((course) => course.slug === slug)).filter((course): course is Course => course != null),
    [],
  );

  const categoryOptions = CATEGORIES.filter((item) => item.id !== "all" && catalogue.some((course) => course.category === item.id));

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return catalogue.filter((course) => {
      const name = `${course.name} ${course.nameHi} ${course.shortName}`.toLowerCase();
      const categoryOk = categories.length === 0 || categories.includes(course.category);
      const durationOk = durations.length === 0 || durations.includes(durationKey(course.duration));
      return categoryOk && durationOk && (text === "" || name.includes(text));
    });
  }, [catalogue, categories, durations, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const popular = [...catalogue].sort((a, b) => b.rating - a.rating).slice(0, 5);

  function toggleCategory(id: CourseCategory) {
    setPage(1);
    setCategories((currentIds) => (currentIds.includes(id) ? currentIds.filter((item) => item !== id) : [...currentIds, id]));
  }

  function toggleDuration(id: string) {
    setPage(1);
    setDurations((currentIds) => (currentIds.includes(id) ? currentIds.filter((item) => item !== id) : [...currentIds, id]));
  }

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
            <a href="#list" className="rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white">{hi ? "कोर्स देखें" : "See courses"}</a>
          </div>
          <button type="button" className="grid size-10 place-items-center rounded-full border border-[#ebe4dc] lg:hidden" onClick={() => setMenu((value) => !value)} aria-label="Menu">
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {menu ? (
          <div className="space-y-3 border-t border-[#ebe4dc] px-4 py-4 text-sm font-semibold lg:hidden">
            <Link href="/" onClick={() => setMenu(false)} className="block">{hi ? "होम" : "Home"}</Link>
            <a href="#list" onClick={() => setMenu(false)} className="block">{hi ? "सभी कोर्स" : "All courses"}</a>
          </div>
        ) : null}
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10 lg:grid-cols-2 lg:py-14">
        <div className="min-w-0">
          <p className="text-sm text-stone-500">
            <Link href="/" className="hover:text-brand">{hi ? "होम" : "Home"}</Link>
            <span className="px-2">/</span>
            <span>{hi ? "सभी कोर्स" : "All courses"}</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white">{catalogue.length}+ {hi ? "कोर्स" : "courses"}</span>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-[#ebe4dc]">{hi ? `प्रवेश ${SITE.year}` : `Admissions ${SITE.year}`}</span>
            <span className="rounded-full border border-[#ebe4dc] bg-white px-3 py-1.5 text-xs font-semibold">{hi ? "ऑनलाइन" : "Online"}</span>
          </div>
          <h1 className="mt-5 font-serif text-[2.35rem] leading-[1.05] sm:text-6xl">
            {hi ? "वह कोर्स चुनें" : "Find the course"}
            <span className="mt-1 block text-brand">{hi ? "जो आपकी भूमिका से मेल खाए" : "that fits the role you want"}</span>
          </h1>
          <p className="mt-4 max-w-xl text-stone-600">
            {hi
              ? "डिज़ाइन, मीडिया, वेलनेस, हॉस्पिटैलिटी और टेक्नोलॉजी के ऑनलाइन बैच। काउंसलिंग कॉल पर सीट और शुल्क पक्के होते हैं।"
              : "Online batches in design, media, wellness, hospitality and technology. The counselling call confirms the seat and the fee."}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <a href="#enquiry" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white sm:px-6">
              {hi ? "पूछताछ करें" : "Enquire now"} <ArrowRight className="size-4" />
            </a>
            <button type="button" className="inline-flex h-12 items-center justify-center rounded-full bg-[#3d2918] px-4 text-sm font-semibold text-white sm:px-6" onClick={() => setBrochureOpen(true)}>
              {hi ? "ब्रोशर डाउनलोड" : "Download brochure"}
            </button>
          </div>
          <label className="mt-6 flex h-12 items-center gap-2 rounded-full border border-[#ebe4dc] bg-white px-4">
            <Search className="size-4 text-stone-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder={hi ? "कोर्स खोजें" : "Search a course"}
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {categoryOptions.map((item) => {
              const on = categories.includes(item.id as CourseCategory);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCategory(item.id as CourseCategory)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${on ? "bg-[#3d2918] text-white" : "bg-white ring-1 ring-[#ebe4dc]"}`}
                >
                  {hi ? item.labelHi : item.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
          {COLLAGE.map((src) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl">
              <Image src={src} alt="" fill className="object-cover" sizes="(max-width:1024px) 50vw, 25vw" />
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="overflow-hidden rounded-full border border-[#ebe4dc] bg-white px-5 py-3">
          <div className="animate-marquee flex w-max gap-8 pr-8 text-sm font-semibold text-stone-600">
            {[...HIRING_COMPANIES, ...HIRING_COMPANIES].map((name, index) => (
              <span key={`${name}-${index}`} className="shrink-0">{name}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">{hi ? "इस सत्र की पसंद" : "Picked this session"}</p>
          <h2 className="mt-2 font-serif text-[2rem] leading-tight sm:text-4xl">{hi ? "शिक्षार्थी इन बैचों को देख रहे हैं" : "Batches learners are opening"}</h2>
          <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mt-8 sm:px-0">
            {popular.map((course, index) => {
              const category = CATEGORIES.find((item) => item.id === course.category);
              return (
                <article key={course.slug} className="w-[76%] shrink-0 snap-start overflow-hidden rounded-3xl border border-[#ebe4dc] bg-[#fcfaf7] sm:w-72">
                  <div className="relative h-40">
                    <Image src={course.image} alt="" fill className="object-cover" sizes="288px" />
                    <span className="absolute top-3 left-3 rounded-full bg-white px-2 py-1 text-xs font-bold">#{index + 1}</span>
                    {category ? <span className="absolute top-3 right-3 rounded-full bg-[#3d2918] px-2 py-1 text-[11px] font-semibold text-white">{hi ? category.labelHi : category.label}</span> : null}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{hi ? course.nameHi : course.name}</h3>
                    <p className="mt-2 flex items-center gap-1 text-sm">
                      <Star className="size-4 fill-brand text-brand" />
                      {course.rating}
                      <span className="text-stone-500">{course.enrolled} {hi ? "नामांकित" : "enrolled"}</span>
                    </p>
                    <Link href={`/courses/${course.slug}`} className="mt-4 inline-flex text-sm font-semibold text-brand">
                      {hi ? "और जानें" : "Learn more"} →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#3d2918] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-5 px-4 py-8 sm:gap-6 sm:px-6 lg:grid-cols-4">
          {[
            [hi ? "काउंसलिंग" : "Counselling", hi ? "नोएडा डेस्क फोन पर बात करता है" : "The Noida desk talks it through on a call"],
            [hi ? "ऑनलाइन बैच" : "Online batch", hi ? "रिकॉर्डेड पाठ और लाइव सेशन" : "Recorded lessons and live sessions"],
            [hi ? "करियर सेल" : "Career cell", hi ? "पहली भूमिका तक साथ" : "Stays with you until the first role"],
            [hi ? "नोएडा फैकल्टी" : "Noida faculty", hi ? "परिसर की टीम मेंटर है" : "Mentors are the campus team"],
          ].map(([title, body]) => (
            <div key={title}>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-white/75">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="list" className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[16rem_1fr] lg:gap-8">
        <aside className="h-fit min-w-0 rounded-3xl border border-[#ebe4dc] bg-white p-4 sm:p-5 lg:sticky lg:top-24">
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            className="flex w-full items-center justify-between gap-2 text-left lg:pointer-events-none"
            aria-expanded={filtersOpen}
          >
            <span className="font-semibold">
              {hi ? "छांटें" : "Filter"}
              {categories.length + durations.length > 0 ? <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-xs text-white">{categories.length + durations.length}</span> : null}
            </span>
            <ChevronDown className={`size-4 transition lg:hidden ${filtersOpen ? "rotate-180" : ""}`} />
          </button>
          <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <p className="mt-5 text-xs font-semibold tracking-wide text-brand uppercase">{hi ? "क्षेत्र" : "Area"}</p>
          <div className="mt-3 space-y-2">
            {categoryOptions.map((item) => (
              <label key={item.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={categories.includes(item.id as CourseCategory)} onChange={() => toggleCategory(item.id as CourseCategory)} />
                {hi ? item.labelHi : item.label}
              </label>
            ))}
          </div>
          <p className="mt-6 text-xs font-semibold tracking-wide text-brand uppercase">{hi ? "अवधि" : "Duration"}</p>
          <div className="mt-3 space-y-2">
            {[
              ["6", hi ? "6 महीने" : "6 months"],
              ["1", hi ? "1 वर्ष" : "1 year"],
              ["2", hi ? "2 वर्ष" : "2 years"],
              ["3", hi ? "3 वर्ष" : "3 years"],
            ].map(([id, label]) => (
              <label key={id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={durations.includes(id)} onChange={() => toggleDuration(id)} />
                {label}
              </label>
            ))}
          </div>
          </div>
        </aside>

        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">{hi ? "सभी कार्यक्रम" : "All programmes"}</p>
          <h2 className="mt-2 font-serif text-[2rem] leading-tight sm:text-4xl">{hi ? "सभी ऑनलाइन कोर्स" : "All online courses"}</h2>
          <p className="mt-2 text-sm text-stone-600">{filtered.length} {hi ? "कोर्स" : "courses"}</p>
          {visible.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-[#ebe4dc] bg-white p-6 text-sm">{hi ? "इस खोज पर कोई कोर्स नहीं मिला।" : "No course matches this search."}</p>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((course) => (
                <article key={course.slug} className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#ebe4dc] bg-white">
                  <div className="relative h-40">
                    <Image src={course.image} alt="" fill className="object-cover" sizes="360px" />
                    <span className="absolute top-3 left-3 rounded-full bg-[#3d2918] px-2 py-1 text-[11px] font-semibold text-white">{programmeLabel(courseKind(course), hi)}</span>
                    <span className="absolute top-3 right-3 rounded-full bg-white px-2 py-1 text-[11px] font-semibold">{hi ? course.durationHi : course.duration}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-lg font-semibold">{hi ? course.nameHi : course.name}</h3>
                    <p className="mt-2 flex items-center gap-1 text-sm">
                      <Star className="size-4 fill-brand text-brand" />
                      {course.rating}
                      <span className="text-stone-400">({course.reviews})</span>
                      <span className="text-stone-500">{course.enrolled}</span>
                    </p>
                    <p className="mt-4 text-[11px] font-bold tracking-wide text-brand uppercase">{hi ? "अभ्यास" : "Studio practice"}</p>
                    <ul className="mt-2 grid grid-cols-2 gap-1 text-xs">
                      {(hi ? course.learnHi : course.learn).slice(0, 4).map((item) => (
                        <li key={item} className="flex items-start gap-1">
                          <Check className="mt-0.5 size-3 shrink-0 text-brand" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-[11px] font-bold tracking-wide text-brand uppercase">{hi ? "पहली भूमिका" : "First roles"}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(hi ? course.careersHi : course.careers).slice(0, 4).map((item) => (
                        <span key={item} className="rounded-full border border-[#ebe4dc] px-2 py-1 text-[11px]">{item}</span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center gap-2 pt-5">
                      <Link href={`/courses/${course.slug}`} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#3d2918] text-sm font-semibold text-white">
                        {hi ? "और जानें" : "Learn more"} <ArrowRight className="size-4" />
                      </Link>
                      <button type="button" className="grid size-11 place-items-center rounded-full border border-[#ebe4dc]" onClick={() => setBrochureOpen(true)} aria-label={hi ? "ब्रोशर" : "Brochure"}>
                        <Download className="size-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          {pages > 1 ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setPage(number)}
                  className={`grid size-10 place-items-center rounded-full text-sm font-semibold ${number === current ? "bg-[#3d2918] text-white" : "bg-white ring-1 ring-[#ebe4dc]"}`}
                >
                  {number}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="enquiry" className="border-t border-[#ebe4dc] bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="mb-2 font-serif text-3xl sm:text-4xl">{hi ? "काउंसलिंग के लिए लिखें" : "Write in for counselling"}</h2>
          <p className="mb-6 text-sm text-stone-600">{hi ? "नोएडा डेस्क कोर्स और सीट पर बात करेगा।" : "The Noida desk will talk through the course and the seat."}</p>
          <EnquiryForm compact />
        </div>
      </section>

      <div className="mobile-cta-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-[#ebe4dc] bg-white/95 p-3 backdrop-blur sm:inset-x-auto sm:right-4 sm:bottom-4 sm:flex sm:items-center sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <a href="#enquiry" className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-white shadow-lg">{hi ? "पूछताछ" : "Enquire now"}</a>
        <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center rounded-full bg-[#3d2918] px-4 text-sm font-semibold text-white shadow-lg">{hi ? "व्हाट्सएप" : "WhatsApp"}</a>
      </div>
      <BrochureDialog open={brochureOpen} onClose={() => setBrochureOpen(false)} />
    </div>
  );
}
