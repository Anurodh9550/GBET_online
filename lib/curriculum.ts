import type { Course } from "@/lib/courses";

export type CurriculumModule = {
  title: string;
  titleHi: string;
  minutes: number;
  lessons: { en: string; hi: string }[];
  piece: { en: string; hi: string };
};

function mod(
  title: string,
  titleHi: string,
  minutes: number,
  lessons: [string, string][],
  piece: [string, string],
): CurriculumModule {
  return {
    title,
    titleHi,
    minutes,
    lessons: lessons.map(([en, hi]) => ({ en, hi })),
    piece: { en: piece[0], hi: piece[1] },
  };
}

const OPENING = (desk: string, deskHi: string) =>
  mod(
    "Opening the batch",
    "बैच की शुरुआत",
    90,
    [
      [`How the ${desk} batch is run from Noida`, `नोएडा से ${deskHi} बैच कैसे चलता है`],
      ["Your folder, file names and live-session link", "आपका फोल्डर, फाइल नाम और लाइव सेशन लिंक"],
      ["What must be in the portfolio before the last week", "आखिरी हफ्ते से पहले पोर्टफोलियो में क्या होना चाहिए"],
    ],
    ["A one-page plan of your batch", "अपने बैच की एक-पृष्ठ योजना"],
  );

const CLOSING = mod(
  "Interview folder",
  "इंटरव्यू फोल्डर",
  150,
  [
    ["Put the sheets in the order a reviewer reads them", "शीटों को उस क्रम में रखें जिस क्रम में समीक्षक पढ़ता है"],
    ["Live critique with the Noida desk", "नोएडा डेस्क के साथ लाइव समीक्षा"],
    ["What the career cell asks before a first role", "पहली भूमिका से पहले करियर सेल क्या पूछता है"],
    ["The folder you carry out of the batch", "बैच से बाहर ले जाने वाला फोल्डर"],
  ],
  ["The finished interview folder", "तैयार इंटरव्यू फोल्डर"],
);

function topicMod(title: string, titleHi: string, minutes: number, focus: [string, string][]): CurriculumModule {
  return mod(
    title,
    titleHi,
    minutes,
    [
      focus[0],
      focus[1],
      focus[2],
      ["Save the sheet that goes into the folder", "वह शीट सहेजें जो फोल्डर में जाती है"],
    ],
    [focus[3][0], focus[3][1]],
  );
}

const PACKS: Record<string, CurriculumModule[]> = {
  "interior-design": [
    OPENING("interior", "इंटीरियर"),
    topicMod("Measured drawing", "माप के साथ ड्राइंग", 360, [
      ["Tape a real room and note the openings", "एक असली कमरे को नापें और खुले हिस्से नोट करें"],
      ["Draw plan, section and elevation to scale", "स्केल पर प्लान, सेक्शन और एलिवेशन बनाएँ"],
      ["Mark doors, windows and ceiling height", "दरवाज़े, खिड़कियाँ और छत की ऊँचाई चिह्नित करें"],
      ["A measured sheet of one room", "एक कमरे की मापी हुई शीट"],
    ]),
    topicMod("CAD for rooms", "कमरों का कैड", 480, [
      ["Set walls, doors and windows in the file", "फाइल में दीवार, दरवाज़ा और खिड़की सेट करें"],
      ["Place furniture blocks at the right size", "फर्नीचर ब्लॉक सही माप पर रखें"],
      ["Add dimensions, layers and a title block", "डाइमेंशन, लेयर और टाइटल ब्लॉक जोड़ें"],
      ["A printed room drawing", "एक कमरे की छपी ड्राइंग"],
    ]),
    topicMod("Vastu on the plan", "प्लान पर वास्तु", 300, [
      ["Read entry, plot and the path through the house", "प्रवेश, प्लॉट और घर के रास्ते को पढ़ें"],
      ["Place kitchen, water and sleep zones", "रसोई, पानी और सोने की जगह तय करें"],
      ["Mark what you would change for the client", "क्लाइंट के लिए क्या बदलेंगे, वह चिह्नित करें"],
      ["A marked vastu plan", "चिह्नित वास्तु प्लान"],
    ]),
    topicMod("Reading a style", "एक शैली पढ़ना", 300, [
      ["Study one older room and one current room", "एक पुराना और एक आज का कमरा देखें"],
      ["Collect material, colour and light notes", "सामग्री, रंग और रोशनी के नोट जमा करें"],
      ["Explain the style in one client sentence", "शैली को क्लाइंट के लिए एक वाक्य में कहें"],
      ["A style board", "एक स्टाइल बोर्ड"],
    ]),
    topicMod("Planning the room", "कमरे की योजना", 480, [
      ["List who uses the room and when", "लिखें कि कमरा कौन, कब इस्तेमाल करता है"],
      ["Draw circulation so doors still open", "चलने का रास्ता ऐसा बनाएँ कि दरवाज़े खुलें"],
      ["Test two furniture layouts", "फर्नीचर के दो लेआउट जाँचें"],
      ["A space plan with storage", "स्टोरेज के साथ स्पेस प्लान"],
    ]),
    topicMod("Light, finish and furniture", "रोशनी, फिनिश और फर्नीचर", 360, [
      ["Note daylight and where lamps are needed", "दिन की रोशनी और लैम्प की जगह नोट करें"],
      ["Choose floor, wall and a few furniture pieces", "फर्श, दीवार और कुछ फर्नीचर चुनें"],
      ["Write a finish schedule the site can follow", "साइट के लिए फिनिश सूची लिखें"],
      ["A finish and furniture sheet", "फिनिश और फर्नीचर शीट"],
    ]),
    CLOSING,
  ],
  "fashion-design": [
    OPENING("fashion", "फैशन"),
    topicMod("Cloth, body and measure", "कपड़ा, शरीर और नाप", 360, [
      ["Read a body measurement chart", "शरीर की नाप तालिका पढ़ें"],
      ["Handle cotton, knit and a lined cloth", "कॉटन, निट और लाइनिंग वाला कपड़ा देखें"],
      ["Mark ease so the garment can move", "आसानी की जगह चिह्नित करें ताकि कपड़ा हिले"],
      ["A measurement and cloth note", "नाप और कपड़े का नोट"],
    ]),
    topicMod("Pattern blocks", "पैटर्न ब्लॉक", 480, [
      ["Draft a simple bodice block", "एक सरल बॉडिस ब्लॉक बनाएँ"],
      ["Add a sleeve and a straight skirt", "आस्तीन और सीधी स्कर्ट जोड़ें"],
      ["Alter the block for one body note", "एक शरीर नोट के लिए ब्लॉक बदलें"],
      ["A paper pattern set", "कागज़ के पैटर्न का सेट"],
    ]),
    topicMod("Stitch samples", "सिलाई के नमूने", 420, [
      ["Sew a seam, a hem and a zip", "सीम, हेम और ज़िप सिलें"],
      ["Finish an edge so it does not fray", "किनारा ऐसा पूरा करें कि उधड़े नहीं"],
      ["Compare your sample with the spec", "नमूने की तुलना स्पेक से करें"],
      ["A labelled stitch file", "लेबल वाली सिलाई फाइल"],
    ]),
    topicMod("Flats and the look board", "फ्लैट्स और लुक बोर्ड", 360, [
      ["Draw flats of the garments you will make", "जो कपड़े बनाएंगे उनके फ्लैट बनाएँ"],
      ["Build a colour and cloth board", "रंग और कपड़े का बोर्ड बनाएँ"],
      ["Write the story of one look", "एक लुक की कहानी लिखें"],
      ["A look board", "एक लुक बोर्ड"],
    ]),
    topicMod("Range and the buyer desk", "रेंज और बायर डेस्क", 300, [
      ["Cost one garment in cloth and time", "एक कपड़े की कीमत कपड़े और समय में निकालें"],
      ["Line up a small range for one buyer", "एक बायर के लिए छोटी रेंज लगाएँ"],
      ["Note what you would change after feedback", "फीडबैक के बाद क्या बदलेंगे, लिखें"],
      ["A range sheet", "एक रेंज शीट"],
    ]),
    topicMod("The lookbook", "लुकबुक", 360, [
      ["Photograph or draw the finished looks", "तैयार लुक की तस्वीर या ड्राइंग करें"],
      ["Write captions a stylist can use", "ऐसे कैप्शन लिखें जो स्टाइलिस्ट इस्तेमाल कर सके"],
      ["Order the pages for a short meeting", "छोटी मीटिंग के लिए पन्ने क्रम में रखें"],
      ["A short lookbook", "एक छोटी लुकबुक"],
    ]),
    CLOSING,
  ],
};

function fromCourse(course: Course): CurriculumModule[] {
  const topics = course.learn.map((en, index) =>
    topicMod(en, course.learnHi[index] ?? en, 240 + index * 30, [
      [`Where ${en} sits in this batch`, `इस बैच में ${course.learnHi[index] ?? en} कहाँ आता है`],
      [`Start a working file for ${en}`, `${course.learnHi[index] ?? en} की काम वाली फाइल शुरू करें`],
      [`Bring the ${en} work to a live review`, `${course.learnHi[index] ?? en} का काम लाइव समीक्षा में लाएँ`],
      [`The ${en} sheet for your folder`, `फोल्डर के लिए ${course.learnHi[index] ?? en} शीट`],
    ]),
  );
  return [OPENING(course.shortName.toLowerCase(), course.shortName), ...topics, CLOSING];
}

export function getCurriculum(course: Course) {
  return PACKS[course.slug] ?? fromCourse(course);
}

export function formatClock(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${String(mins).padStart(2, "0")}m`;
}

export function curriculumTotals(modules: CurriculumModule[]) {
  return {
    modules: modules.length,
    pieces: modules.length,
    lectures: modules.reduce((sum, item) => sum + item.lessons.length, 0),
    minutes: modules.reduce((sum, item) => sum + item.minutes, 0),
  };
}
