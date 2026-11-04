import { CATEGORIES, ONLINE_COURSES, courseKind, type Course, type CourseCategory } from "@/lib/courses";
import { SITE } from "@/lib/site";

export type ProgrammeType = "Diploma" | "Certificate";

export type CurriculumModule = {
  number: number;
  title: string;
  topics: string[];
  outcome: string;
};

export type LearningFeature = {
  id: "recorded" | "live" | "assignments" | "material" | "projects" | "assessments";
  title: string;
  description: string;
};

export type CareerOpportunity = {
  role: string;
  focus: string;
};

export type FacultyProfile = {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  placeholder: boolean;
};

export type CourseFaq = {
  question: string;
  answer: string;
};

export type CatalogCourse = {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  category: CourseCategory;
  categoryLabel: string;
  programmeType: ProgrammeType;
  duration: string;
  eligibility: string;
  mode: string;
  summary: string;
  description: string;
  thumbnail: string;
  banner: string;
  learningOutcomes: string[];
  curriculum: CurriculumModule[];
  learningFeatures: LearningFeature[];
  careerOpportunities: CareerOpportunity[];
  faculty: FacultyProfile[];
  faqs: CourseFaq[];
};

type ModuleSpec = [title: string, topics: string[], outcome: string];

type CourseSpec = {
  summary: string;
  description: string;
  outcomes: string[];
  modules: ModuleSpec[];
  careers: [role: string, focus: string][];
};

export const LEARNING_FEATURES: LearningFeature[] = [
  {
    id: "recorded",
    title: "Recorded video lectures",
    description: "Watch lessons at your own pace and revisit them whenever you need to.",
  },
  {
    id: "live",
    title: "Live interactive sessions",
    description: "Scheduled sessions with faculty for questions, demonstrations and reviews.",
  },
  {
    id: "assignments",
    title: "Practical assignments",
    description: "Hands-on tasks after each module so you practise what you learn.",
  },
  {
    id: "material",
    title: "Study material",
    description: "Notes, reading lists and reference sheets for every module.",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Module projects that build towards a final piece of work you can show.",
  },
  {
    id: "assessments",
    title: "Assessments",
    description: "Quizzes and reviewed submissions to track your progress through the course.",
  },
];

const SPECS: Record<string, CourseSpec> = {
  "interior-design": {
    summary: "Plan, draw and present residential and commercial interiors, from measured drawings to a finished design folder.",
    description:
      "This diploma takes you through the interior design process: measuring a space, drafting plans in AutoCAD, applying vastu principles, choosing a style and specifying materials and lighting. Each module ends in a sheet for your design folder, reviewed with faculty in live sessions.",
    outcomes: [
      "Draw measured plans, sections and elevations to scale",
      "Produce room layouts and drawings in AutoCAD",
      "Apply space-planning and vastu principles to a client brief",
      "Present a material, lighting and furniture scheme",
    ],
    modules: [
      ["Foundations of Interior Design", ["Elements and principles of design", "Reading a client brief", "Measuring a room and recording site notes"], "Explain a design brief and record accurate site measurements."],
      ["Technical Drawing and AutoCAD", ["Plans, sections and elevations", "AutoCAD setup, layers and dimensions", "Furniture blocks and title sheets"], "Prepare scaled drawings of a room in AutoCAD."],
      ["Space Planning and Vastu", ["Circulation and zoning", "Furniture layouts for homes and offices", "Vastu principles on a floor plan"], "Develop a functional layout that responds to the brief."],
      ["Design Styles, Materials and Lighting", ["Period and contemporary styles", "Finishes, colour and textiles", "Natural and artificial lighting plans"], "Build a style board and a finish schedule for a space."],
      ["Design Project and Portfolio", ["Concept to final presentation", "Client presentation practice", "Portfolio review with faculty"], "Present a complete interior project in a portfolio."],
    ],
    careers: [
      ["Interior Designer", "Plans and details residential and commercial spaces."],
      ["Corporate Designer", "Works on office and workplace interiors."],
      ["Design Manager", "Coordinates drawings, vendors and site timelines."],
      ["Visual Merchandiser", "Designs retail displays and store layouts."],
    ],
  },
  "fashion-design": {
    summary: "Learn pattern making, garment construction and fashion CAD, and build a portfolio of your own looks.",
    description:
      "From body measurements and pattern blocks to CAD and Clo3D, merchandising and consumer behaviour, this diploma covers how a garment moves from idea to range. Practical assignments end in flats, look boards and a short lookbook for your portfolio.",
    outcomes: [
      "Take measurements and draft basic pattern blocks",
      "Construct garment samples with clean finishes",
      "Create flats and 3D garment visuals using CAD and Clo3D",
      "Plan a small range with costing and merchandising notes",
    ],
    modules: [
      ["Fashion Fundamentals", ["Fashion history and design elements", "Fabrics, fibres and how they behave", "Body measurements and sizing"], "Choose suitable fabrics and record accurate measurements."],
      ["Pattern Making and Construction", ["Bodice, sleeve and skirt blocks", "Seams, hems and closures", "Fitting and pattern alterations"], "Draft patterns and sew finished garment samples."],
      ["Fashion Illustration and CAD", ["Fashion figures and flats", "Digital design tools", "3D garment simulation with Clo3D"], "Present designs as flats and digital visuals."],
      ["Merchandising and Consumer Behaviour", ["Trend research and forecasting", "Range planning and costing", "How customers choose and buy"], "Plan a small range for a defined customer."],
      ["Collection and Portfolio", ["Concept and mood boards", "Lookbook layout and captions", "Portfolio review with faculty"], "Present a mini collection in a professional portfolio."],
    ],
    careers: [
      ["Fashion Blogger", "Creates fashion content for digital audiences."],
      ["Fashion Stylist", "Puts together looks for shoots, clients and brands."],
      ["Fashion Designer", "Designs garments and small collections."],
      ["Textile Designer", "Develops prints, weaves and surface designs."],
    ],
  },
  "jewelry-design": {
    summary: "Design jewellery from first sketch to client presentation, with metal, gemstone and CAD basics.",
    description:
      "This diploma introduces the jewellery design process: drawing techniques, metals and their properties, gemstone basics and setting styles, and preparing designs for production. You finish with a portfolio of pieces and a client presentation.",
    outcomes: [
      "Sketch and render jewellery designs with correct proportions",
      "Explain common metals, alloys and gemstone properties",
      "Choose setting styles suited to a design",
      "Present a jewellery collection to a client",
    ],
    modules: [
      ["Jewellery Design Basics", ["Jewellery history and types", "Design elements and proportion", "Sketching and rendering techniques"], "Sketch jewellery pieces with clear technical detail."],
      ["Metals and Metal Craft", ["Gold, silver and alloys", "Purity, hallmarking and finishes", "Basic fabrication processes"], "Match metals and finishes to a design."],
      ["Gemstones and Setting", ["Gemstone identification basics", "Cut, colour and quality factors", "Prong, bezel and pavé settings"], "Select stones and settings for a design."],
      ["Design Drawing and CAD Introduction", ["Technical drawings for production", "Introduction to jewellery CAD", "Preparing a design specification"], "Prepare a production-ready design sheet."],
      ["Collection and Client Presentation", ["Theme and collection planning", "Costing a piece", "Client presentation practice"], "Present a themed collection with costing notes."],
    ],
    careers: [
      ["Jewelry Designer", "Creates designs for brands, studios or private clients."],
      ["CAD Jeweller", "Turns sketches into digital models for production."],
      ["Studio Assistant", "Supports designers with drawings, samples and records."],
      ["Retail Designer", "Advises customers and adapts designs in a retail setting."],
    ],
  },
  makeup: {
    summary: "Hands-on training in bridal, fashion and editorial makeup, with SFX basics and portfolio shoots.",
    description:
      "This certificate covers skin preparation, colour theory and product knowledge before moving into bridal, fashion and special-effects looks. Practical assignments and portfolio shoots help you document your work.",
    outcomes: [
      "Prepare skin and choose products for different skin types",
      "Apply day, evening and bridal looks",
      "Create fashion and editorial looks for camera",
      "Build a portfolio of your makeup work",
    ],
    modules: [
      ["Skin, Tools and Hygiene", ["Skin types and preparation", "Brushes, tools and sanitation", "Product knowledge"], "Prepare a client's skin safely and hygienically."],
      ["Colour Theory and Base", ["Colour correction", "Foundation matching", "Contouring and highlighting"], "Create an even, camera-ready base."],
      ["Bridal Makeup", ["Indian bridal looks", "Long-wear techniques", "Client consultation"], "Plan and apply a complete bridal look."],
      ["Fashion, Editorial and SFX Basics", ["Fashion and runway looks", "Makeup for photography", "Introduction to special effects"], "Adapt makeup for camera and creative briefs."],
      ["Portfolio Shoots", ["Planning a shoot", "Working with photographers", "Selecting portfolio images"], "Assemble a portfolio from your own shoots."],
    ],
    careers: [
      ["Makeup Artist", "Works with individual clients, events and productions."],
      ["Bridal Stylist", "Specialises in bridal and occasion makeup."],
      ["Fashion MUA", "Works on fashion shoots and shows."],
      ["Salon Lead", "Manages makeup services in a salon."],
    ],
  },
  "culinary-arts": {
    summary: "Build kitchen fundamentals in world cuisine, food science, menu planning and cost control.",
    description:
      "This diploma covers knife skills, cooking methods, food science and kitchen hygiene, then moves to world cuisines, bakery basics, menu planning and food costing. Recorded demonstrations are followed by practical assignments you cook and document.",
    outcomes: [
      "Apply core cooking methods and kitchen safety practices",
      "Explain the food science behind common techniques",
      "Plan balanced menus for different service styles",
      "Calculate food cost and control portions",
    ],
    modules: [
      ["Kitchen Foundations", ["Knife skills and kitchen tools", "Food safety and hygiene", "Kitchen organisation"], "Work safely and efficiently in a kitchen."],
      ["Cooking Methods and Food Science", ["Dry and moist heat methods", "Stocks, sauces and soups", "How heat changes food"], "Choose the right method for each ingredient."],
      ["World Cuisine", ["Indian regional cooking", "Continental and Asian basics", "Plating and presentation"], "Cook and present dishes from different cuisines."],
      ["Bakery and Pastry Basics", ["Breads and doughs", "Cakes and cookies", "Desserts and plating"], "Produce basic bakery and dessert items."],
      ["Menu Planning and Cost Control", ["Menu design and balance", "Recipe costing", "Purchasing and stock control"], "Plan and cost a menu for service."],
    ],
    careers: [
      ["Sous Chef", "Supports the head chef in running the kitchen."],
      ["Pastry Chef", "Specialises in bakery and desserts."],
      ["Food Stylist", "Prepares food for photography and video."],
      ["Executive Chef", "Leads kitchen operations, usually after several years of experience."],
    ],
  },
  filmmaking: {
    summary: "Learn to plan, shoot and edit short films, finishing with a short film of your own.",
    description:
      "This diploma follows the filmmaking process from idea and script to shot planning, camera work, sound and editing. Each stage builds towards a short film that you plan, shoot and cut during the course.",
    outcomes: [
      "Break a script into a shot list and schedule",
      "Operate camera, lighting and sound for a scene",
      "Edit footage into a coherent sequence",
      "Complete and present a short film",
    ],
    modules: [
      ["Film Language", ["Shots, angles and movement", "Visual storytelling", "Studying scenes from films"], "Analyse how a scene is built from shots."],
      ["Pre-production", ["Script breakdown", "Shot lists and storyboards", "Scheduling and budgeting a shoot"], "Prepare a shoot plan for a short film."],
      ["Camera, Light and Sound", ["Camera settings and lenses", "Three-point lighting", "Recording clean sound"], "Capture well-exposed footage with usable sound."],
      ["Editing and Post-production", ["Editing workflow", "Pacing and continuity", "Colour and sound finishing"], "Edit a scene with clear structure and pacing."],
      ["Short Film Project", ["Producing your short film", "Rough-cut review", "Final cut and screening"], "Deliver a finished short film."],
    ],
    careers: [
      ["Assistant Director", "Coordinates schedules, cast and crew on set."],
      ["Video Editor", "Cuts footage for films, ads and online content."],
      ["Camera Assistant", "Supports the camera team with equipment and focus."],
      ["Content Filmmaker", "Produces short videos for brands and creators."],
    ],
  },
  screenwriting: {
    summary: "Write for film, web series and advertising, from story structure to a pitch-ready script.",
    description:
      "This certificate covers story structure, character, scene writing and dialogue, then moves to OTT series formats and pitching. You write and revise your own script with feedback in live sessions.",
    outcomes: [
      "Structure a story using acts and turning points",
      "Write scenes with purposeful dialogue",
      "Adapt ideas for film, series and short formats",
      "Prepare a pitch deck for your project",
    ],
    modules: [
      ["Story and Structure", ["Premise and logline", "Three-act structure", "Story beats"], "Outline a story with a clear structure."],
      ["Character and Dialogue", ["Character goals and arcs", "Writing dialogue", "Subtext"], "Write scenes driven by character."],
      ["Screenplay Format", ["Industry formatting", "Scene headings and action lines", "Screenwriting software"], "Format a script to industry standard."],
      ["Writing for OTT and Ads", ["Series bible and episodes", "Short-form and ad scripts", "Writing to a brief"], "Develop an episode or short-form script."],
      ["Rewriting and Pitching", ["Feedback and rewrites", "Pitch decks", "Presenting your project"], "Present a revised script with a pitch deck."],
    ],
    careers: [
      ["Screenwriter", "Writes scripts for film, series and digital formats."],
      ["Content Writer", "Writes scripts and copy for brands and media."],
      ["Script Editor", "Reviews and improves scripts during development."],
      ["Showrunner Assistant", "Supports a writers' room with notes and research."],
    ],
  },
  podcasting: {
    summary: "Plan, record, edit and publish a podcast, and learn how shows grow an audience.",
    description:
      "This short diploma covers show formats, research and scripting, voice and interviewing, recording and editing, and publishing on major platforms. You produce episodes of your own show during the course.",
    outcomes: [
      "Plan a show format and episode outline",
      "Record clear audio at home or in a studio",
      "Edit and mix an episode",
      "Publish and promote a podcast",
    ],
    modules: [
      ["Show Formats and Planning", ["Podcast formats", "Finding your audience", "Episode planning"], "Plan a show and its first episodes."],
      ["Voice, Script and Interviews", ["Writing for the ear", "Voice and delivery", "Interview techniques"], "Script and host a segment."],
      ["Recording", ["Microphones and rooms", "Remote recording", "Recording workflow"], "Record clean, usable audio."],
      ["Editing and Sound", ["Editing software basics", "Noise reduction and levels", "Music and transitions"], "Edit and mix a finished episode."],
      ["Publishing and Audience Growth", ["Hosting and distribution", "Show notes and artwork", "Promotion on social media"], "Publish an episode with a promotion plan."],
    ],
    careers: [
      ["Podcast Host", "Presents and leads conversations on a show."],
      ["Audio Producer", "Plans, records and edits audio content."],
      ["Content Editor", "Edits episodes, clips and show notes."],
      ["Show Researcher", "Finds guests, topics and background information."],
    ],
  },
  "music-production": {
    summary: "Produce music in a DAW, from arrangement and sound design to mixing and release planning.",
    description:
      "This diploma covers music theory for producers, DAW workflow, arrangement, sound design, recording and mixing basics. You complete original tracks and a plan to release them.",
    outcomes: [
      "Work efficiently in a digital audio workstation",
      "Arrange a track with a clear structure",
      "Mix a track with balanced levels and effects",
      "Plan the release of your music",
    ],
    modules: [
      ["Music Theory for Producers", ["Scales, chords and progressions", "Rhythm and tempo", "Song structure"], "Apply theory when writing music."],
      ["DAW Workflow", ["Session setup", "MIDI and audio editing", "Virtual instruments"], "Build a track in a DAW."],
      ["Arrangement and Sound Design", ["Arranging sections", "Synthesis basics", "Sampling"], "Arrange a full track with original sounds."],
      ["Recording and Mixing Basics", ["Recording vocals and instruments", "EQ, compression and effects", "Balancing a mix"], "Deliver a balanced mix."],
      ["Release Planning", ["Mastering basics", "Distribution platforms", "Promoting a release"], "Prepare a track and a plan for release."],
    ],
    careers: [
      ["Music Producer", "Creates and produces tracks for artists and media."],
      ["Studio Assistant", "Supports sessions, setup and file management in a studio."],
      ["Jingle Composer", "Writes short music for ads and brands."],
      ["Content Musician", "Makes music for videos, games and online creators."],
    ],
  },
  "animation-vfx": {
    summary: "Learn 3D modelling, lighting, animation and compositing, and finish a shot for your reel.",
    description:
      "This diploma introduces the 3D pipeline: modelling, texturing, lighting, animation principles and compositing for visual effects. Projects build towards a finished shot you can include in a showreel.",
    outcomes: [
      "Model and texture 3D assets",
      "Light and render a scene",
      "Animate using core animation principles",
      "Composite CG elements into live footage",
    ],
    modules: [
      ["3D Foundations", ["3D software interface", "Modelling basics", "Topology"], "Model simple 3D assets."],
      ["Texturing and Lighting", ["UV mapping", "Materials and textures", "Lighting and rendering"], "Texture, light and render a scene."],
      ["Animation Principles", ["The principles of animation", "Keyframes and timing", "Character movement basics"], "Animate a short sequence."],
      ["VFX and Compositing", ["Green screen and keying", "Camera tracking", "Compositing CG into footage"], "Composite a visual effects shot."],
      ["Showreel Project", ["Shot planning", "Production and review", "Reel editing"], "Complete a finished shot for your reel."],
    ],
    careers: [
      ["3D Artist", "Models, textures and lights 3D assets."],
      ["VFX Assistant", "Supports compositing and effects work on shots."],
      ["Motion Designer", "Creates animated graphics for brands and media."],
      ["Studio Generalist", "Works across modelling, lighting and rendering tasks."],
    ],
  },
  photography: {
    summary: "Master camera craft, lighting and editing, and shoot portrait, product and fashion assignments.",
    description:
      "This diploma covers exposure and composition, natural and studio lighting, photo editing and genre work including portrait, product and fashion photography. Assignments build a portfolio of your own images.",
    outcomes: [
      "Control exposure and focus in manual mode",
      "Light subjects with natural and studio light",
      "Edit and retouch images to a professional finish",
      "Plan and deliver a commercial shoot",
    ],
    modules: [
      ["Camera Craft", ["The exposure triangle", "Lenses and focus", "Composition"], "Shoot well-exposed, well-composed images."],
      ["Lighting", ["Natural light", "Studio lighting setups", "Flash and modifiers"], "Light a subject for mood and clarity."],
      ["Photo Editing", ["Raw processing", "Colour correction", "Retouching"], "Edit images to a professional finish."],
      ["Genres and Commercial Shoots", ["Portrait photography", "Product photography", "Fashion shoots"], "Deliver images for a commercial brief."],
      ["Portfolio and Practice", ["Selecting your best work", "Presenting a portfolio", "Working with clients"], "Present a curated photography portfolio."],
    ],
    careers: [
      ["Photographer", "Shoots portraits, events, products or editorial work."],
      ["Photo Editor", "Selects, edits and retouches images."],
      ["Fashion Photographer", "Shoots fashion campaigns and lookbooks."],
      ["Content Creator", "Produces visual content for brands and social media."],
    ],
  },
  naturopathy: {
    summary: "Study natural healing approaches including nutrition, hydrotherapy and lifestyle guidance.",
    description:
      "This diploma introduces the principles of naturopathy, human anatomy from a naturopathic perspective, natural nutrition and therapies such as hydrotherapy and magnetotherapy. It focuses on wellness guidance and does not replace medical treatment.",
    outcomes: [
      "Explain the principles and philosophy of naturopathy",
      "Describe basic human anatomy and physiology",
      "Plan natural nutrition guidance for wellness",
      "Describe how hydrotherapy and magnetotherapy are applied safely",
    ],
    modules: [
      ["Principles of Naturopathy", ["History and philosophy", "The five elements approach", "Scope and limits of practice"], "Explain naturopathic principles and their limits."],
      ["Naturopathic Anatomy", ["Body systems", "Physiology basics", "Health and disease"], "Describe how the major body systems work."],
      ["Natural Nutrition", ["Whole foods and diet", "Fasting guidance", "Diet for common lifestyle conditions"], "Prepare a natural nutrition plan for wellness."],
      ["Hydrotherapy and Magnetotherapy", ["Water therapies", "Magnetotherapy basics", "Safety and contraindications"], "Describe the safe use of these therapies."],
      ["Wellness Practice", ["Client consultation", "Lifestyle guidance", "Case documentation"], "Document a wellness consultation."],
    ],
    careers: [
      ["Naturopathy Consultant", "Guides clients on natural wellness practices."],
      ["Wellness Manager", "Coordinates programmes at wellness centres."],
      ["Nutrition Advisor", "Advises clients on everyday healthy eating."],
      ["Corporate Wellness Coach", "Runs wellness sessions for workplaces."],
    ],
  },
  "applied-nutrition": {
    summary: "Learn food groups, diet planning and client counselling for everyday nutrition guidance.",
    description:
      "This diploma covers nutrients and food groups, nutrition across life stages, diet planning and client counselling. Practical assignments include planning diets and documenting client cases.",
    outcomes: [
      "Explain macronutrients, micronutrients and food groups",
      "Plan diets for different ages and needs",
      "Counsel clients on healthy eating habits",
      "Maintain clear client records",
    ],
    modules: [
      ["Fundamentals of Nutrition", ["Macronutrients and micronutrients", "Food groups", "Digestion and absorption"], "Explain the role of nutrients in the body."],
      ["Nutrition Across Life Stages", ["Infants and children", "Adults and pregnancy", "Older adults"], "Adapt nutrition advice to each life stage."],
      ["Diet Planning", ["Calculating requirements", "Meal planning", "Diets for weight management"], "Plan balanced diets for clients."],
      ["Client Counselling", ["Assessment and food history", "Behaviour change", "Communication skills"], "Conduct a nutrition counselling session."],
      ["Kitchen Practice and Case Work", ["Healthy cooking methods", "Recipe modification", "Case documentation"], "Present a documented client case."],
    ],
    careers: [
      ["Nutrition Advisor", "Advises clients on balanced, everyday diets."],
      ["Wellness Coach", "Supports clients with healthy habits and routines."],
      ["Diet Assistant", "Assists nutrition professionals with plans and records."],
      ["Health Content Associate", "Writes nutrition and wellness content."],
    ],
  },
  "ayurvedic-nutrition": {
    summary: "Understand ayurvedic principles of food, daily routine and seasonal living for lifestyle guidance.",
    description:
      "This diploma introduces ayurvedic concepts of dosha, digestion and daily routine, and how food choices change with the seasons. It focuses on lifestyle counselling and does not replace medical treatment.",
    outcomes: [
      "Explain dosha and prakriti concepts",
      "Recommend daily and seasonal routines",
      "Plan food guidance based on ayurvedic principles",
      "Document lifestyle counselling sessions",
    ],
    modules: [
      ["Ayurveda Foundations", ["Panchamahabhuta and dosha", "Prakriti assessment basics", "Agni and digestion"], "Explain the core ayurvedic concepts."],
      ["Daily Routine", ["Dinacharya", "Sleep and activity", "Habits and wellbeing"], "Suggest a balanced daily routine."],
      ["Food and Season", ["Ritucharya", "Tastes and food qualities", "Seasonal meal planning"], "Plan meals suited to the season."],
      ["Lifestyle Counselling", ["Consultation approach", "Common lifestyle concerns", "Scope and referral"], "Conduct a lifestyle counselling session."],
      ["Client Notes and Case Work", ["Recording client notes", "Follow-up planning", "Case presentation"], "Present a documented lifestyle case."],
    ],
    careers: [
      ["Wellness Advisor", "Guides clients on routine, food and lifestyle."],
      ["Lifestyle Counsellor", "Supports clients in building healthier habits."],
      ["Clinic Assistant", "Supports consultations, records and client follow-up."],
      ["Health Educator", "Runs awareness sessions on healthy living."],
    ],
  },
  psychology: {
    summary: "Learn the foundations of psychology, counselling skills and ethical practice.",
    description:
      "This diploma covers the foundations of psychology, human development, assessment basics and counselling skills, with a strong focus on ethics. It prepares you for supporting roles in schools, workplaces and wellness settings; it is not a clinical licence.",
    outcomes: [
      "Explain key theories of human behaviour",
      "Describe human development across life stages",
      "Use basic counselling and listening skills",
      "Apply ethical principles in helping roles",
    ],
    modules: [
      ["Foundations of Psychology", ["Schools of psychology", "Perception, memory and learning", "Emotion and motivation"], "Explain key psychological processes."],
      ["Developmental Psychology", ["Childhood and adolescence", "Adulthood and ageing", "Family and social influences"], "Describe development across the lifespan."],
      ["Assessment Basics", ["Observation and interviews", "Introduction to psychological tests", "Writing simple reports"], "Explain how basic assessments are used."],
      ["Counselling Skills", ["Active listening", "Rapport and empathy", "Supporting people in school and work settings"], "Use core counselling skills in role play."],
      ["Ethics and Practice", ["Confidentiality and consent", "Scope and referral", "Self-care for practitioners"], "Apply ethical guidelines to case scenarios."],
    ],
    careers: [
      ["Counsellor Assistant", "Supports qualified counsellors with sessions and records."],
      ["HR Associate", "Works on employee engagement and wellbeing."],
      ["School Counsellor", "Supports student wellbeing; further qualifications may be required."],
      ["Wellness Coach", "Helps clients build healthy habits and routines."],
    ],
  },
  "travel-tourism": {
    summary: "Learn itinerary design, ticketing, destination knowledge and guest handling for the travel industry.",
    description:
      "This diploma covers the structure of the tourism industry, Indian and international destinations, itinerary planning, ticketing and reservation basics, and customer service for travellers.",
    outcomes: [
      "Explain how the travel and tourism industry works",
      "Design itineraries for different traveller types",
      "Describe ticketing and reservation processes",
      "Handle traveller queries and complaints professionally",
    ],
    modules: [
      ["Tourism Industry Overview", ["Types of tourism", "Travel agencies and tour operators", "Tourism in India"], "Describe the structure of the travel industry."],
      ["Destination Knowledge", ["Indian destinations", "International destinations", "Preparing a destination briefing"], "Prepare a destination briefing."],
      ["Itinerary Design", ["Planning routes and stays", "Costing a package", "Customising for clients"], "Design and cost a travel itinerary."],
      ["Ticketing and Reservations", ["Airline ticketing basics", "Hotel and rail bookings", "Travel documentation"], "Explain the booking and documentation process."],
      ["Guest Handling", ["Customer service", "Handling complaints", "Communication on tour"], "Manage traveller interactions professionally."],
    ],
    careers: [
      ["Tour Executive", "Plans and coordinates tours for travellers."],
      ["Travel Consultant", "Advises clients and books travel packages."],
      ["Guest Relations", "Looks after travellers during their trip."],
      ["Destination Coordinator", "Manages arrangements at a destination."],
    ],
  },
  "event-management": {
    summary: "Plan and run events, from budgets and vendors to guest flow and the run of show.",
    description:
      "This diploma covers event concepts, planning and budgeting, vendor coordination, guest management and on-the-day operations. You work through an event brief from proposal to run of show.",
    outcomes: [
      "Plan an event from brief to proposal",
      "Prepare and track an event budget",
      "Coordinate vendors and venues",
      "Create a run of show and manage guest flow",
    ],
    modules: [
      ["Event Fundamentals", ["Types of events", "The event planning cycle", "Understanding a client brief"], "Translate a brief into an event concept."],
      ["Planning and Budgeting", ["Timelines and checklists", "Budget sheets", "Risk planning"], "Prepare a plan and budget for an event."],
      ["Vendors and Venues", ["Choosing a venue", "Vendor negotiation", "Contracts and coordination"], "Coordinate vendors for an event."],
      ["Guest Experience", ["Invitations and RSVPs", "Guest flow and seating", "Hospitality on the day"], "Plan guest flow for an event."],
      ["Run of Show and Event Brief", ["Run-of-show documents", "On-the-day coordination", "Post-event review"], "Deliver a complete event plan for a brief."],
    ],
    careers: [
      ["Event Executive", "Plans and runs corporate and social events."],
      ["Wedding Coordinator", "Manages wedding plans, vendors and timelines."],
      ["Venue Assistant", "Supports event operations at a venue."],
      ["Brand Event Associate", "Helps deliver brand activations and launches."],
    ],
  },
  "hotel-management": {
    summary: "Learn front office, housekeeping, food service and guest-recovery skills for hotel operations.",
    description:
      "This diploma covers the main departments of a hotel: front office, housekeeping and food and beverage service, along with guest relations and service recovery.",
    outcomes: [
      "Handle front-office check-in, check-out and reservations",
      "Describe housekeeping standards and procedures",
      "Serve food and beverages following service standards",
      "Resolve guest complaints professionally",
    ],
    modules: [
      ["Introduction to Hospitality", ["The hotel industry", "Hotel departments", "Grooming and etiquette"], "Describe how a hotel is organised."],
      ["Front Office Operations", ["Reservations", "Check-in and check-out", "Front-office systems"], "Manage front-desk procedures."],
      ["Housekeeping", ["Room standards", "Cleaning procedures", "Linen and inventory"], "Maintain rooms to housekeeping standards."],
      ["Food and Beverage Service", ["Types of service", "Table setup and service sequence", "Beverage basics"], "Serve guests following service standards."],
      ["Guest Relations and Recovery", ["Guest communication", "Handling complaints", "Service recovery"], "Resolve guest issues professionally."],
    ],
    careers: [
      ["Front Office Associate", "Handles reservations, check-ins and guest queries."],
      ["Guest Service Agent", "Looks after guest requests during their stay."],
      ["F&B Assistant", "Supports restaurant and banquet service."],
      ["Hotel Supervisor", "Supervises a team or shift, usually after experience."],
    ],
  },
  "hospital-management": {
    summary: "Learn hospital front office, patient flow, medical records and administrative reporting.",
    description:
      "This diploma covers how hospitals are organised, front-office and admission processes, patient flow, medical records and basic healthcare administration and reporting.",
    outcomes: [
      "Describe how hospital departments work together",
      "Manage front-office and admission procedures",
      "Maintain accurate, confidential patient records",
      "Prepare simple administrative reports",
    ],
    modules: [
      ["Healthcare System Basics", ["Types of hospitals", "Hospital departments", "Healthcare terminology"], "Describe how a hospital is organised."],
      ["Front Office and Admissions", ["Registration and appointments", "Admission and discharge", "Billing basics"], "Manage front-office procedures."],
      ["Patient Flow", ["OPD and IPD flow", "Coordination between departments", "Patient communication"], "Map patient flow through a hospital."],
      ["Medical Records", ["Record keeping", "Confidentiality", "Hospital information systems"], "Maintain accurate and confidential records."],
      ["Administration and Reporting", ["Daily reports", "Quality and safety basics", "Inventory and supplies"], "Prepare administrative reports for a unit."],
    ],
    careers: [
      ["Hospital Coordinator", "Coordinates between departments and patients."],
      ["Front Office Executive", "Manages registrations, appointments and billing desks."],
      ["Ward Assistant", "Supports ward administration and records."],
      ["Healthcare Admin", "Handles reports, records and administrative tasks."],
    ],
  },
  "real-estate-management": {
    summary: "Learn property basics, client meetings, documentation and sales follow-up for real estate.",
    description:
      "This diploma covers the real estate market, property types, site visits, client meetings, documentation and sales follow-up using CRM tools.",
    outcomes: [
      "Explain property types and market basics",
      "Conduct site briefings and client meetings",
      "Describe common property documentation",
      "Manage leads and follow-ups in a CRM",
    ],
    modules: [
      ["Real Estate Fundamentals", ["Property types", "Market basics", "Key industry terms"], "Explain the basics of the real estate market."],
      ["Site Briefing", ["Reading project details", "Site visits", "Presenting a property"], "Brief a client on a property."],
      ["Client Meetings and Sales", ["Understanding client needs", "Negotiation basics", "Closing conversations"], "Conduct a structured client meeting."],
      ["Documentation", ["Agreements and approvals overview", "Home loan basics", "Registration process"], "Explain the documents in a property transaction."],
      ["CRM and Follow-up", ["Lead management", "Follow-up schedules", "Reporting"], "Maintain a lead pipeline in a CRM."],
    ],
    careers: [
      ["Property Advisor", "Helps clients find and evaluate properties."],
      ["Site Executive", "Manages site visits and on-site client queries."],
      ["Channel Sales", "Works with brokers and partners to sell projects."],
      ["CRM Associate", "Manages leads, follow-ups and customer records."],
    ],
  },
  "digital-marketing": {
    summary: "Learn SEO, paid ads, social media, content strategy and analytics through practical projects.",
    description:
      "This certificate covers how digital marketing works across search, social and content, and how to measure results with analytics. Assignments include planning and reporting on campaigns.",
    outcomes: [
      "Optimise web pages for search engines",
      "Plan paid search and social campaigns",
      "Create a content and social media plan",
      "Measure campaign results with analytics",
    ],
    modules: [
      ["Digital Marketing Foundations", ["The marketing funnel", "Channels overview", "Customer personas"], "Map a marketing funnel for a brand."],
      ["SEO and SEM", ["Keyword research", "On-page and technical SEO", "Search ads basics"], "Optimise a page and plan a search campaign."],
      ["Social Media Marketing", ["Platform strategies", "Content calendars", "Paid social ads"], "Plan a social media campaign."],
      ["Content Strategy", ["Content types", "Copywriting basics", "Email marketing"], "Create a content plan for a brand."],
      ["Analytics and Reporting", ["Web analytics", "Campaign metrics", "Reporting results"], "Report on campaign performance."],
    ],
    careers: [
      ["Digital Marketer", "Plans and runs online marketing campaigns."],
      ["Social Media Manager", "Manages brand presence across social platforms."],
      ["SEO Executive", "Improves website visibility in search results."],
      ["Brand Associate", "Supports brand campaigns and communication."],
    ],
  },
  "artificial-intelligence": {
    summary: "Learn Python, machine learning, neural networks, computer vision and NLP through projects.",
    description:
      "This diploma starts with Python programming and the maths behind machine learning, then covers neural networks, computer vision and natural language processing. It ends with a capstone project.",
    outcomes: [
      "Write Python programs for data tasks",
      "Train and evaluate machine learning models",
      "Build simple neural network models",
      "Apply AI techniques to images and text",
    ],
    modules: [
      ["Python for AI", ["Python basics", "NumPy and pandas", "Data visualisation"], "Write Python code to analyse data."],
      ["Machine Learning Foundations", ["Supervised and unsupervised learning", "Model evaluation", "Feature engineering"], "Train and evaluate a machine learning model."],
      ["Neural Networks", ["Perceptrons and layers", "Training and backpropagation", "Deep learning frameworks"], "Build and train a neural network."],
      ["Computer Vision and NLP", ["Image classification", "Text processing", "Using pre-trained models"], "Apply AI to image and text problems."],
      ["Capstone Project", ["Problem definition", "Building the solution", "Presenting results"], "Deliver an end-to-end AI project."],
    ],
    careers: [
      ["AI Associate", "Supports AI teams with data preparation and model work."],
      ["ML Intern", "Assists with experiments and model evaluation."],
      ["Automation Analyst", "Identifies and builds automation for business tasks."],
      ["AI Product Support", "Helps users and teams work with AI tools."],
    ],
  },
};

export const CATEGORY_ORDER: CourseCategory[] = ["ai", "design", "media", "arts", "wellness", "hospitality", "business"];

export const COURSE_CATEGORIES = CATEGORY_ORDER.map((id) => {
  const row = CATEGORIES.find((category) => category.id === id)!;
  return { id, label: row.label };
});

export const PROGRAMME_TYPES: ProgrammeType[] = ["Diploma", "Certificate"];

function categoryLabel(id: CourseCategory) {
  return CATEGORIES.find((category) => category.id === id)?.label ?? id;
}

function buildFaculty(course: Course, spec: CourseSpec): FacultyProfile[] {
  const area = categoryLabel(course.category);
  return [
    {
      name: "Programme Lead",
      role: `${course.shortName} faculty`,
      bio: "Leads the recorded lessons and live sessions for the batch.",
      expertise: spec.modules.slice(0, 2).map(([title]) => title),
      placeholder: true,
    },
    {
      name: "Industry Mentor",
      role: area,
      bio: "Reviews assignments and project work during live sessions.",
      expertise: spec.careers.slice(0, 2).map(([role]) => role),
      placeholder: true,
    },
    {
      name: "Academic Coordinator",
      role: SITE.name,
      bio: "Supports schedules, assessments and learner queries throughout the course.",
      expertise: ["Batch schedule", "Assessments"],
      placeholder: true,
    },
  ];
}

function buildFaqs(course: Course, programmeType: ProgrammeType): CourseFaq[] {
  return [
    {
      question: `Who can apply for the ${course.name}?`,
      answer: `The eligibility is ${course.eligibility}. The admissions team confirms the latest eligibility requirements during counselling.`,
    },
    {
      question: "How long is the course and how is it delivered?",
      answer: `The ${programmeType.toLowerCase()} runs for ${course.duration.toLowerCase()}. It is delivered online through recorded video lectures and scheduled live sessions, with assignments after each module.`,
    },
    {
      question: "What do I need to study online?",
      answer:
        "A laptop or desktop and a stable internet connection. Any course-specific software or materials are shared with you during counselling and onboarding.",
    },
    {
      question: "What are the fees?",
      answer: `Fees for the ${SITE.year} session are shared by the admissions team during the counselling call. No payment is taken on this website.`,
    },
    {
      question: "Does the course guarantee a job?",
      answer:
        "No. The course is designed to build practical skills and a portfolio of work. Career guidance and interview preparation are available, but placement is not guaranteed.",
    },
    {
      question: "What do I receive when I complete the course?",
      answer: `On completing the modules and assessments, you receive a ${programmeType.toLowerCase()} completion document from ${SITE.name}. The admissions team explains the details during counselling.`,
    },
  ];
}

function buildCourse(course: Course, index: number): CatalogCourse {
  const spec = SPECS[course.slug];
  if (!spec) throw new Error(`Missing catalogue content for ${course.slug}`);
  const programmeType: ProgrammeType = courseKind(course) === "certificate" ? "Certificate" : "Diploma";
  return {
    id: index + 1,
    slug: course.slug,
    title: course.name,
    shortTitle: course.shortName,
    category: course.category,
    categoryLabel: categoryLabel(course.category),
    programmeType,
    duration: course.duration,
    eligibility: course.eligibility,
    mode: "Online",
    summary: spec.summary,
    description: spec.description,
    thumbnail: course.image,
    banner: course.image,
    learningOutcomes: spec.outcomes,
    curriculum: spec.modules.map(([title, topics, outcome], moduleIndex) => ({
      number: moduleIndex + 1,
      title,
      topics,
      outcome,
    })),
    learningFeatures: LEARNING_FEATURES,
    careerOpportunities: spec.careers.map(([role, focus]) => ({ role, focus })),
    faculty: buildFaculty(course, spec),
    faqs: buildFaqs(course, programmeType),
  };
}

export const CATALOG: CatalogCourse[] = ONLINE_COURSES.map(buildCourse);

export const DURATIONS = Array.from(new Set(CATALOG.map((course) => course.duration)));

export function getCatalogCourse(slug: string) {
  return CATALOG.find((course) => course.slug === slug);
}

export function getRelatedCourses(course: CatalogCourse, limit = 3) {
  const sameCategory = CATALOG.filter((item) => item.category === course.category && item.slug !== course.slug);
  const others = CATALOG.filter((item) => item.category !== course.category && item.programmeType === course.programmeType);
  return [...sameCategory, ...others].slice(0, limit);
}
