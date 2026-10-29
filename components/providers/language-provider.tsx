"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "hi";

const UI = {
  en: {
    skip: "Skip to main content",
    tagline: "Transform Your Future Through Quality Education",
    nav: {
      home: "Home",
      courses: "Courses",
      admissions: "Admissions",
      placements: "Placements",
      scholarships: "Scholarships",
      partners: "Alliance Partners",
      campus: "Campus",
      about: "About",
      news: "News & Events",
      faq: "FAQ",
      contact: "Contact",
      compare: "Compare",
      apply: "Apply Now",
      brochure: "Download Brochure",
      counselling: "Free Counselling",
    },
    top: {
      hq: "HQ Noida",
      student: "Student Login",
      faculty: "Faculty Login",
      admin: "Admin",
      language: "हिन्दी",
    },
    hero: {
      kicker: "Admissions Open 2027",
      headline: "Admissions Open 2027",
      sub: "Build Your Career with Industry-Oriented Diploma Programmes in AI, Design, Culinary Arts, Wellness, Pharmacy, Education and Paramedical Sciences",
    },
    courses: {
      title: "Explore Diplomas",
      subtitle: "Filter by school and apply in one tap. Diploma seats for 2027 are filling.",
      duration: "Duration",
      eligibility: "Eligibility",
      seats: "Seats",
      careers: "Career opportunities",
      apply: "Apply",
      details: "View details",
      compare: "Compare",
      learn: "What you'll learn",
      jobs: "Jobs you'll unlock",
      more: "Learn more",
      enrolled: "enrolled",
      diploma: "Diploma Course",
    },
    why: { title: "Why Choose GBTE", subtitle: "A complete campus-to-career system, not just a prospectus." },
    placements: { title: "Placements & Internships", subtitle: "Career Development Cell with hiring partners across hospitals, diagnostics, pharmacy and schools." },
    stories: { title: "Student Success Stories", subtitle: "Graduates placed with leading companies and hospital networks." },
    process: { title: "Admission Process", subtitle: "Five clear steps from enquiry to confirmation." },
    scholarships: { title: "Scholarships", subtitle: "Keep talent in the classroom — merit, inclusion and sport." },
    campus: { title: "Campus Facilities", subtitle: "Learn, live and practise at our Noida campus in Uttar Pradesh." },
    enquiry: {
      title: "Admission Enquiry",
      subtitle: "CRM-ready form. We also notify admissions on email and WhatsApp.",
      name: "Full Name",
      mobile: "Mobile Number",
      email: "Email",
      state: "State",
      city: "City",
      course: "Course Interested In",
      message: "Message",
      submit: "Submit Enquiry",
      success: "Thank you. Our counsellor will connect shortly.",
    },
    about: { title: "About the Institution", vision: "Vision", mission: "Mission", accreditation: "Accreditation & Affiliations" },
    news: { title: "News & Events", read: "Read more" },
    faq: { title: "Admission FAQs" },
    footer: {
      trust: "Gautam Buddha Educational Trust",
      quick: "Quick Links",
      social: "Social",
      rights: "All rights reserved.",
    },
    popup: {
      title: "Book Free Career Guidance",
      body: "Admissions 2027 — talk to a counsellor in 15 minutes.",
      cta: "Book Free Career Guidance",
      name: "Name",
      phone: "Phone",
      course: "Course Interest",
    },
    chat: {
      title: "AI Admission Assistant",
      greet: "Namaste! Ask about admissions, fees, hostels, scholarships or courses.",
      placeholder: "Type your question…",
    },
    whatsapp: "Chat on WhatsApp",
    compare: { title: "Course Comparison", add: "Select up to 3 programmes" },
  },
  hi: {
    skip: "मुख्य सामग्री पर जाएँ",
    tagline: "गुणवत्तापूर्ण शिक्षा के साथ अपना भविष्य बदलें",
    nav: {
      home: "होम",
      courses: "पाठ्यक्रम",
      admissions: "प्रवेश",
      placements: "प्लेसमेंट",
      scholarships: "छात्रवृत्ति",
      partners: "एलायंस पार्टनर",
      campus: "परिसर",
      about: "परिचय",
      news: "समाचार व कार्यक्रम",
      faq: "प्रश्न",
      contact: "संपर्क",
      compare: "तुलना",
      apply: "अभी आवेदन करें",
      brochure: "ब्रोशर डाउनलोड",
      counselling: "निःशुल्क काउंसलिंग",
    },
    top: {
      hq: "मुख्यालय नोएडा",
      student: "छात्र लॉगिन",
      faculty: "संकाय लॉगिन",
      admin: "प्रशासन",
      language: "English",
    },
    hero: {
      kicker: "प्रवेश 2027 प्रारंभ",
      headline: "प्रवेश 2027 प्रारंभ",
      sub: "एआई, डिज़ाइन, कलिनरी, वेलनेस, फार्मेसी, शिक्षा और पैरामेडिकल विज्ञान के उद्योग-उन्मुख डिप्लोमा कार्यक्रमों से करियर बनाएँ",
    },
    courses: {
      title: "डिप्लोमा देखें",
      subtitle: "स्कूल के अनुसार फ़िल्टर करें और एक टैप में आवेदन करें। 2027 की डिप्लोमा सीटें भर रही हैं।",
      duration: "अवधि",
      eligibility: "पात्रता",
      seats: "सीटें",
      careers: "करियर अवसर",
      apply: "आवेदन",
      details: "विवरण",
      compare: "तुलना",
      learn: "आप क्या सीखेंगे",
      jobs: "जिन नौकरियों के द्वार खुलेंगे",
      more: "और जानें",
      enrolled: "नामांकित",
      diploma: "डिप्लोमा कोर्स",
    },
    why: { title: "जीबीटीई क्यों चुनें", subtitle: "केवल प्रॉस्पेक्टस नहीं — परिसर से करियर तक की पूरी प्रणाली।" },
    placements: { title: "प्लेसमेंट और इंटर्नशिप", subtitle: "अस्पताल, डायग्नोस्टिक्स, फार्मेसी और विद्यालयों के हायरिंग पार्टनर के साथ कैरियर सेल।" },
    stories: { title: "छात्र सफलता कथाएँ", subtitle: "अग्रणी कंपनियों और अस्पताल नेटवर्क में नियुक्तियाँ।" },
    process: { title: "प्रवेश प्रक्रिया", subtitle: "पूछताछ से पुष्टि तक पाँच स्पष्ट चरण।" },
    scholarships: { title: "छात्रवृत्तियाँ", subtitle: "मेरिट, समावेश और खेल — प्रतिभा कक्षा में रहे।" },
    campus: { title: "परिसर सुविधाएँ", subtitle: "नोएडा, उत्तर प्रदेश परिसर में सीखें, रहें और अभ्यास करें।" },
    enquiry: {
      title: "प्रवेश पूछताछ",
      subtitle: "सीआरएम-तैयार फॉर्म। ईमेल और व्हाट्सएप पर भी सूचना।",
      name: "पूरा नाम",
      mobile: "मोबाइल नंबर",
      email: "ईमेल",
      state: "राज्य",
      city: "शहर",
      course: "इच्छित पाठ्यक्रम",
      message: "संदेश",
      submit: "पूछताछ भेजें",
      success: "धन्यवाद। काउंसलर शीघ्र संपर्क करेंगे।",
    },
    about: { title: "संस्था परिचय", vision: "दृष्टि", mission: "मिशन", accreditation: "प्रत्यायन और संबद्धता" },
    news: { title: "समाचार व कार्यक्रम", read: "और पढ़ें" },
    faq: { title: "प्रवेश प्रश्न" },
    footer: {
      trust: "गौतम बुद्ध एजुकेशनल ट्रस्ट",
      quick: "त्वरित लिंक",
      social: "सोशल",
      rights: "सर्वाधिकार सुरक्षित।",
    },
    popup: {
      title: "निःशुल्क कैरियर गाइडेंस बुक करें",
      body: "प्रवेश 2027 — 15 मिनट में काउंसलर से बात करें।",
      cta: "निःशुल्क कैरियर गाइडेंस बुक करें",
      name: "नाम",
      phone: "फोन",
      course: "पाठ्यक्रम रुचि",
    },
    chat: {
      title: "एआई एडमिशन सहायक",
      greet: "नमस्ते! प्रवेश, शुल्क, छात्रावास, छात्रवृत्ति या पाठ्यक्रम पूछें।",
      placeholder: "प्रश्न लिखें…",
    },
    whatsapp: "व्हाट्सएप पर चैट",
    compare: { title: "पाठ्यक्रम तुलना", add: "अधिकतम 3 कार्यक्रम चुनें" },
  },
} as const;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof UI)[Locale];
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("gbte-locale");
    if (stored === "hi" || stored === "en") setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("gbte-locale", next);
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, t: UI[locale] }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

export function pick<T extends { en: string; hi?: string } | string>(
  locale: Locale,
  en: string,
  hi?: string
) {
  return locale === "hi" && hi ? hi : en;
}
