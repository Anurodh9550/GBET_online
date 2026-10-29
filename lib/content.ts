export const STATS = [
  { value: 5000, suffix: "+", label: "Students", labelHi: "विद्यार्थी" },
  { value: 150, suffix: "+", label: "Faculty Members", labelHi: "संकाय सदस्य" },
  { value: 95, suffix: "%", label: "Placement Support", labelHi: "प्लेसमेंट सहायता" },
  { value: 20, suffix: "+", label: "Diploma Courses", labelHi: "डिप्लोमा पाठ्यक्रम" },
] as const;

export const HERO_FEATURES = [
  { label: "PCI Approved Programs", labelHi: "पीसीआई अनुमोदित कार्यक्रम" },
  { label: "AICTE Guidelines", labelHi: "एआईसीटीई दिशानिर्देश" },
  { label: "Industry Partnerships", labelHi: "उद्योग साझेदारी" },
  { label: "Placement Assistance", labelHi: "प्लेसमेंट सहायता" },
] as const;

export const WHY_CHOOSE = [
  {
    title: "Industry Relevant Curriculum",
    titleHi: "उद्योग-प्रासंगिक पाठ्यक्रम",
    body: "Syllabi mapped to PCI, AICTE and NCTE expectations with live projects.",
    bodyHi: "पीसीआई, एआईसीटीई और एनसीटीई अपेक्षाओं के साथ लाइव प्रोजेक्ट।",
    icon: "BookOpen",
  },
  {
    title: "Experienced Faculty",
    titleHi: "अनुभवी संकाय",
    body: "150+ mentors from pharmacy, hospitals, schools and allied-health practice.",
    bodyHi: "फार्मेसी, अस्पताल, विद्यालय और संबद्ध स्वास्थ्य से 150+ मेंटर।",
    icon: "Users",
  },
  {
    title: "Smart Classrooms",
    titleHi: "स्मार्ट कक्षाएँ",
    body: "Interactive boards, hybrid lectures and recorded revision libraries.",
    bodyHi: "इंटरैक्टिव बोर्ड, हाइब्रिड लेक्चर और रिकॉर्डेड रिवीजन लाइब्रेरी।",
    icon: "MonitorSmartphone",
  },
  {
    title: "Modern Laboratories",
    titleHi: "आधुनिक प्रयोगशालाएँ",
    body: "Pharmacy and paramedical labs built for practice, not just theory.",
    bodyHi: "फार्मेसी और पैरामेडिकल लैब — अभ्यास के लिए, केवल सिद्धांत नहीं।",
    icon: "FlaskConical",
  },
  {
    title: "Placement Cell",
    titleHi: "प्लेसमेंट सेल",
    body: "Dedicated career coaches, mock interviews and 100+ hiring partners.",
    bodyHi: "कैरियर कोच, मॉक इंटरव्यू और 100+ हायरिंग पार्टनर।",
    icon: "Briefcase",
  },
  {
    title: "Scholarship Programs",
    titleHi: "छात्रवृत्ति कार्यक्रम",
    body: "Merit, girl child, sports and EWS pathways to keep education accessible.",
    bodyHi: "मेरिट, बालिका, खेल और ईडब्ल्यूएस मार्ग।",
    icon: "GraduationCap",
  },
  {
    title: "Hostel Facility",
    titleHi: "छात्रावास सुविधा",
    body: "Secure residential blocks with mess, wifi and round-the-clock support.",
    bodyHi: "सुरक्षित आवासीय ब्लॉक, मेस, वाई-फाई और 24x7 सहायता।",
    icon: "Building2",
  },
  {
    title: "Digital Learning Platform",
    titleHi: "डिजिटल लर्निंग प्लेटफॉर्म",
    body: "LMS access, assignments, attendance and counselling in one student login.",
    bodyHi: "एलएमएस, असाइनमेंट, उपस्थिति और काउंसलिंग एक छात्र लॉगिन में।",
    icon: "Laptop",
  },
] as const;

export const PLACEMENT_STATS = [
  { value: 500, suffix: "+", label: "Placement Opportunities", labelHi: "प्लेसमेंट अवसर" },
  { value: 100, suffix: "+", label: "Hiring Companies", labelHi: "भर्ती कंपनियाँ" },
  { value: 1, suffix: "", label: "Internship Support", labelHi: "इंटर्नशिप सहायता", display: "Yes", displayHi: "हाँ" },
  { value: 1, suffix: "", label: "Career Development Cell", labelHi: "कैरियर डेवलपमेंट सेल", display: "Active", displayHi: "सक्रिय" },
] as const;

export const SUCCESS_STORIES = [
  {
    name: "Ananya Sharma",
    nameHi: "अनन्या शर्मा",
    course: "D Pharma",
    courseHi: "डी फार्मा",
    placement: "Apollo Hospitals",
    package: "4.2 LPA",
    photo: "/photos/alumni-1.jpg",
    review:
      "Hospital postings and interview labs made my transition from campus to Apollo seamless. Counselling, dispensing practice and the hiring desk worked as one system — not only a certificate.",
    reviewHi:
      "अस्पताल पोस्टिंग और इंटरव्यू लैब से अपोलो तक का सफर सहज रहा। काउंसलिंग, डिस्पेंसिंग अभ्यास और हायरिंग डेस्क एक सिस्टम की तरह काम करते हैं।",
  },
  {
    name: "Rahul Verma",
    nameHi: "राहुल वर्मा",
    course: "DMLT",
    courseHi: "डीएमएलटी",
    placement: "Fortis",
    package: "3.8 LPA",
    photo: "/photos/alumni-2.jpg",
    review:
      "Diagnostic rotations prepared me for a hospital lab role with confidence. Sample handling, reporting discipline and mock interviews at GBTE mapped directly onto the Fortis floor.",
    reviewHi:
      "डायग्नोस्टिक रोटेशन ने अस्पताल लैब भूमिका के लिए तैयार किया। सैंपल हैंडलिंग, रिपोर्टिंग और मॉक इंटरव्यू सीधे फोर्टिस फ्लोर पर काम आए।",
  },
  {
    name: "Priya Singh",
    nameHi: "प्रिया सिंह",
    course: "D.El.Ed",
    courseHi: "डी.एल.एड",
    placement: "Kendriya Vidyalaya network",
    package: "3.6 LPA",
    photo: "/photos/alumni-3.jpg",
    review:
      "School internships gave me classroom presence and a teaching job in two years. Lesson plans, observation rounds and mentor feedback made the first classroom feel familiar.",
    reviewHi:
      "स्कूल इंटर्नशिप से कक्षा उपस्थिति और शिक्षण नौकरी मिली। लेसन प्लान, ऑब्जर्वेशन और मेंटर फीडबैक से पहली कक्षा जानी-पहचानी लगी।",
  },
  {
    name: "Mohd. Ayaan",
    nameHi: "मो. अयान",
    course: "X-Ray Technician",
    courseHi: "एक्स-रे टेक्नीशियन",
    placement: "Medanta",
    package: "3.9 LPA",
    photo: "/photos/alumni-4.jpg",
    review:
      "Imaging labs and clinical postings helped me join Medanta radiology. Positioning drills and patient-handling practice meant I was useful on day one, not only certified.",
    reviewHi:
      "इमेजिंग लैब और क्लिनिकल पोस्टिंग से मेदांता रेडियोलॉजी जुड़ाव हुआ। पोजिशनिंग और पेशेंट हैंडलिंग से पहले दिन से काम आया — केवल सर्टिफिकेट नहीं।",
  },
  {
    name: "Neha Gupta",
    nameHi: "नेहा गुप्ता",
    course: "BTC",
    courseHi: "बीटीसी",
    placement: "UP Government School",
    package: "3.4 LPA",
    photo: "/photos/alumni-5.jpg",
    review:
      "Teaching practice at partner schools built the classroom presence I needed. The career cell stayed with me through demo lessons until the government-school posting came through.",
    reviewHi:
      "पार्टनर स्कूलों में अभ्यास ने कक्षा उपस्थिति मजबूत की। करियर सेल डेमो लेसन तक साथ रहा, फिर सरकारी स्कूल पोस्टिंग मिली।",
  },
  {
    name: "Karan Patel",
    nameHi: "करन पटेल",
    course: "OT Technician",
    courseHi: "ओटी टेक्नीशियन",
    placement: "Fortis",
    package: "3.7 LPA",
    photo: "/photos/alumni-6.jpg",
    review:
      "OT rotations and placement-cell coordination helped me join Fortis theatres. Sterile discipline and live OT hours were the difference between a certificate and a first role.",
    reviewHi:
      "ओटी रोटेशन और प्लेसमेंट सेल से फोर्टिस जुड़ाव हुआ। स्टेराइल डिसिप्लिन और लाइव ओटी घंटे सर्टिफिकेट और पहली भूमिका का फर्क बने।",
  },
  {
    name: "Sneha Reddy",
    nameHi: "स्नेहा रेड्डी",
    course: "Artificial Intelligence",
    courseHi: "आर्टिफिशियल इंटेलिजेंस",
    placement: "TCS",
    package: "4.8 LPA",
    photo: "/photos/alumni-1.jpg",
    review:
      "Lab projects and placement-cell mocks made the TCS interview feel like another studio day. The AI diploma was practice, not only slides — and that showed in the first sprint.",
    reviewHi:
      "लैब प्रोजेक्ट और मॉक इंटरव्यू से टीसीएस राउंड स्टूडियो जैसा लगा। एआई डिप्लोमा अभ्यास था, केवल स्लाइड नहीं — पहली स्प्रिंट में फर्क दिखा।",
  },
  {
    name: "Arjun Mehta",
    nameHi: "अर्जुन मेहता",
    course: "Data Science & AI",
    courseHi: "डेटा साइंस और एआई",
    placement: "Infosys",
    package: "5.0 LPA",
    photo: "/photos/alumni-2.jpg",
    review:
      "Dataset labs, dashboards and a career-cell GD round mapped onto Infosys from week one. GBTE treated counselling, code reviews and the hiring desk as one system.",
    reviewHi:
      "डेटासेट लैब, डैशबोर्ड और जीडी राउंड पहले हफ्ते से इंफोसिस पर काम आए। काउंसलिंग, कोड रिव्यू और हायरिंग डेस्क एक सिस्टम थे।",
  },
  {
    name: "Ishita Kapoor",
    nameHi: "इशिता कपूर",
    course: "Digital Marketing",
    courseHi: "डिजिटल मार्केटिंग",
    placement: "Wipro",
    package: "4.4 LPA",
    photo: "/photos/alumni-3.jpg",
    review:
      "Campaign labs and client briefs prepared me for a Wipro marketing desk. Mentors stayed through the portfolio until the offer letter, not only until the exam.",
    reviewHi:
      "कैम्पेन लैब और क्लाइंट ब्रीफ ने विप्रो मार्केटिंग डेस्क के लिए तैयार किया। मेंटर्स पोर्टफोलियो से ऑफर तक साथ रहे — केवल परीक्षा तक नहीं।",
  },
  {
    name: "Vikram Singh",
    nameHi: "विक्रम सिंह",
    course: "D Pharma",
    courseHi: "डी फार्मा",
    placement: "Cipla",
    package: "4.1 LPA",
    photo: "/photos/alumni-4.jpg",
    review:
      "Dispensing practice and industry visits made Cipla feel like a continuation of campus, not a shock. The career cell kept hospital and pharma desks on the same calendar.",
    reviewHi:
      "डिस्पेंसिंग अभ्यास और इंडस्ट्री विजिट से सिप्ला कैंपस का अगला कदम लगा। करियर सेल अस्पताल और फार्मा डेस्क एक कैलेंडर पर रखता है।",
  },
  {
    name: "Meera Joshi",
    nameHi: "मीरा जोशी",
    course: "Generative AI",
    courseHi: "जनरेटिव एआई",
    placement: "HCL",
    package: "4.9 LPA",
    photo: "/photos/alumni-5.jpg",
    review:
      "Prompt labs, mini-products and interview drills carried into HCL. I walked in able to ship a demo — the certificate was the paperwork, the studio hours were the job.",
    reviewHi:
      "प्रॉम्प्ट लैब, मिनी-प्रोडक्ट और इंटरव्यू ड्रिल एचसीएल तक गए। डेमो शिप कर के गई — सर्टिफिकेट कागज़ था, स्टूडियो घंटे नौकरी थे।",
  },
  {
    name: "Aditya Rao",
    nameHi: "आदित्य राव",
    course: "Machine Learning",
    courseHi: "मशीन लर्निंग",
    placement: "Deloitte",
    package: "5.2 LPA",
    photo: "/photos/alumni-6.jpg",
    review:
      "Model labs and case interviews at GBTE matched Deloitte’s pace. Mentors treated the hiring partner as part of the semester, so the first project was not a surprise.",
    reviewHi:
      "मॉडल लैब और केस इंटरव्यू डेलॉयट की गति से मेल खाए। मेंटर्स हायरिंग पार्टनर को सेमेस्टर का हिस्सा मानते हैं — पहली प्रोजेक्ट अचानक नहीं लगी।",
  },
  {
    name: "Fatima Khan",
    nameHi: "फातिमा खान",
    course: "D Pharma",
    courseHi: "डी फार्मा",
    placement: "Sun Pharma",
    package: "4.0 LPA",
    photo: "/photos/alumni-1.jpg",
    review:
      "Quality and packaging rotations, plus career-cell prep, opened a Sun Pharma role. Campus practice and the plant floor finally felt like the same language.",
    reviewHi:
      "क्वालिटी-पैकेजिंग रोटेशन और करियर-सेल तैयारी से सन फार्मा भूमिका मिली। कैंपस अभ्यास और प्लांट फ्लोर एक भाषा लगने लगे।",
  },
  {
    name: "Rohan Das",
    nameHi: "रोहन दास",
    course: "X-Ray Technician",
    courseHi: "एक्स-रे टेक्नीशियन",
    placement: "Apollo Hospitals",
    package: "3.8 LPA",
    photo: "/photos/alumni-2.jpg",
    review:
      "Night-shift drills and patient-handling labs made Apollo radiology feel familiar on day one. GBTE did not stop at the certificate — the posting was part of the course.",
    reviewHi:
      "नाइट-शिफ्ट ड्रिल और पेशेंट हैंडलिंग से अपोलो रेडियोलॉजी पहले दिन जानी-पहचानी लगी। जीबीटीई सर्टिफिकेट पर नहीं रुका — पोस्टिंग कोर्स का हिस्सा थी।",
  },
  {
    name: "Kabir Sharma",
    nameHi: "कबीर शर्मा",
    course: "AI Chatbots",
    courseHi: "एआई चैटबॉट",
    placement: "TCS",
    package: "4.6 LPA",
    photo: "/photos/alumni-3.jpg",
    review:
      "Bot labs and live client scripts prepared me for a TCS support-automation desk. GBTE kept the IT hiring partner inside the semester, not after it.",
    reviewHi:
      "बॉट लैब और लाइव स्क्रिप्ट ने टीसीएस ऑटोमेशन डेस्क के लिए तैयार किया। आईटी हायरिंग पार्टनर सेमेस्टर के अंदर था, बाद में नहीं।",
  },
  {
    name: "Anjali Nair",
    nameHi: "अंजलि नायर",
    course: "Data Science & AI",
    courseHi: "डेटा साइंस और एआई",
    placement: "Wipro",
    package: "4.7 LPA",
    photo: "/photos/alumni-4.jpg",
    review:
      "SQL labs and a Wipro case clinic made the first dashboard feel like classwork. The career cell named the sanstha early — so the role was never a guess.",
    reviewHi:
      "एसक्यूएल लैब और विप्रो केस क्लिनिक से पहला डैशबोर्ड क्लासवर्क लगा। करियर सेल ने संस्था पहले दिन बताई — भूमिका अंदाज़ा नहीं रही।",
  },
  {
    name: "Sameer Ali",
    nameHi: "समीर अली",
    course: "DMLT",
    courseHi: "डीएमएलटी",
    placement: "Medanta",
    package: "3.9 LPA",
    photo: "/photos/alumni-5.jpg",
    review:
      "Hospital lab hours at Medanta matched what we drilled on campus. Sample flow, reporting and night shifts were already muscle memory.",
    reviewHi:
      "मेदांता लैब घंटे कैंपस ड्रिल से मेल खाए। सैंपल फ्लो, रिपोर्टिंग और नाइट शिफ्ट पहले से आदत थे।",
  },
  {
    name: "Divya Patel",
    nameHi: "दिव्या पटेल",
    course: "D Pharma",
    courseHi: "डी फार्मा",
    placement: "Cipla",
    package: "4.0 LPA",
    photo: "/photos/alumni-6.jpg",
    review:
      "Plant visits and dispensing logs made Cipla a known floor. Pharma partners sit on the same hiring calendar as hospitals at GBTE.",
    reviewHi:
      "प्लांट विजिट और डिस्पेंसिंग लॉग से सिप्ला जाना-पहचाना फ्लोर बना। जीबीटीई में फार्मा और अस्पताल एक ही हायरिंग कैलेंडर पर हैं।",
  },
  {
    name: "Nikhil Jain",
    nameHi: "निखिल जैन",
    course: "Robotics & AI",
    courseHi: "रोबोटिक्स और एआई",
    placement: "HCL",
    package: "5.1 LPA",
    photo: "/photos/alumni-1.jpg",
    review:
      "Hardware labs and an HCL tech-drive mock got me onto an automation bench. The IT sanstha was on the noticeboard from semester one.",
    reviewHi:
      "हार्डवेयर लैब और एचसीएल टेक-ड्राइव मॉक से ऑटोमेशन बेंच मिला। आईटी संस्था पहले सेमेस्टर से नोटिसबोर्ड पर थी।",
  },
  {
    name: "Kavya Iyer",
    nameHi: "काव्या अय्यर",
    course: "OT Technician",
    courseHi: "ओटी टेक्नीशियन",
    placement: "Fortis",
    package: "3.8 LPA",
    photo: "/photos/alumni-2.jpg",
    review:
      "Theatre discipline at Fortis was the same checklist we used in campus OT. Hospital partners are not logos here — they are the posting.",
    reviewHi:
      "फोर्टिस थिएटर डिसिप्लिन वही चेकलिस्ट थी जो कैंपस ओटी में थी। अस्पताल पार्टनर यहाँ लोगो नहीं — पोस्टिंग हैं।",
  },
] as const;

export const ADMISSION_STEPS = [
  { step: 1, title: "Register Online", titleHi: "ऑनलाइन पंजीकरण", body: "Create your admission profile in minutes.", bodyHi: "कुछ मिनटों में प्रवेश प्रोफ़ाइल बनाएँ।" },
  { step: 2, title: "Counselling Session", titleHi: "काउंसलिंग सत्र", body: "Free career guidance with programme mentors.", bodyHi: "कार्यक्रम मेंटर्स के साथ निःशुल्क मार्गदर्शन।" },
  { step: 3, title: "Document Verification", titleHi: "दस्तावेज़ सत्यापन", body: "Upload marksheets, ID and category proofs.", bodyHi: "मार्कशीट, आईडी और श्रेणी प्रमाण अपलोड करें।" },
  { step: 4, title: "Fee Submission", titleHi: "शुल्क जमा", body: "Pay securely online or at the campus accounts desk.", bodyHi: "ऑनलाइन या परिसर खाता डेस्क पर भुगतान करें।" },
  { step: 5, title: "Admission Confirmation", titleHi: "प्रवेश पुष्टि", body: "Receive allotment letter and student portal access.", bodyHi: "आवंटन पत्र और स्टूडेंट पोर्टल एक्सेस प्राप्त करें।" },
] as const;

export const SCHOLARSHIPS = [
  {
    slug: "merit",
    title: "Merit Scholarship",
    titleHi: "मेरिट छात्रवृत्ति",
    amount: "Up to 50% tuition",
    amountHi: "ट्यूशन का 50% तक",
    detail: "Awarded on 10+2 / graduation scores and entrance performance.",
    detailHi: "10+2 / स्नातक अंक और प्रवेश प्रदर्शन पर।",
    eligibility: "Strong board or graduation marks on a diploma, degree or certificate file.",
    eligibilityHi: "डिप्लोमा, डिग्री या सर्टिफिकेट फाइल पर अच्छे बोर्ड या स्नातक अंक।",
    docs: "Class 10 and 12 marksheets; graduation marksheet if applying for a degree.",
    docsHi: "कक्षा 10 और 12 की मार्कशीट; डिग्री के लिए स्नातक मार्कशीट।",
    image: "/photos/classroom.jpg",
  },
  {
    slug: "girl-child",
    title: "Girl Child Scholarship",
    titleHi: "बालिका छात्रवृत्ति",
    amount: "Special fee waiver",
    amountHi: "विशेष शुल्क छूट",
    detail: "Encouraging women in pharmacy, education and paramedical diplomas.",
    detailHi: "फार्मेसी, शिक्षा और पैरामेडिकल डिप्लोमा में महिलाओं को प्रोत्साहन।",
    eligibility: "Women applicants on pharmacy, education, paramedical, design and AI pathways.",
    eligibilityHi: "फार्मेसी, शिक्षा, पैरामेडिकल, डिज़ाइन और एआई मार्ग पर महिला आवेदक।",
    docs: "ID proof and the same academic papers as the admission file.",
    docsHi: "आईडी प्रमाण और प्रवेश फाइल जैसे शैक्षणिक कागज़।",
    image: "/photos/education.jpg",
  },
  {
    slug: "sports",
    title: "Sports Scholarship",
    titleHi: "खेल छात्रवृत्ति",
    amount: "Performance linked",
    amountHi: "प्रदर्शन आधारित",
    detail: "For state, national and university-level sportspersons.",
    detailHi: "राज्य, राष्ट्रीय और विश्वविद्यालय स्तर के खिलाड़ियों के लिए।",
    eligibility: "State, national or university sporting credentials, still in date.",
    eligibilityHi: "राज्य, राष्ट्रीय या विश्वविद्यालय खेल प्रमाण, वैध अवधि में।",
    docs: "Federation or university certificate, plus ID and marksheets.",
    docsHi: "फेडरेशन या विश्वविद्यालय प्रमाण, साथ में आईडी और मार्कशीट।",
    image: "/photos/sports.jpg",
  },
  {
    slug: "ews",
    title: "Economically Weaker Section Scholarship",
    titleHi: "आर्थिक रूप से कमजोर वर्ग छात्रवृत्ति",
    amount: "Need-based aid",
    amountHi: "आवश्यकता आधारित सहायता",
    detail: "Income-linked support with transparent documentation.",
    detailHi: "पारदर्शी दस्तावेज़ीकरण के साथ आय-आधारित सहायता।",
    eligibility: "Valid income / EWS certificate as notified for the session.",
    eligibilityHi: "सत्र के लिए अधिसूचित वैध आय / ईडब्ल्यूएस प्रमाण।",
    docs: "Income or EWS certificate, ID, and the admission marksheets.",
    docsHi: "आय या ईडब्ल्यूएस प्रमाण, आईडी, और प्रवेश मार्कशीट।",
    image: "/photos/campus-jalaun.jpg",
  },
] as const;

export const FACILITIES = [
  { title: "Smart Classrooms", titleHi: "स्मार्ट कक्षाएँ", image: "/photos/education.jpg" },
  { title: "Library", titleHi: "पुस्तकालय", image: "/photos/library.jpg" },
  { title: "Computer Labs", titleHi: "कंप्यूटर लैब", image: "/photos/computer.jpg" },
  { title: "Pharmacy Labs", titleHi: "फार्मेसी लैब", image: "/photos/pharmacy.jpg" },
  { title: "Hostel", titleHi: "छात्रावास", image: "/photos/hostel.jpg" },
  { title: "Transport", titleHi: "परिवहन", image: "/photos/transport.jpg" },
  { title: "Sports Ground", titleHi: "खेल मैदान", image: "/photos/sports.jpg" },
  { title: "Seminar Hall", titleHi: "सेमिनार हॉल", image: "/photos/seminar.jpg" },
] as const;

export const NEWS = [
  {
    slug: "admission-open-2027",
    title: "Admission Open 2027",
    titleHi: "प्रवेश 2027 प्रारंभ",
    date: "2026-09-01",
    tag: "Admissions",
    image: "/photos/classroom.jpg",
    excerpt: "Applications are live for diploma, degree and certificate pathways at the Noida campus.",
    excerptHi: "नोएडा परिसर में डिप्लोमा, डिग्री और सर्टिफिकेट के लिए आवेदन शुरू।",
    body: "GBTE has opened admissions for the 2027 academic session at C-77, Sector 63A, Noida. Candidates may apply online, book complimentary counselling, or visit the desk with marksheets. Early files are prioritised for scholarship shortlists and hostel allotment. Pharmacy, education, paramedical, design and AI pathways are all receiving applications.",
    bodyHi: "जीबीटीई ने सी-77, सेक्टर 63ए, नोएडा में 2027 सत्र के प्रवेश खोल दिए हैं। ऑनलाइन आवेदन, निःशुल्क काउंसलिंग या मार्कशीट के साथ डेस्क पर आएँ। प्रारंभिक फाइलों को छात्रवृत्ति और छात्रावास में प्राथमिकता मिलती है।",
  },
  {
    slug: "scholarship-announcements",
    title: "Scholarship desk is receiving files",
    titleHi: "छात्रवृत्ति डेस्क पर फाइलें स्वीकार",
    date: "2026-09-12",
    tag: "Scholarships",
    image: "/photos/education.jpg",
    excerpt: "Merit, girl child, sports and EWS scholarships are now accepting supporting documents.",
    excerptHi: "मेरिट, बालिका, खेल और ईडब्ल्यूएस छात्रवृत्ति के लिए दस्तावेज़ स्वीकार किए जा रहे हैं।",
    body: "Eligible students should upload marksheets, income certificates and sports credentials with their admission file. Counsellors on WhatsApp will confirm which award fits the programme — diploma, degree or certificate. Awards are confirmed only after document verification at Noida.",
    bodyHi: "पात्र छात्र मार्कशीट, आय प्रमाण और खेल प्रमाण अपनी प्रवेश फाइल के साथ अपलोड करें। काउंसलर व्हाट्सएप पर बताएँगे कि डिप्लोमा, डिग्री या सर्टिफिकेट के लिए कौन-सी सहायता उपयुक्त है।",
  },
  {
    slug: "placement-drives",
    title: "Autumn placement calendar released",
    titleHi: "शरद प्लेसमेंट कैलेंडर जारी",
    date: "2026-08-20",
    tag: "Placements",
    image: "/photos/seminar.jpg",
    excerpt: "TCS, Wipro, HCL, Infosys, Apollo, Fortis and Medanta are on the hiring calendar.",
    excerptHi: "टीसीएस, विप्रो, एचसीएल, इंफोसिस, अपोलो, फोर्टिस और मेदांता कैलेंडर में।",
    body: "The career cell will run aptitude labs, group discussions and hospital interview simulations before each drive. Students must keep placement-dashboard profiles current. Pharmacy, paramedical and education batches have dedicated briefing slots in the seminar hall.",
    bodyHi: "प्रत्येक ड्राइव से पहले करियर सेल एप्टीट्यूड लैब, समूह चर्चा और अस्पताल साक्षात्कार सिमुलेशन चलाएगा। छात्रों को प्लेसमेंट डैशबोर्ड अद्यतन रखना होगा।",
  },
  {
    slug: "workshops",
    title: "Dispensing and clinical workshops",
    titleHi: "डिस्पेंसिंग और क्लिनिकल कार्यशालाएँ",
    date: "2026-08-05",
    tag: "Campus",
    image: "/photos/pharmacy.jpg",
    excerpt: "Pharmacy compounding, clinical skills and teaching-practice workshops run through the semester.",
    excerptHi: "फार्मेसी कंपाउंडिंग, क्लिनिकल स्किल्स और शिक्षण-अभ्यास कार्यशालाएँ सेमेस्टर भर।",
    body: "Workshops are open to enrolled students. Attendance is recorded at the lab door; certificates are issued on the student portal after a short assessment. Guests from hospital pharmacies will demonstrate dispensing rounds in October.",
    bodyHi: "कार्यशालाएँ नामांकित छात्रों के लिए खुली हैं। उपस्थिति लैब द्वार पर दर्ज होती है; आकलन के बाद पोर्टल पर प्रमाण पत्र जारी होता है।",
  },
  {
    slug: "campus-events",
    title: "Sports meet and open house dates",
    titleHi: "खेल मीट और ओपन हाउस तिथियाँ",
    date: "2026-07-28",
    tag: "Events",
    image: "/photos/sports.jpg",
    excerpt: "Orientation, cultural evening and inter-batch sports meet dates released for the 2027 intake.",
    excerptHi: "2027 बैच के लिए ओरिएंटेशन, सांस्कृतिक संध्या और इंटर-बैच खेल मीट की तिथियाँ जारी।",
    body: "Families are invited to the Noida open house. The ground will host an inter-batch sports meet, and BTC / D.El.Ed aspirants have a dedicated showcase in the seminar wing. Register at the desk or through the enquiry form.",
    bodyHi: "परिवार नोएडा ओपन हाउस में आमंत्रित हैं। मैदान पर इंटर-बैच खेल मीट होगी, और बीटीसी / डी.एल.एड आकांक्षियों के लिए सेमिनार विंग में प्रदर्शन होगा।",
  },
  {
    slug: "hostel-orientation",
    title: "Hostel orientation for new residents",
    titleHi: "नए निवासियों के लिए छात्रावास ओरिएंटेशन",
    date: "2026-09-18",
    tag: "Campus",
    image: "/photos/hostel.jpg",
    excerpt: "Separate, secure blocks with mess, wifi and night support — allotment after fee confirmation.",
    excerptHi: "मेस, वाई-फाई और रात्रि सहायता के साथ सुरक्षित ब्लॉक — शुल्क पुष्टि के बाद आवंटन।",
    body: "New residents report to the hostel office with ID, two photographs and the fee receipt. Wardens walk through mess timings, visitor rules and the night-support desk. Outstation students may request a campus-tour slot the same afternoon.",
    bodyHi: "नए निवासी आईडी, दो फोटो और शुल्क रसीद के साथ छात्रावास कार्यालय पहुँचें। वार्डन मेस समय, आगंतुक नियम और रात्रि डेस्क बताएँगे।",
  },
  {
    slug: "culinary-evening",
    title: "Culinary studio evening",
    titleHi: "कुलिनरी स्टूडियो संध्या",
    date: "2026-09-22",
    tag: "Events",
    image: "/photos/culinary.jpg",
    excerpt: "Certificate and diploma kitchens host a tasting for families and counselling guests.",
    excerptHi: "सर्टिफिकेट और डिप्लोमा रसोई परिवारों और काउंसलिंग अतिथियों के लिए टेस्टिंग।",
    body: "The culinary studio opens after classes for a supervised tasting. Guests see how short certificates sit beside longer diploma kitchens. Seats are limited; register with the counselling desk.",
    bodyHi: "कक्षाओं के बाद कुलिनरी स्टूडियो में पर्यवेक्षित टेस्टिंग होगी। अतिथि देखेंगे कि छोटे सर्टिफिकेट लंबी डिप्लोमा रसोई के साथ कैसे चलते हैं।",
  },
  {
    slug: "paramedical-open-day",
    title: "Paramedical open day",
    titleHi: "पैरामेडिकल ओपन डे",
    date: "2026-09-26",
    tag: "Admissions",
    image: "/photos/medical.jpg",
    excerpt: "DMLT, X-Ray and OT labs open for school leavers and their parents.",
    excerptHi: "डीएमएलटी, एक्स-रे और ओटी लैब स्कूल-लीवर्स और अभिभावकों के लिए खुली।",
    body: "Faculty will demonstrate basic lab safety and walk parents through eligibility for DMLT, X-Ray Technician and OT Technician. A counsellor will take files the same morning so school leavers leave with a dated appointment, not a brochure only.",
    bodyHi: "संकाय लैब सुरक्षा दिखाएँगे और डीएमएलटी, एक्स-रे व ओटी पात्रता बताएँगे। काउंसलर उसी सुबह फाइल लेंगे ताकि छात्र केवल ब्रॉशर न, नियुक्ति लेकर जाएँ।",
  },
  {
    slug: "design-atelier",
    title: "Interior design atelier hours",
    titleHi: "इंटीरियर डिज़ाइन एटेलियर",
    date: "2026-08-14",
    tag: "Campus",
    image: "/photos/interior.jpg",
    excerpt: "Studio hours extended twice a week for diploma and certificate design batches.",
    excerptHi: "डिप्लोमा और सर्टिफिकेट डिज़ाइन बैच के लिए सप्ताह में दो बार अतिरिक्त स्टूडियो समय।",
    body: "The atelier stays open Tuesday and Thursday evenings for drawing, material boards and faculty critique. Certificate students may book a desk beside diploma batches. Visitors during counselling hours are welcome to walk the studio with a mentor.",
    bodyHi: "एटेलियर मंगलवार और गुरुवार शाम ड्राइंग, मटेरियल बोर्ड और संकाय समीक्षा के लिए खुला रहेगा। सर्टिफिकेट छात्र डिप्लोमा बैच के साथ डेस्क बुक कर सकते हैं।",
  },
  {
    slug: "library-week",
    title: "Library week on Sector 63A",
    titleHi: "सेक्टर 63ए पर पुस्तकालय सप्ताह",
    date: "2026-08-02",
    tag: "Campus",
    image: "/photos/library.jpg",
    excerpt: "Quiet stacks, reference desks and recorded revision for pharmacy, education and allied health.",
    excerptHi: "फार्मेसी, शिक्षा और संबद्ध स्वास्थ्य के लिए शांत स्टैक, संदर्भ डेस्क और रिकॉर्डेड रिवीजन।",
    body: "Library week introduces new reference shelves and evening quiet hours. Students collect reader cards at the desk. Faculty will host a short briefing on using recorded lectures beside the stacks — not instead of them.",
    bodyHi: "पुस्तकालय सप्ताह में नई संदर्भ अलमारियाँ और शाम की शांत अवधि शुरू होंगी। छात्र डेस्क से रीडर कार्ड लें।",
  },
  {
    slug: "ai-lab-briefing",
    title: "AI lab briefing for new diplomas",
    titleHi: "नए डिप्लोमा के लिए एआई लैब ब्रीफिंग",
    date: "2026-07-15",
    tag: "Campus",
    image: "/photos/computer.jpg",
    excerpt: "Workstations ready for Artificial Intelligence, data and chatbot certificate groups.",
    excerptHi: "आर्टिफिशियल इंटेलिजेंस, डेटा और चैटबॉट सर्टिफिकेट समूहों के लिए वर्कस्टेशन तैयार।",
    body: "The computer lab has been scheduled for AI diploma and certificate batches from the first teaching week. Mentors will cover lab login, submission folders and the difference between diploma hours and short certificates. Bring a notebook; personal laptops are optional.",
    bodyHi: "कंप्यूटर लैब पहले शिक्षण सप्ताह से एआई डिप्लोमा और सर्टिफिकेट बैच के लिए निर्धारित है। मेंटर लॉगिन, सबमिशन फ़ोल्डर और डिप्लोमा बनाम सर्टिफिकेट घंटे बताएँगे।",
  },
  {
    slug: "photography-club",
    title: "Photography club open call",
    titleHi: "फोटोग्राफी क्लब आमंत्रण",
    date: "2026-07-08",
    tag: "Events",
    image: "/photos/photography.jpg",
    excerpt: "Campus photographers wanted for the gazette, sports meet and open-house portraits.",
    excerptHi: "गजट, खेल मीट और ओपन-हाउस पोर्ट्रेट के लिए परिसर फोटोग्राफर आमंत्रित।",
    body: "The photography club meets after last lecture on Fridays. Certificate students and diploma batches may join; cameras can be borrowed from the studio store against ID. Selected frames appear in this gazette and on the admissions notice board.",
    bodyHi: "फोटोग्राफी क्लब शुक्रवार को अंतिम व्याख्यान के बाद मिलता है। कैमरा स्टूडियो स्टोर से आईडी पर उधार मिल सकता है। चयनित फ्रेम इस गजट और प्रवेश बोर्ड पर लगेंगे।",
  },
];

export const FAQS = [
  { q: "When do admissions open for 2027?", qHi: "2027 के प्रवेश कब खुलते हैं?", a: "Admissions for the 2027 session are open now. You can apply online, request counselling, or visit the Noida campus.", aHi: "2027 सत्र के प्रवेश अभी खुले हैं। आप ऑनलाइन आवेदन, काउंसलिंग या नोएडा परिसर में जा सकते हैं।" },
  { q: "How do I apply online?", qHi: "ऑनलाइन आवेदन कैसे करें?", a: "Use Apply Now, complete the enquiry form, and our admissions team will create your application file within one working day.", aHi: "Apply Now उपयोग करें, फॉर्म भरें, और प्रवेश टीम एक कार्य दिवस में आपकी फाइल बनाएगी।" },
  { q: "What documents are required?", qHi: "कौन से दस्तावेज़ चाहिए?", a: "Photo, ID proof, 10th and 12th marksheets, graduation marksheets (if applicable), category/income certificates and passport photos.", aHi: "फोटो, आईडी, 10वीं-12वीं मार्कशीट, स्नातक मार्कशीट (यदि लागू), श्रेणी/आय प्रमाण और पासपोर्ट फोटो।" },
  { q: "Is there an entrance examination?", qHi: "क्या प्रवेश परीक्षा है?", a: "Most diploma seats are filled through counselling and eligibility checks. Education diplomas follow the latest NCTE/state rules.", aHi: "अधिकांश डिप्लोमा सीटें काउंसलिंग और पात्रता जाँच से भरती हैं। शिक्षा डिप्लोमा नवीनतम एनसीटीई/राज्य नियमों का पालन करते हैं।" },
  { q: "What diploma courses are offered?", qHi: "कौन से डिप्लोमा पाठ्यक्रम हैं?", a: "AI diplomas (Artificial Intelligence, Generative AI, Data Science & AI, Machine Learning, AI Chatbots), creative diplomas such as Interior Design and Culinary Arts, plus D Pharma, D.El.Ed, BTC, DMLT, X-Ray Technician and OT Technician.", aHi: "एआई डिप्लोमा (आर्टिफिशियल इंटेलिजेंस, जनरेटिव एआई, डेटा साइंस, मशीन लर्निंग, चैटबॉट), इंटीरियर व कलिनरी, साथ में डी फार्मा, डी.एल.एड, बीटीसी, डीएमएलटी, एक्स-रे और ओटी।" },
  { q: "What is the eligibility for D Pharma?", qHi: "डी फार्मा की पात्रता क्या है?", a: "10+2 with Physics, Chemistry and Biology or Mathematics from a recognised board.", aHi: "मान्यता प्राप्त बोर्ड से भौतिकी, रसायन और जीव विज्ञान या गणित के साथ 10+2।" },
  { q: "What is the eligibility for D.El.Ed?", qHi: "डी.एल.एड की पात्रता क्या है?", a: "10+2 with 50% as per NCTE norms. Counselling confirms the latest state notification.", aHi: "एनसीटीई मानकों के अनुसार 10+2 में 50%। काउंसलिंग नवीनतम राज्य अधिसूचना की पुष्टि करती है।" },
  { q: "What is the eligibility for DMLT?", qHi: "डीएमएलटी की पात्रता क्या है?", a: "10+2 Science, preferably PCB, from a recognised board.", aHi: "मान्यता प्राप्त बोर्ड से 10+2 विज्ञान, अधिमानतः PCB।" },
  { q: "Are programmes PCI approved?", qHi: "क्या कार्यक्रम पीसीआई अनुमोदित हैं?", a: "Pharmacy programmes are designed as PCI approved pathways. Always confirm the latest approval status with admissions during counselling.", aHi: "फार्मेसी कार्यक्रम पीसीआई अनुमोदित मार्ग के रूप में डिज़ाइन हैं। काउंसलिंग में नवीनतम स्थिति की पुष्टि करें।" },
  { q: "Is hostel facility available?", qHi: "क्या छात्रावास उपलब्ध है?", a: "Yes. Separate, secure hostel facilities are available, subject to allotment after fee confirmation.", aHi: "हाँ। शुल्क पुष्टि के बाद आवंटन के अधीन सुरक्षित छात्रावास उपलब्ध हैं।" },
  { q: "Which scholarships can I apply for?", qHi: "किन छात्रवृत्तियों के लिए आवेदन कर सकते हैं?", a: "Merit, girl child, sports and economically weaker section scholarships. Counsellors help you pick the best fit.", aHi: "मेरिट, बालिका, खेल और ईडब्ल्यूएस। काउंसलर सर्वोत्तम विकल्प चुनने में मदद करते हैं।" },
  { q: "How can I pay the fees?", qHi: "शुल्क कैसे जमा करें?", a: "Online payment gateway, NEFT/RTGS, demand draft or campus accounts counter. Instalment plans are offered on selected programmes.", aHi: "ऑनलाइन गेटवे, NEFT/RTGS, डिमांड ड्राफ्ट या परिसर खाता काउंटर। चयनित कार्यक्रमों पर किस्त योजना।" },
  { q: "Do you provide placement support?", qHi: "क्या प्लेसमेंट सहायता मिलती है?", a: "Yes. A dedicated placement and career development cell supports internships, drives and hospital/industry interviews.", aHi: "हाँ। समर्पित प्लेसमेंट और कैरियर सेल इंटर्नशिप, ड्राइव और साक्षात्कार में सहायता करता है।" },
  { q: "Can I visit the campus before applying?", qHi: "आवेदन से पहले परिसर देख सकते हैं?", a: "Yes. Book a campus tour via the counselling form or call +91 9355470710. Visitors are welcome at C-77, Sector 63A, Noida.", aHi: "हाँ। काउंसलिंग फॉर्म या +91 9355470710 पर कॉल कर टूर बुक करें। सी-77, सेक्टर 63ए, नोएडा पर आगंतुक आमंत्रित हैं।" },
  { q: "Is lateral entry available?", qHi: "क्या डिप्लोमा के बाद डिग्री कर सकते हैं?", a: "Yes. After a GBTE diploma, counsellors guide you toward eligible degree pathways (such as B Pharma after D Pharma) at partner universities.", aHi: "हाँ। जीबीटीई डिप्लोमा के बाद काउंसलर पात्र डिग्री मार्ग (जैसे डी फार्मा के बाद बी फार्मा) बताते हैं।" },
  { q: "What is the reservation policy?", qHi: "आरक्षण नीति क्या है?", a: "GBTE follows Government of Uttar Pradesh and affiliating university reservation norms.", aHi: "जीबीटीई उत्तर प्रदेश सरकार और संबद्ध विश्वविद्यालय की आरक्षण नीति का पालन करता है।" },
  { q: "Do you admit students from other states?", qHi: "क्या अन्य राज्यों के छात्र प्रवेश ले सकते हैं?", a: "Yes. Students from across India can apply. Hostel and transport guidance is provided during counselling.", aHi: "हाँ। पूरे भारत से आवेदन संभव है। काउंसलिंग में छात्रावास और परिवहन मार्गदर्शन मिलता है।" },
  { q: "How do I book free counselling?", qHi: "निःशुल्क काउंसलिंग कैसे बुक करें?", a: "Use Free Counselling on the site, the 20-second popup, WhatsApp, or call the admissions helpline.", aHi: "साइट पर फ्री काउंसलिंग, पॉपअप, व्हाट्सएप या हेल्पलाइन का उपयोग करें।" },
  { q: "Where is the GBTE campus?", qHi: "जीबीटीई परिसर कहाँ है?", a: "GBTE operates from C-77, Sector 63A, Noida, Uttar Pradesh — our headquarters for all diploma programmes.", aHi: "जीबीटीई सी-77, सेक्टर 63ए, नोएडा, उत्तर प्रदेश से संचालित होता है — सभी डिप्लोमा कार्यक्रमों का मुख्यालय।" },
  { q: "What is the fee refund policy?", qHi: "शुल्क वापसी नीति क्या है?", a: "Refunds follow UGC/affiliating university timelines after written withdrawal. The admissions office issues the exact schedule at confirmation.", aHi: "लिखित निकासी के बाद यूजीसी/विश्वविद्यालय समयसीमा के अनुसार रिफंड। पुष्टि पर सटीक अनुसूची जारी होती है।" },
] as const;

export const CHATBOT_KB = [
  { keys: ["admission", "apply", "2027", "प्रवेश"], answer: "Admissions for 2027 are open. Tap Apply Now or share your name, phone and course — we will call you back.", answerHi: "2027 के प्रवेश खुले हैं। Apply Now दबाएँ या नाम, फोन और कोर्स भेजें — हम कॉल करेंगे।" },
  { keys: ["fee", "fees", "शुल्क"], answer: "Fees vary by programme and scholarship. Book a counselling slot for a personalised fee plan.", answerHi: "शुल्क कार्यक्रम और छात्रवृत्ति के अनुसार हैं। व्यक्तिगत योजना के लिए काउंसलिंग बुक करें।" },
  { keys: ["hostel", "छात्रावास"], answer: "Hostels are available at the Noida campus after admission confirmation. Ask counselling for current occupancy.", answerHi: "प्रवेश पुष्टि के बाद नोएडा परिसर में छात्रावास उपलब्ध हैं।" },
  { keys: ["placement", "job", "प्लेसमेंट"], answer: "We provide 95% placement support with 100+ hiring partners including TCS, Wipro, HCL, Infosys, Apollo, Fortis and Medanta.", answerHi: "टीसीएस, विप्रो, एचसीएल, इंफोसिस, अपोलो, फोर्टिस और मेदांता सहित 100+ भागीदारों के साथ 95% प्लेसमेंट सहायता।" },
  { keys: ["scholarship", "छात्रवृत्ति"], answer: "Merit, girl child, sports and EWS scholarships are open. Upload documents with your application.", answerHi: "मेरिट, बालिका, खेल और ईडब्ल्यूएस छात्रवृत्ति खुली हैं।" },
  { keys: ["pharmacy", "pharma", "फार्मा", "diploma", "डिप्लोमा", "fashion", "interior", "culinary", "ai", "chatgpt", "machine"], answer: "GBTE AI diplomas: Artificial Intelligence, Generative AI, Data Science & AI, Machine Learning and AI Chatbots — plus design, culinary, pharmacy and paramedical diplomas.", answerHi: "जीबीटीई एआई डिप्लोमा: आर्टिफिशियल इंटेलिजेंस, जनरेटिव एआई, डेटा साइंस, मशीन लर्निंग और एआई चैटबॉट — साथ में डिज़ाइन, कलिनरी, फार्मेसी और पैरामेडिकल।" },
  { keys: ["contact", "phone", "whatsapp", "संपर्क"], answer: "Call or WhatsApp +91 9355470710 or email admission@gbedutrust.com. Campus: C-77, Sector 63A, Noida.", answerHi: "कॉल/व्हाट्सएप +91 9355470710 या admission@gbedutrust.com। परिसर: सी-77, सेक्टर 63ए, नोएडा।" },
  { keys: ["noida", "campus", "परिसर"], answer: "Noida campus: C-77, Sector 63A, Noida, Uttar Pradesh.", answerHi: "नोएडा परिसर: सी-77, सेक्टर 63ए, नोएडा, उत्तर प्रदेश।" },
] as const;

export const LEADERSHIP = [
  {
    role: "Chairman & Managing Trustee",
    roleHi: "अध्यक्ष एवं प्रबंध न्यासी",
    message:
      "Gautam Buddha Educational Trust was established with a singular conviction: to make rigorous, ethical and career-defining education accessible to every student across North India.",
    messageHi:
      "गौतम बुद्ध एजुकेशनल ट्रस्ट की स्थापना इस संकल्प के साथ हुई थी कि उत्तर भारत के प्रत्येक विद्यार्थी तक कठोर, नैतिक और करियर-उन्मुख शिक्षा सरलता से पहुँचे।",
  },
  {
    role: "Director General",
    roleHi: "महानिदेशक",
    message:
      "Our classrooms, advanced laboratories, and Career Development Cell function as one unified ecosystem — ensuring our graduates step out job-ready, not just certified.",
    messageHi:
      "हमारी कक्षाएँ, आधुनिक प्रयोगशालाएँ और करियर सेल एक एकीकृत व्यवस्था के रूप में काम करते हैं — ताकि छात्र केवल कागज़ी डिग्री नहीं, बल्कि पहले दिन से काम करने का हुनर लेकर निकलें।",
  },
  {
    role: "Dean — Clinical & Healthcare Alliances",
    roleHi: "डीन — क्लिनिकल एवं स्वास्थ्य साझेदारी",
    message:
      "By integrating hospital ward postings at Apollo, Fortis and Medanta inside our academic calendar, we ensure our pharmacy and paramedical students practice on live clinical protocols.",
    messageHi:
      "अपोलो, फोर्टिस और मेदांता के साथ हमारे अस्पताल रोटेशन यह सुनिश्चित करते हैं कि फार्मेसी और पैरामेडिकल छात्र वास्तविक क्लिनिकल माहौल में महारत हासिल करें।",
  },
] as const;

export const GOVERNMENT_APPROVALS = [
  {
    code: "PCI",
    title: "Pharmacy Council of India",
    titleHi: "फार्मेसी काउंसिल ऑफ इंडिया",
    scope: "Statutory approval under Section 12 for D.Pharm & Pharmacy Education",
    scopeHi: "डी.फार्म और फार्मेसी शिक्षा के लिए वैधानिक अनुमोदन",
    badge: "Statutory Healthcare Council",
    badgeHi: "वैधानिक स्वास्थ्य परिषद",
  },
  {
    code: "BTE UP",
    title: "Board of Technical Education, UP",
    titleHi: "प्राविधिक शिक्षा परिषद, उत्तर प्रदेश",
    scope: "State government board affiliation for curriculum, exams & diploma conferment",
    scopeHi: "पाठ्यक्रम, परीक्षा एवं राज्य स्तरीय डिप्लोमा के लिए सरकारी संबद्धता",
    badge: "State Technical Board",
    badgeHi: "राज्य प्राविधिक बोर्ड",
  },
  {
    code: "NCTE",
    title: "National Council for Teacher Education",
    titleHi: "राष्ट्रीय अध्यापक शिक्षा परिषद",
    scope: "Curriculum & pedagogical standards for D.El.Ed & primary teacher education",
    scopeHi: "डी.एल.एड एवं प्राथमिक शिक्षण के लिए राष्ट्रीय अध्यापक शिक्षा मानक",
    badge: "National Educator Body",
    badgeHi: "राष्ट्रीय शिक्षक शिक्षा निकाय",
  },
  {
    code: "NSDC / NCVET",
    title: "Skill India & Digital Upskilling",
    titleHi: "स्किल इंडिया एवं डिजिटल अपस्किलिंग",
    scope: "AI, Big Data & Cloud curriculum integration via Parimanam LMS Skill Foundry",
    scopeHi: "परिमाणम एलएमएस स्किल फाउंड्री के तहत एआई और क्लाउड सर्टिफिकेशन",
    badge: "Skill India Mission",
    badgeHi: "स्किल इंडिया मिशन",
  },
] as const;

export const AWARDS = [
  {
    year: "2026",
    title: "PCI Approved Pharmacy Pathways",
    titleHi: "पीसीआई अनुमोदित फार्मेसी मार्ग",
    body: "Recognised pharmacy diplomas with hospital and industry postings.",
    bodyHi: "अस्पताल और उद्योग पोस्टिंग के साथ मान्यता प्राप्त फार्मेसी डिप्लोमा।",
  },
  {
    year: "2026",
    title: "NCTE-Oriented Teacher Education",
    titleHi: "एनसीटीई-उन्मुख शिक्षक शिक्षा",
    body: "D.El.Ed and BTC pathways aligned to national teacher-education norms.",
    bodyHi: "डी.एल.एड और बीटीसी मार्ग राष्ट्रीय शिक्षक-शिक्षा मानकों से संरेखित।",
  },
  {
    year: "2026",
    title: "AICTE Guideline Aligned Programmes",
    titleHi: "एआईसीटीई दिशानिर्देश संरेखित कार्यक्रम",
    body: "Professional diplomas delivered to AICTE guideline standards.",
    bodyHi: "एआईसीटीई दिशानिर्देशों पर पेशेवर डिप्लोमा।",
  },
  {
    year: "2025",
    title: "Excellence in Hospital Internships",
    titleHi: "अस्पताल इंटर्नशिप में उत्कृष्टता",
    body: "Clinical postings with Apollo, Fortis and Medanta hiring desks.",
    bodyHi: "अपोलो, फोर्टिस और मेदांता हायरिंग डेस्क के साथ क्लिनिकल पोस्टिंग।",
  },
  {
    year: "2025",
    title: "100+ Hiring Partner Network",
    titleHi: "100+ हायरिंग पार्टनर नेटवर्क",
    body: "Hospitals, schools, pharma and IT on one career-cell calendar.",
    bodyHi: "अस्पताल, विद्यालय, फार्मा और आईटी एक करियर-सेल कैलेंडर पर।",
  },
  {
    year: "2025",
    title: "Girl Child Scholarship Initiative",
    titleHi: "बालिका छात्रवृत्ति पहल",
    body: "Merit and access scholarships kept open across diploma schools.",
    bodyHi: "डिप्लोमा स्कूलों में मेरिट और एक्सेस छात्रवृत्ति खुली रखी गई।",
  },
  {
    year: "2024",
    title: "Career Cell Placement Support",
    titleHi: "करियर सेल प्लेसमेंट सहायता",
    body: "Interview labs, drives and first-role support — not only a certificate.",
    bodyHi: "इंटरव्यू लैब, ड्राइव और पहली भूमिका — केवल सर्टिफिकेट नहीं।",
  },
  {
    year: "2024",
    title: "Noida Campus Quality Education",
    titleHi: "नोएडा परिसर गुणवत्ता शिक्षा",
    body: "Sector 63A campus recognised for labs, counselling and outcomes.",
    bodyHi: "सेक्टर 63A परिसर लैब, काउंसलिंग और परिणामों के लिए जाना गया।",
  },
] as const;

export const ABOUT = {
  vision:
    "To become a trusted destination for quality education, empowering students with knowledge, skills, and opportunities for a brighter future.",
  visionHi:
    "गुणवत्तापूर्ण शिक्षा का एक विश्वसनीय गंतव्य बनना, और विद्यार्थियों को ज्ञान, कौशल तथा उज्जवल भविष्य के अवसरों से सशक्त बनाना।",
  mission:
    "To deliver career-oriented education, practical learning, student counselling, and placement support while promoting equal access to educational opportunities.",
  missionHi:
    "करियर-उन्मुख शिक्षा, व्यावहारिक शिक्षण, विद्यार्थी काउंसलिंग और प्लेसमेंट सहायता देना, तथा शैक्षणिक अवसरों तक समान पहुँच को बढ़ावा देना।",
  accreditation: [
    "Pharmacy Council of India (PCI) — statutory approval for D.Pharm and pharmacy education",
    "Board of Technical Education, UP — state affiliation for curriculum, exams and diploma conferment",
    "National Council for Teacher Education (NCTE) — standards for D.El.Ed and primary teacher education",
    "NSDC / NCVET — Skill India curriculum alignment through the Parimanam LMS Skill Foundry",
  ],
  accreditationHi: [
    "फार्मेसी काउंसिल ऑफ इंडिया (PCI) — डी.फार्म और फार्मेसी शिक्षा के लिए वैधानिक अनुमोदन",
    "प्राविधिक शिक्षा परिषद, उत्तर प्रदेश — पाठ्यक्रम, परीक्षा और डिप्लोमा के लिए राज्य संबद्धता",
    "राष्ट्रीय अध्यापक शिक्षा परिषद (NCTE) — डी.एल.एड और प्राथमिक शिक्षण के मानक",
    "NSDC / NCVET — परिमाणम एलएमएस स्किल फाउंड्री के माध्यम से स्किल इंडिया पाठ्यक्रम संरेखण",
  ],
};

export const NOTIFICATIONS = [
  { title: "Admissions Open 2027", titleHi: "प्रवेश 2027 खुले", time: "Today" },
  { title: "Girl Child Scholarship window live", titleHi: "बालिका छात्रवृत्ति विंडो लाइव", time: "2d" },
  { title: "Hospital placement drive next week", titleHi: "अगले सप्ताह अस्पताल प्लेसमेंट ड्राइव", time: "5d" },
];
