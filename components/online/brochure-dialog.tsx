"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Phone, ShieldCheck, User, X } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import { createEnquiry } from "@/lib/api";
import { ONLINE_COURSES } from "@/lib/courses";
import { INDIAN_STATES } from "@/lib/site";
import { cn } from "@/lib/utils";

const brochureKey = "gbet-brochure-unlocked";

export function BrochureDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale } = useI18n();
  const hi = locale === "hi";
  const router = useRouter();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [state, setState] = useState("Uttar Pradesh");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  const courses = ONLINE_COURSES;

  function nextFromDetails() {
    if (name.trim().length < 2) {
      setError(hi ? "पूरा नाम लिखें।" : "Enter your full name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError(hi ? "10 अंकों का मोबाइल नंबर लिखें।" : "Enter a 10-digit mobile number.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(hi ? "सही ईमेल लिखें।" : "Enter a valid email.");
      return;
    }
    setError("");
    setStep(2);
  }

  function nextFromCourse() {
    if (!course) {
      setError(hi ? "एक कोर्स चुनें।" : "Select a course.");
      return;
    }
    setError("");
    setStep(3);
  }

  async function sendBrochure() {
    if (city.trim().length < 2) {
      setError(hi ? "शहर लिखें।" : "Enter your city.");
      return;
    }
    setError("");
    setSending(true);
    const res = await createEnquiry({
      full_name: name.trim(),
      mobile: phone.trim(),
      email: email.trim(),
      state,
      city: city.trim(),
      course,
      message: "Requested the online brochure",
      source: "brochure",
    });
    setSending(false);
    if (!res.ok) {
      setError(hi ? "अभी नहीं भेज सके। विवरण जाँचें।" : "Could not send just now. Check the details.");
      return;
    }
    setStep(4);
  }

  function openBrochure() {
    window.sessionStorage.setItem(brochureKey, "1");
    onClose();
    router.push("/brochure");
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#3d2918]/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="brochure-title"
        className="relative w-full max-w-md rounded-[1.75rem] bg-white p-6 text-[#3d2918] shadow-2xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-stone-500 hover:bg-[#fcfaf7]" onClick={onClose} aria-label={hi ? "बंद करें" : "Close"}>
          <X className="size-4" />
        </button>

        {step < 4 ? (
          <div className="mb-5 flex items-center gap-3 pr-8">
            <div className="flex flex-1 gap-1.5">
              {[1, 2, 3].map((n) => (
                <span key={n} className={cn("h-1 flex-1 rounded-full", n <= step ? "bg-brand" : "bg-[#ebe4dc]")} />
              ))}
            </div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-brand uppercase">
              {hi ? `चरण ${step} / 3` : `Step ${step} of 3`}
            </p>
          </div>
        ) : null}

        {step === 1 ? (
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              nextFromDetails();
            }}
          >
            <h2 id="brochure-title" className="text-2xl font-bold">{hi ? "विवरण कहाँ भेजें?" : "Where should we send the details?"}</h2>
            <Field label={hi ? "पूरा नाम" : "Full name"}>
              <InputShell icon={<User className="size-4" />}>
                <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder={hi ? "अपना पूरा नाम लिखें" : "Enter your full name"} className="h-12 w-full bg-transparent pr-10 text-sm outline-none" />
              </InputShell>
            </Field>
            <Field label={hi ? "फोन नंबर" : "Phone number"} hint={hi ? "नोएडा डेस्क इस नंबर पर कॉल करेगी।" : "The Noida desk will call this number."}>
              <div className="flex h-12 overflow-hidden rounded-xl border border-[#ebe4dc]">
                <span className="grid shrink-0 place-items-center border-r border-[#ebe4dc] bg-[#fcfaf7] px-3 text-sm font-semibold">+91</span>
                <input value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" autoComplete="tel" placeholder={hi ? "मोबाइल नंबर" : "Enter your phone number"} className="w-full bg-transparent px-3 text-sm outline-none" />
                <span className="grid place-items-center pr-3 text-stone-400"><Phone className="size-4" /></span>
              </div>
            </Field>
            <Field label={hi ? "ईमेल पता" : "Email address"} hint={hi ? "सिलेबस, शुल्क और छात्रवृत्ति इसी ईमेल पर जाएँगे।" : "Syllabus, fees and scholarship notes go to this email."}>
              <InputShell icon={<Mail className="size-4" />}>
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder={hi ? "अपना ईमेल लिखें" : "Enter your email address"} className="h-12 w-full bg-transparent pr-10 text-sm outline-none" />
              </InputShell>
            </Field>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <p className="flex items-center justify-center gap-2 rounded-xl bg-[#f6f1eb] px-3 py-2.5 text-sm text-[#3d2918]">
              <ShieldCheck className="size-4" />
              {hi ? "आपकी जानकारी केवल प्रवेश डेस्क के पास रहेगी।" : "Your details stay with the admissions desk."}
            </p>
            <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#3d2918] text-sm font-bold tracking-wide text-white uppercase">
              {hi ? "अपना कोर्स चुनें" : "Select your course"} <ArrowRight className="size-4" />
            </button>
          </form>
        ) : null}

        {step === 2 ? (
          <div>
            <h2 id="brochure-title" className="text-2xl font-bold">{hi ? "कौन सा कोर्स भेजें?" : "Which course should we send?"}</h2>
            <div className="mt-4 grid max-h-72 gap-2 overflow-y-auto pr-1">
              {courses.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setCourse(item.name)}
                  className={cn("rounded-xl border px-4 py-3 text-left text-sm font-semibold", course === item.name ? "border-brand bg-[#fcfaf7]" : "border-[#ebe4dc] hover:bg-[#fcfaf7]")}
                >
                  {hi ? item.nameHi : item.shortName}
                </button>
              ))}
            </div>
            {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
            <div className="mt-5 flex gap-3">
              <button type="button" className="h-12 rounded-full px-4 text-sm font-semibold" onClick={() => { setError(""); setStep(1); }}>{hi ? "वापस" : "Back"}</button>
              <button type="button" className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#3d2918] text-sm font-bold tracking-wide text-white uppercase" onClick={nextFromCourse}>
                {hi ? "आगे बढ़ें" : "Continue"} <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void sendBrochure();
            }}
          >
            <h2 id="brochure-title" className="text-2xl font-bold">{hi ? "आप किस शहर से हैं?" : "Which city are you in?"}</h2>
            <p className="text-sm text-stone-600">{hi ? `${course} का ब्रोशर इसी विवरण पर जाएगा।` : `The ${course} brochure will use these details.`}</p>
            <Field label={hi ? "राज्य" : "State"}>
              <select value={state} onChange={(event) => setState(event.target.value)} className="h-12 w-full rounded-xl border border-[#ebe4dc] bg-white px-3 text-sm">
                {INDIAN_STATES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label={hi ? "शहर" : "City"}>
              <input value={city} onChange={(event) => setCity(event.target.value)} placeholder={hi ? "शहर" : "City"} className="h-12 w-full rounded-xl border border-[#ebe4dc] px-3 text-sm outline-none" />
            </Field>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <div className="flex gap-3">
              <button type="button" className="h-12 rounded-full px-4 text-sm font-semibold" onClick={() => { setError(""); setStep(2); }}>{hi ? "वापस" : "Back"}</button>
              <button type="submit" disabled={sending} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#3d2918] text-sm font-bold tracking-wide text-white uppercase disabled:opacity-60">
                {sending ? (hi ? "भेज रहे हैं…" : "Sending…") : hi ? "ब्रोशर भेजें" : "Send brochure"} <ArrowRight className="size-4" />
              </button>
            </div>
          </form>
        ) : null}

        {step === 4 ? (
          <div>
            <h2 id="brochure-title" className="text-2xl font-bold">{hi ? "ब्रोशर तैयार है।" : "The brochure is ready."}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {hi
                ? "प्रवेश डेस्क इस नंबर पर कॉल करेगी। ब्रोशर खोलकर प्रिंट या PDF सेव कर सकते हैं।"
                : "The admissions desk will call this number. Open the brochure to print it or save a PDF."}
            </p>
            <button type="button" className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-bold tracking-wide text-white uppercase" onClick={openBrochure}>
              {hi ? "ब्रोशर खोलें" : "Open brochure"} <ArrowRight className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold">
      {label}
      {children}
      {hint ? <span className="text-xs font-normal text-stone-500">{hint}</span> : null}
    </label>
  );
}

function InputShell({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative rounded-xl border border-[#ebe4dc] px-3">
      {children}
      <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-stone-400">{icon}</span>
    </div>
  );
}
