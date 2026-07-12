// Central content model for Abroad Study Consultancy (frontend-only demo data)

export const company = {
  name: "Abroad Study Consultancy",
  short: "Abroad Study",
  tagline: "Trusted Path to Study Abroad",
  since: 2015,
  phone: "+880 1700-000000",
  phoneAlt: "+880 1800-000000",
  email: "info@abroadstudy.com",
  hours: "Saturday to Thursday · 10AM – 6PM",
  address:
    "House 00, Road 00, Block A, Banani, Dhaka 1213, Bangladesh",
  whatsapp: "https://wa.me/8801700000000",
  socials: [
    { label: "Facebook", href: "#", icon: "facebook" },
    { label: "Instagram", href: "#", icon: "instagram" },
    { label: "LinkedIn", href: "#", icon: "linkedin" },
    { label: "YouTube", href: "#", icon: "youtube" },
  ],
};

export const stats = [
  { value: 1500, suffix: "+", label: "Students Placed" },
  { value: 11, suffix: "+", label: "Countries" },
  { value: 200, suffix: "+", label: "Universities" },
  { value: 144, suffix: "+", label: "Courses" },
];

export const programs = [
  { key: "foundation", name: "Foundation", count: 8, blurb: "Build the academic base you need to progress into a degree with confidence." },
  { key: "undergraduate", name: "Undergraduate", count: 91, blurb: "Bachelor's degrees across top-ranked universities worldwide with scholarship options." },
  { key: "postgraduate", name: "Postgraduate", count: 23, blurb: "MSc, MBA and MA programmes to accelerate your career with strong outcomes." },
  { key: "diploma", name: "Diploma", count: 13, blurb: "Practical, industry-ready qualifications that open doors to further study." },
  { key: "postgraduate-diploma", name: "Postgraduate Diploma", count: 0, blurb: "Specialised advanced diplomas designed for career progression." },
  { key: "phd", name: "PhD", count: 9, blurb: "Doctoral research programmes with world-class supervision and funding routes." },
];

export const subjects = [
  "Nursing & Midwifery", "Medicine", "Health Sciences", "Computing & Technology",
  "Data Science and Analytics", "Cyber Security", "Artificial Intelligence",
  "Marketing", "Finance", "Human Resource Management", "Accounting", "Management",
  "Engineering", "Psychology", "Education", "Supply Chain Management", "Architecture",
  "Tourism & Hospitality", "Banking", "Gaming Technology", "Dentistry", "Law",
  "Creative Arts", "Business", "Science", "Aviation", "Islamic Finance",
  "International Relations", "Islamic Studies", "Social Science",
];

export const popularSubjects = [
  "Computer Science", "Data Science & AI", "Nursing & Healthcare", "Engineering",
  "Business & MBA", "Finance & Accounting", "Cyber Security", "Law", "Medicine", "Art & Design",
];

export const countries = [
  { slug: "uk", name: "UK", flag: "🇬🇧", code: "gb", region: "EUROPE", blurb: "Prestigious universities, 1-year masters and the Graduate Route visa." },
  { slug: "malaysia", name: "MALAYSIA", flag: "🇲🇾", code: "my", region: "ASIA", blurb: "Affordable, English-taught degrees with globally ranked private universities." },
  { slug: "australia", name: "AUSTRALIA", flag: "🇦🇺", code: "au", region: "AUSTRALIA", blurb: "World-class research universities and generous post-study work rights." },
  { slug: "canada", name: "CANADA", flag: "🇨🇦", code: "ca", region: "AMERICA", blurb: "High quality of life, PGWP pathway and welcoming immigration policy." },
  { slug: "usa", name: "USA", flag: "🇺🇸", code: "us", region: "AMERICA", blurb: "The world's top-ranked universities and unmatched research opportunities." },
  { slug: "france", name: "FRANCE", flag: "🇫🇷", code: "fr", region: "EUROPE", blurb: "Low tuition public universities and a hub for business and the arts." },
  { slug: "germany", name: "GERMANY", flag: "🇩🇪", code: "de", region: "EUROPE", blurb: "Tuition-free public education and Europe's strongest engineering economy." },
  { slug: "ireland", name: "IRELAND", flag: "🇮🇪", code: "ie", region: "EUROPE", blurb: "English-speaking EU tech and pharma hub with a 2-year stay-back visa." },
  { slug: "spain", name: "SPAIN", flag: "🇪🇸", code: "es", region: "EUROPE", blurb: "Vibrant lifestyle with strong business schools and affordable living." },
  { slug: "uae", name: "UNITED ARAB EMIRATES (UAE)", flag: "🇦🇪", code: "ae", region: "ASIA", blurb: "Global campuses in a tax-free, career-rich Gulf destination." },
  { slug: "netherlands", name: "NETHERLANDS", flag: "🇳🇱", code: "nl", region: "EUROPE", blurb: "Innovative English-taught programmes and a strong graduate job market." },
  { slug: "ksa", name: "KINGDOM OF SAUDI ARABIA (KSA)", flag: "🇸🇦", code: "sa", region: "ASIA", blurb: "Rapidly growing scholarship-rich destination under Vision 2030." },
];

export const countryBySlug = Object.fromEntries(countries.map((c) => [c.slug, c]));

// Iconic city / landmark photo per destination (keyword-based, with graceful
// gradient fallback in the UI if the image fails to load).
export const cityImage = {
  malaysia: "https://loremflickr.com/800/600/petronas,kualalumpur?lock=11",
  australia: "https://loremflickr.com/800/600/sydney,skyline?lock=12",
  canada: "https://loremflickr.com/800/600/toronto,skyline?lock=13",
  france: "https://loremflickr.com/800/600/paris,eiffel?lock=14",
  germany: "https://loremflickr.com/800/600/berlin,city?lock=15",
  ireland: "https://loremflickr.com/800/600/dublin,ireland?lock=16",
  spain: "https://loremflickr.com/800/600/barcelona,city?lock=17",
  uae: "https://loremflickr.com/800/600/dubai,burj?lock=18",
  netherlands: "https://loremflickr.com/800/600/amsterdam,canal?lock=19",
  uk: "https://loremflickr.com/800/600/london,city?lock=20",
  usa: "https://loremflickr.com/800/600/newyork,skyline?lock=21",
  ksa: "https://loremflickr.com/800/600/riyadh,city?lock=22",
};

const D = {
  standard: ["Academic certificates & transcripts", "English Proficiency", "Passport", "Photo", "CV", "Financial support"],
};

export const universities = [
  {
    slug: "ucsi-university", name: "UCSI University", country: "malaysia", city: "Kuala Lumpur", feeFrom: 4200,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma"],
    subjects: ["Nursing & Midwifery", "Medicine", "Health Sciences", "Computing & Technology", "Marketing", "Finance", "Human Resource Management", "Accounting", "Management", "Engineering", "Supply Chain Management", "Architecture", "Gaming Technology", "Creative Arts", "Business", "Science"],
    intakes: ["January", "February", "May", "July", "September"], upcoming: ["July", "September"], docs: D.standard,
    overview: "UCSI University, originally University College Sedaya International, is a private university in Malaysia accredited by the Malaysian Qualifications Agency, the Malaysian Medical Council, the Malaysian Nursing Board and several other professional bodies.",
  },
  {
    slug: "limkokwing-university", name: "Limkokwing University of Creative Technology", country: "malaysia", city: "Cyberjaya", feeFrom: 3800,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma"],
    subjects: ["Creative Arts", "Architecture", "Computing & Technology", "Business", "Marketing", "Gaming Technology"],
    intakes: ["February", "July", "September"], upcoming: ["July", "September"], docs: D.standard,
    overview: "Limkokwing University is an international creative university with a distinctive focus on design, innovation and technology, connecting students with a global creative network.",
  },
  {
    slug: "brickfields-asia-college", name: "Brickfields Asia College (BAC)", country: "malaysia", city: "Kuala Lumpur", feeFrom: 3500,
    programs: ["foundation", "undergraduate", "diploma"],
    subjects: ["Law", "Business", "Accounting", "Finance", "Management", "Psychology"],
    intakes: ["January", "May", "September"], upcoming: ["May", "September"], docs: D.standard,
    overview: "Brickfields Asia College is one of Malaysia's premier providers of legal and professional education, renowned for its law and accountancy programmes with UK university pathways.",
  },
  {
    slug: "city-university-malaysia", name: "City University Malaysia", country: "malaysia", city: "Petaling Jaya", feeFrom: 3200,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma", "phd"],
    subjects: ["Architecture", "Engineering", "Business", "Management", "Education", "Creative Arts"],
    intakes: ["February", "June", "October"], upcoming: ["June", "October"], docs: D.standard,
    overview: "City University Malaysia is a well-established private institution offering industry-relevant programmes in the built environment, business, engineering and the arts.",
  },
  {
    slug: "global-pathways-college", name: "Global Pathways College", country: "uae", city: "Dubai", feeFrom: 6000,
    programs: ["foundation", "diploma", "undergraduate"],
    subjects: ["Business", "Management", "Computing & Technology", "Finance"],
    intakes: ["January", "May", "September"], upcoming: ["May", "September"], docs: D.standard,
    overview: "Global Pathways College in Dubai delivers foundation and pathway programmes that bridge students into leading undergraduate degrees across the UAE and beyond.",
  },
  {
    slug: "segi-university", name: "SEGi University & Colleges", country: "malaysia", city: "Kota Damansara", feeFrom: 3600,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma", "phd"],
    subjects: ["Nursing & Midwifery", "Dentistry", "Health Sciences", "Business", "Education", "Engineering", "Psychology"],
    intakes: ["January", "May", "September"], upcoming: ["May", "September"], docs: D.standard,
    overview: "SEGi University is one of Malaysia's largest private higher-education providers, offering a broad portfolio of healthcare, business and education programmes across multiple campuses.",
  },
  {
    slug: "inti-international-university", name: "INTI International University & Colleges", country: "malaysia", city: "Nilai", feeFrom: 3900,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma"],
    subjects: ["Business", "Engineering", "Computing & Technology", "Health Sciences", "Accounting", "Finance"],
    intakes: ["January", "April", "August"], upcoming: ["April", "August"], docs: D.standard,
    overview: "INTI International University is part of the Laureate global network, well known for strong industry partnerships and excellent graduate-employability outcomes.",
  },
  {
    slug: "gannon-university", name: "Gannon University", country: "usa", city: "Erie, Pennsylvania", feeFrom: 18500,
    programs: ["undergraduate", "postgraduate", "phd"],
    subjects: ["Engineering", "Health Sciences", "Business", "Computing & Technology", "Nursing & Midwifery"],
    intakes: ["January", "August"], upcoming: ["January", "August"], docs: D.standard,
    overview: "Gannon University is a private Catholic university in Pennsylvania offering career-focused undergraduate and graduate programmes with strong scholarship support for international students.",
  },
  {
    slug: "universiti-kuala-lumpur", name: "Universiti Kuala Lumpur (UniKL)", country: "malaysia", city: "Kuala Lumpur", feeFrom: 3400,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma"],
    subjects: ["Engineering", "Aviation", "Computing & Technology", "Business", "Health Sciences"],
    intakes: ["March", "September"], upcoming: ["September"], docs: D.standard,
    overview: "Universiti Kuala Lumpur is a technical university renowned for its engineering, aviation and technology programmes developed in close collaboration with industry.",
  },
  {
    slug: "asia-metropolitan-university", name: "Asia Metropolitan University (AMU)", country: "malaysia", city: "Cheras", feeFrom: 3300,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma"],
    subjects: ["Nursing & Midwifery", "Health Sciences", "Business", "Accounting", "Management"],
    intakes: ["January", "May", "September"], upcoming: ["May", "September"], docs: D.standard,
    overview: "Asia Metropolitan University focuses on healthcare and business education, offering affordable, professionally accredited programmes with modern campus facilities.",
  },
  {
    slug: "university-of-europe", name: "University of Europe for Applied Sciences", country: "germany", city: "Berlin", feeFrom: 9500,
    programs: ["undergraduate", "postgraduate"],
    subjects: ["Business", "Creative Arts", "Computing & Technology", "Marketing", "Management"],
    intakes: ["April", "October"], upcoming: ["October"], docs: D.standard,
    overview: "The University of Europe for Applied Sciences is an international, English-taught German university with campuses in Berlin, Hamburg and Iserlohn focused on business, tech and design.",
  },
  {
    slug: "university-of-niagara-falls", name: "University Of Niagara Falls Canada", country: "canada", city: "Niagara Falls, Ontario", feeFrom: 14000,
    programs: ["undergraduate", "postgraduate"],
    subjects: ["Business", "Computing & Technology", "Data Science and Analytics", "Management"],
    intakes: ["January", "May", "September"], upcoming: ["May", "September"], docs: D.standard,
    overview: "University of Niagara Falls Canada is a modern institution offering career-aligned programmes in business and technology with co-op work opportunities in Ontario.",
  },
  {
    slug: "university-of-western-australia", name: "The University of Western Australia", country: "australia", city: "Perth", feeFrom: 22000,
    programs: ["undergraduate", "postgraduate", "phd"],
    subjects: ["Engineering", "Science", "Medicine", "Business", "Law", "Health Sciences"],
    intakes: ["February", "July"], upcoming: ["July"], docs: D.standard,
    overview: "The University of Western Australia is a member of the prestigious Group of Eight, ranked among the world's top 100 universities for research and teaching excellence.",
  },
  {
    slug: "middlesex-university-london", name: "Middlesex University London", country: "uk", city: "London", feeFrom: 15000,
    programs: ["foundation", "undergraduate", "postgraduate", "phd"],
    subjects: ["Business", "Computing & Technology", "Nursing & Midwifery", "Law", "Creative Arts", "Psychology"],
    intakes: ["January", "September"], upcoming: ["January", "September"], docs: D.standard,
    overview: "Middlesex University London is a modern, career-focused university in the heart of London with strong links to industry and a diverse international community.",
  },
  {
    slug: "university-of-law", name: "The University of Law (ULaw)", country: "uk", city: "London", feeFrom: 16000,
    programs: ["undergraduate", "postgraduate", "diploma"],
    subjects: ["Law", "Business", "Finance", "Psychology", "Management"],
    intakes: ["January", "May", "September"], upcoming: ["May", "September"], docs: D.standard,
    overview: "The University of Law is one of the UK's longest-established specialist providers of legal education and training, with a growing portfolio of business programmes.",
  },
  {
    slug: "avila-university", name: "Avila University", country: "usa", city: "Kansas City, Missouri", feeFrom: 17000,
    programs: ["undergraduate", "postgraduate"],
    subjects: ["Business", "Nursing & Midwifery", "Psychology", "Computing & Technology", "Education"],
    intakes: ["January", "August"], upcoming: ["August"], docs: D.standard,
    overview: "Avila University is a private university in Kansas City offering personalised, values-driven education with generous merit scholarships for international students.",
  },
  {
    slug: "lsbf", name: "London School of Business and Finance", country: "malaysia", city: "Kuala Lumpur", feeFrom: 4100,
    programs: ["undergraduate", "postgraduate", "diploma"],
    subjects: ["Finance", "Accounting", "Business", "Management", "Marketing", "Banking"],
    intakes: ["January", "May", "September"], upcoming: ["May", "September"], docs: D.standard,
    overview: "London School of Business and Finance delivers globally recognised finance, accounting and business qualifications with flexible study routes.",
  },
  {
    slug: "unisza", name: "Universiti Sultan Zainal Abedin (UniSZA)", country: "malaysia", city: "Terengganu", feeFrom: 2800,
    programs: ["foundation", "undergraduate", "postgraduate", "phd"],
    subjects: ["Medicine", "Islamic Studies", "Islamic Finance", "Health Sciences", "Science", "Law"],
    intakes: ["February", "September"], upcoming: ["September"], docs: D.standard,
    overview: "UniSZA is a Malaysian public university recognised for its medical, Islamic studies and applied science programmes at a highly affordable tuition.",
  },
  {
    slug: "apu", name: "Asia Pacific University of Technology & Innovation (APU)", country: "malaysia", city: "Kuala Lumpur", feeFrom: 4300,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma", "phd"],
    subjects: ["Computing & Technology", "Data Science and Analytics", "Cyber Security", "Artificial Intelligence", "Business", "Engineering"],
    intakes: ["February", "May", "September", "November"], upcoming: ["September", "November"], docs: D.standard,
    overview: "APU is one of Malaysia's premier tech universities, award-winning for its computing, cyber security and data science programmes and its state-of-the-art smart campus.",
  },
  {
    slug: "mahsa-university", name: "MAHSA University", country: "malaysia", city: "Jenjarom", feeFrom: 3700,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma", "phd"],
    subjects: ["Medicine", "Dentistry", "Nursing & Midwifery", "Health Sciences", "Engineering", "Business"],
    intakes: ["January", "May", "September"], upcoming: ["May", "September"], docs: D.standard,
    overview: "MAHSA University is a leading Malaysian healthcare-focused university offering medicine, dentistry, nursing and allied-health programmes with modern teaching hospitals.",
  },
];

export const universityBySlug = Object.fromEntries(universities.map((u) => [u.slug, u]));

// Featured partners for the homepage marquee/grid
export const partners = [
  "avila-university", "lsbf", "unisza", "apu", "mahsa-university", "university-of-law",
  "middlesex-university-london", "university-of-western-australia", "university-of-niagara-falls",
  "university-of-europe", "asia-metropolitan-university", "universiti-kuala-lumpur",
];

export const services = [
  { icon: "chat", title: "Free Study Abroad Counselling", text: "Expert guidance on choosing the right course, university and country for your future." },
  { icon: "compass", title: "University Selection", text: "We match you with suitable universities based on your profile, budget and goals." },
  { icon: "doc", title: "Application Assistance", text: "End-to-end help with SOPs, LORs and document preparation for stronger applications." },
  { icon: "passport", title: "Visa Processing", text: "Expert visa consultation and application support across major study destinations." },
  { icon: "award", title: "Scholarship Guidance", text: "We help you identify scholarships, grants and financial-aid opportunities." },
  { icon: "plane", title: "Pre-Departure Support", text: "Briefings on accommodation, travel, banking and life abroad before you leave." },
];

export const whyUs = [
  { icon: "shield", title: "98% Visa Success", text: "Industry-leading visa approval rate backed by expert documentation." },
  { icon: "chat", title: "Free Counselling", text: "Expert 1-on-1 sessions to plan your full academic journey abroad." },
  { icon: "globe", title: "200+ Universities", text: "Global network across top study destinations worldwide." },
  { icon: "award", title: "Scholarship Help", text: "We identify scholarships and funding options for your profile." },
  { icon: "doc", title: "Full Documentation", text: "SOP, LOR and complete application documents prepared by experts." },
  { icon: "support", title: "24/7 Support", text: "A dedicated support team available at every step of your journey." },
];

export const processSteps = [
  { title: "Free Consultation", text: "Book a session with our advisors to discuss your academic goals." },
  { title: "Course Selection", text: "Choose the best course and university that matches your profile." },
  { title: "Application", text: "We prepare and submit your application with all required documents." },
  { title: "Visa & Finance", text: "Our team supports your visa process and scholarship guidance." },
  { title: "Fly Abroad", text: "Pre-departure support helps you start your journey smoothly." },
];

export const testimonials = [
  { initials: "RA", name: "Rashida Akter", code: "gb", place: "University of Manchester, UK", text: "Abroad Study made my UK dream come true! The team helped me secure admission and guided me through the entire visa process. Truly incredible service!" },
  { initials: "TH", name: "Tanvir Hossain", code: "ca", place: "University of Toronto, Canada", text: "From SOP writing to visa interview prep, they handled everything professionally. Got a 50% scholarship at a Canadian university thanks to their guidance." },
  { initials: "FK", name: "Fatema Khanam", code: "au", place: "Univ. of Melbourne, Australia", text: "I was confused about which country to choose. The counsellors spent hours understanding my goals and helped me choose Australia — best decision of my life!" },
  { initials: "MI", name: "Mohsin Islam", code: "de", place: "TU Munich, Germany", text: "The visa team at Abroad Study is exceptional. My student visa was approved within 3 weeks! They know exactly what documents are needed." },
  { initials: "SB", name: "Sumaiya Begum", code: "gb", place: "University of Leeds, UK", text: "As a nurse wanting to study in the UK, I had specific requirements. They found the perfect nursing programme for me. They genuinely care about your future!" },
  { initials: "AR", name: "Arif Rahman", code: "us", place: "NYU New York, USA", text: "Got into my first-choice university in the USA with a full scholarship! Their dedication and knowledge are truly unmatched in Bangladesh." },
];

// Deterministic gradient for a university/logo monogram
export function monogram(name) {
  const words = name.replace(/[()]/g, "").split(/\s+/).filter(Boolean);
  const letters = (words[0]?.[0] || "") + (words[1]?.[0] || words[0]?.[1] || "");
  return letters.toUpperCase();
}

const GRADIENTS = [
  "from-brand-500 to-brand-800",
  "from-indigo-500 to-purple-700",
  "from-sky-500 to-blue-800",
  "from-emerald-500 to-teal-800",
  "from-rose-500 to-pink-700",
  "from-amber-500 to-orange-700",
  "from-violet-500 to-fuchsia-700",
  "from-cyan-500 to-sky-800",
];

export function gradientFor(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

export function countUniversities(slug) {
  return universities.filter((u) => u.country === slug).length;
}

/* ------------------------------------------------------------------ */
/* Articles (blog) & Events                                            */
/* ------------------------------------------------------------------ */

export const articles = [
  {
    slug: "how-to-write-winning-sop",
    title: "How to Write a Winning Statement of Purpose (SOP)",
    category: "Applications",
    date: "2026-06-28",
    readTime: 6,
    author: "Nadia Rahman",
    image: "https://loremflickr.com/800/500/writing,desk?lock=31",
    excerpt: "Your SOP can make or break your application. Learn the structure, tone and storytelling that admissions officers look for.",
    content: [
      "A Statement of Purpose (SOP) is your chance to speak directly to the admissions committee. Unlike your transcripts, it shows who you are beyond the numbers — your motivation, your goals and your fit for the programme.",
      "Start with a hook: a specific moment or realisation that sparked your interest in the field. Avoid generic openings like 'Since childhood I have always loved...'. Admissions officers read thousands of these.",
      "The body should connect your academic background and experience to the exact course you're applying for. Name specific modules, professors or research groups to show you've done your homework.",
      "Close with your future goals and how this programme is the bridge to them. Keep it concise — one to two pages — and always proofread. Our advisors review every SOP before submission.",
    ],
  },
  {
    slug: "uk-graduate-route-visa-guide",
    title: "UK Graduate Route Visa: Everything You Need to Know",
    category: "Visa",
    date: "2026-06-15",
    readTime: 5,
    author: "Imran Kabir",
    image: "https://loremflickr.com/800/500/london,passport?lock=32",
    excerpt: "The Graduate Route lets you stay and work in the UK for up to 2 years after your degree. Here's how to qualify.",
    content: [
      "The UK Graduate Route is a post-study work visa that allows international students to remain in the UK for two years (three for PhD graduates) after successfully completing an eligible course.",
      "To qualify you must have a valid Student visa and have completed a UK bachelor's, master's or other eligible qualification at an approved institution.",
      "There is no job-offer requirement and no minimum salary threshold, giving you the freedom to find work, gain experience or even start a business.",
      "Applications must be made from inside the UK before your Student visa expires. Our visa team helps you time and prepare the application correctly.",
    ],
  },
  {
    slug: "top-scholarships-2026",
    title: "Top 10 Scholarships for Bangladeshi Students in 2026",
    category: "Scholarships",
    date: "2026-05-30",
    readTime: 8,
    author: "Farhana Akter",
    image: "https://loremflickr.com/800/500/graduation,scholarship?lock=33",
    excerpt: "From full-ride government awards to university merit grants — here are the funding options worth applying for this year.",
    content: [
      "Studying abroad is an investment, but scholarships can dramatically reduce the cost. This year there are more opportunities than ever for Bangladeshi students.",
      "Government-funded awards like Chevening (UK), Fulbright (USA) and DAAD (Germany) cover tuition and living costs and are highly competitive.",
      "Most universities also offer merit-based scholarships ranging from 10% to 50% of tuition, awarded automatically or through a short essay.",
      "Our scholarship team matches your profile to the awards you're most likely to win and helps you craft standout applications.",
    ],
  },
  {
    slug: "uk-usa-canada-australia-compared",
    title: "UK vs USA vs Canada vs Australia: Which Is Right for You?",
    category: "Destinations",
    date: "2026-05-12",
    readTime: 7,
    author: "Tanvir Hasan",
    image: "https://loremflickr.com/800/500/university,campus?lock=34",
    excerpt: "Tuition, visa rules, work rights and lifestyle compared across the four most popular study destinations.",
    content: [
      "Each destination offers something different. The UK is known for one-year master's degrees and the Graduate Route visa. The USA offers unmatched research funding and campus life.",
      "Canada attracts students with its affordable tuition, welcoming immigration policy and post-graduation work permit. Australia balances quality education with strong post-study work rights.",
      "Consider your budget, career goals and preferred lifestyle. Cost of living, weather and community can matter as much as university ranking.",
      "Book a free counselling session and we'll help you weigh the options against your unique profile and ambitions.",
    ],
  },
  {
    slug: "ielts-pte-duolingo-compared",
    title: "IELTS vs PTE vs Duolingo: Which English Test Should You Take?",
    category: "Test Prep",
    date: "2026-04-25",
    readTime: 5,
    author: "Sadia Islam",
    image: "https://loremflickr.com/800/500/exam,study?lock=35",
    excerpt: "Not all English tests are accepted everywhere. Compare cost, format and acceptance before you book.",
    content: [
      "English proficiency tests are a key requirement for most universities. The three most common are IELTS, PTE Academic and the Duolingo English Test.",
      "IELTS is the most widely accepted and comes in Academic and General formats. PTE is fully computer-based with fast results and strong acceptance in Australia and the UK.",
      "The Duolingo English Test is the most affordable and can be taken from home, but always confirm your target universities accept it.",
      "We help you pick the right test and connect you with preparation resources to hit your target score.",
    ],
  },
  {
    slug: "budgeting-study-abroad",
    title: "Budgeting for Your Study Abroad Journey",
    category: "Finance",
    date: "2026-04-08",
    readTime: 6,
    author: "Rezaul Karim",
    image: "https://loremflickr.com/800/500/finance,savings?lock=36",
    excerpt: "Tuition is only part of the picture. Plan for accommodation, living costs, insurance and one-off setup expenses.",
    content: [
      "A realistic budget prevents nasty surprises abroad. Beyond tuition, factor in accommodation, food, transport, health insurance and study materials.",
      "Many countries require proof of funds for your visa, so plan your finances early and keep documentation ready.",
      "Part-time work rights vary by country — most allow around 20 hours per week during term, which can offset living costs.",
      "Our advisors provide country-specific cost breakdowns and help you identify scholarships and education loans.",
    ],
  },
];

export const articleBySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));

export const events = [
  {
    slug: "uk-admissions-fair-2026",
    title: "UK University Admissions Fair 2026",
    type: "In-person",
    date: "2026-08-14",
    time: "10:00 AM – 5:00 PM",
    location: "Banani, Dhaka",
    image: "https://loremflickr.com/800/500/conference,students?lock=41",
    excerpt: "Meet delegates from 30+ UK universities, get on-the-spot assessments and explore scholarship offers.",
    description: [
      "Join our flagship admissions fair and meet official representatives from more than 30 UK universities under one roof.",
      "Get your documents assessed on the spot, receive conditional offers, and learn about scholarships worth up to 50% of tuition.",
      "Free entry — registration recommended as spots are limited.",
    ],
    agenda: [
      "University stalls & one-on-one meetings",
      "On-the-spot application assessment",
      "Scholarship & funding briefing",
      "UK visa Q&A session",
    ],
  },
  {
    slug: "free-ielts-masterclass",
    title: "Free IELTS Masterclass Webinar",
    type: "Online",
    date: "2026-07-26",
    time: "7:00 PM – 8:30 PM",
    location: "Zoom (Online)",
    image: "https://loremflickr.com/800/500/webinar,laptop?lock=42",
    excerpt: "Boost your band score with proven strategies for all four IELTS modules from a certified trainer.",
    description: [
      "This live 90-minute masterclass covers strategies for Listening, Reading, Writing and Speaking.",
      "A certified IELTS trainer will share time-management tips, common mistakes and a live writing evaluation.",
      "Register to receive the joining link and a free practice pack.",
    ],
    agenda: [
      "Listening & Reading techniques",
      "Writing Task 1 & 2 structure",
      "Speaking fluency tips",
      "Live Q&A",
    ],
  },
  {
    slug: "scholarship-application-workshop",
    title: "Scholarship Application Workshop",
    type: "In-person",
    date: "2026-08-02",
    time: "3:00 PM – 5:00 PM",
    location: "Banani, Dhaka",
    image: "https://loremflickr.com/800/500/workshop,writing?lock=43",
    excerpt: "A hands-on session on finding, applying for and winning scholarships for your study-abroad journey.",
    description: [
      "Learn how to identify scholarships that match your profile and craft applications that stand out.",
      "Bring your CV and academic documents for personalised guidance from our scholarship advisors.",
      "Limited seats — reserve yours early.",
    ],
    agenda: [
      "Finding the right scholarships",
      "Writing winning essays",
      "Reference & document tips",
      "One-on-one profile review",
    ],
  },
  {
    slug: "study-in-australia-info-session",
    title: "Study in Australia — Info Session",
    type: "Online",
    date: "2026-09-05",
    time: "6:00 PM – 7:00 PM",
    location: "Google Meet (Online)",
    image: "https://loremflickr.com/800/500/sydney,students?lock=44",
    excerpt: "Everything about Australian universities, intakes, costs and the post-study work visa in one session.",
    description: [
      "Discover why Australia is a top choice for Bangladeshi students, from world-class universities to generous work rights.",
      "We'll cover intakes, tuition, living costs, and the Temporary Graduate (subclass 485) visa.",
      "Register for the joining link and a free country guide.",
    ],
    agenda: [
      "Top Australian universities & courses",
      "Costs & scholarships",
      "Student & post-study work visas",
      "Live Q&A",
    ],
  },
  {
    slug: "pre-departure-orientation",
    title: "Pre-Departure Orientation",
    type: "In-person",
    date: "2026-09-20",
    time: "11:00 AM – 1:00 PM",
    location: "Banani, Dhaka",
    image: "https://loremflickr.com/800/500/airport,travel?lock=45",
    excerpt: "Get ready for life abroad — accommodation, banking, travel and settling-in tips before you fly.",
    description: [
      "A must-attend session for students who have received their visa and are preparing to fly.",
      "We cover accommodation, banking, SIM cards, packing, airport procedures and cultural adjustment.",
      "Meet fellow students heading to the same destinations.",
    ],
    agenda: [
      "Accommodation & banking setup",
      "Packing & travel checklist",
      "Airport & arrival guidance",
      "Settling-in & safety tips",
    ],
  },
];

export const eventBySlug = Object.fromEntries(events.map((e) => [e.slug, e]));

export function formatDate(iso, opts = { day: "numeric", month: "short", year: "numeric" }) {
  return new Date(iso).toLocaleDateString("en-GB", opts);
}
