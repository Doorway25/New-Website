// Central content model for Education Doorway (frontend-only demo data)

import { ukUniversities } from "./ukUniversities.js";
import { ukUniversitiesExtra } from "./ukUniversitiesExtra.js";

export const company = {
  name: "Education Doorway",
  short: "Education Doorway",
  tagline: "Trusted Path to Study Abroad",
  since: 2018,
  phone: "+44 2081 333 905",
  phoneAlt: "+44 7939 983 493",
  email: "info@educationdoorway.com",
  hours: "Monday to Friday · 9AM – 6PM",
  address:
    "Unit 6, Durning Hall, Earlham Grove, Forest Gate, London E7 9AB, UK",
  whatsapp: "https://wa.me/447939983493",
  socials: [
    { label: "Facebook", href: "#", icon: "facebook" },
    { label: "Instagram", href: "#", icon: "instagram" },
    { label: "LinkedIn", href: "#", icon: "linkedin" },
    { label: "YouTube", href: "#", icon: "youtube" },
  ],
};

export const branches = [
  {
    slug: "london",
    city: "London",
    country: "United Kingdom",
    code: "gb",
    head: true,
    address: "Unit 6, Durning Hall, Earlham Grove, Forest Gate, London E7 9AB, UK",
    phone: "+44 2081 333 905",
    phoneAlt: "+44 7939 983 493",
    email: "london@educationdoorway.com",
    hours: "Monday to Friday · 9AM – 6PM",
    mapQuery: "Durning Hall Earlham Grove Forest Gate London E7 9AB",
    blurb: "Our head office, guiding students across every study destination.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&h=560&q=80",
    details: [
      "Head-office oversight for every destination",
      "UK university applications & CAS support",
      "Visa, SOP and interview coaching",
      "Pre-departure & airport guidance",
    ],
  },
  {
    slug: "dhaka",
    city: "Dhaka",
    country: "Bangladesh",
    code: "bd",
    head: true,
    address: "5th floor, Rangs Nasim Square, Road No. 16, Dhaka 1209",
    phone: "01901-379384",
    email: "dhaka@educationdoorway.com",
    hours: "Saturday to Thursday · 10AM – 6PM",
    mapQuery: "Rangs Nasim Square Road 16 Dhaka 1209",
    blurb: "Our Dhaka office supporting students across Bangladesh.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&h=560&q=80",
    details: [
      "Free one-to-one counselling in Bangla & English",
      "Course & university shortlisting",
      "Document checking and application filing",
      "Scholarship and funding guidance",
    ],
  },
  {
    slug: "cumilla",
    city: "Cumilla",
    country: "Bangladesh",
    code: "bd",
    address: "98/1, Najnin, Bashar Kutir, Victoria College Road, Cumilla 3500",
    phone: "01901-379392",
    email: "cumilla@educationdoorway.com",
    hours: "Saturday to Thursday · 10AM – 6PM",
    mapQuery: "Victoria College Road Cumilla 3500",
    blurb: "Local guidance for students in the Cumilla region.",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&h=560&q=80",
    details: [
      "Walk-in counselling for Cumilla students",
      "UK, Malaysia & Canada pathways",
      "IELTS / English test planning",
      "Parent briefings and progress updates",
    ],
  },
  {
    slug: "sylhet",
    city: "Sylhet",
    country: "Bangladesh",
    code: "bd",
    address: "Room: 802(B), Sylhet City Center, Sylhet 3100",
    phone: "01712-303991",
    email: "sylhet@educationdoorway.com",
    hours: "Saturday to Thursday · 10AM – 6PM",
    mapQuery: "Sylhet City Center Sylhet 3100",
    blurb: "Serving study-abroad aspirants across the Sylhet division.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&h=560&q=80",
    details: [
      "Local advisors for Sylhet & surrounding areas",
      "End-to-end application support",
      "Visa file preparation",
      "Alumni & student community connect",
    ],
  },
  {
    slug: "kuala-lumpur",
    city: "Kuala Lumpur",
    country: "Malaysia",
    code: "my",
    address: "Menara Paragon, SB-10-02, Persiaran Bestari Cyber 11, 63000 Cyberjaya, Selangor, Kuala Lumpur",
    phone: "+03-8685 0725",
    email: "kl@educationdoorway.com",
    hours: "Monday to Saturday · 9AM – 6PM",
    mapQuery: "Menara Paragon Cyberjaya Selangor Malaysia",
    blurb: "Your local hub for Malaysia's globally ranked private universities.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=900&h=560&q=80",
    details: [
      "Malaysia private university placements",
      "Campus visit coordination",
      "Offer-to-enrolment support",
      "Student accommodation tips",
    ],
  },
  {
    slug: "lahore",
    city: "Lahore",
    country: "Pakistan",
    code: "pk",
    address: "Office 12, Gulberg III, Main Boulevard, Lahore, Pakistan",
    phone: "+92 300 0000000",
    email: "lahore@educationdoorway.com",
    hours: "Monday to Saturday · 10AM – 6PM",
    mapQuery: "Gulberg III Lahore Pakistan",
    blurb: "Helping Pakistani students plan UK and global study pathways.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&h=560&q=80",
    details: [
      "UK & global destination counselling",
      "SOP and personal statement support",
      "Visa documentation guidance",
      "Scholarship search assistance",
    ],
  },
  {
    slug: "karachi",
    city: "Karachi",
    country: "Pakistan",
    code: "pk",
    address: "Suite 4, Clifton Block 5, Karachi, Pakistan",
    phone: "+92 321 0000000",
    email: "karachi@educationdoorway.com",
    hours: "Monday to Saturday · 10AM – 6PM",
    mapQuery: "Clifton Block 5 Karachi Pakistan",
    blurb: "Local counselling and application support for Karachi students.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&h=560&q=80",
    details: [
      "In-person counselling in Karachi",
      "University shortlisting workshops",
      "Application tracking updates",
      "Pre-departure orientation",
    ],
  },
  {
    slug: "lagos",
    city: "Lagos",
    country: "Nigeria",
    code: "ng",
    address: "12 Adeola Odeku Street, Victoria Island, Lagos, Nigeria",
    phone: "+234 800 000 0000",
    email: "lagos@educationdoorway.com",
    hours: "Monday to Friday · 9AM – 5PM",
    mapQuery: "Victoria Island Lagos Nigeria",
    blurb: "Guiding Nigerian students toward UK and international universities.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&h=560&q=80",
    details: [
      "UK & international study pathways",
      "Admission and offer management",
      "Visa interview preparation",
      "Student finance overview",
    ],
  },
  {
    slug: "abuja",
    city: "Abuja",
    country: "Nigeria",
    code: "ng",
    address: "Plot 45, Central Business District, Abuja, Nigeria",
    phone: "+234 800 111 0000",
    email: "abuja@educationdoorway.com",
    hours: "Monday to Friday · 9AM – 5PM",
    mapQuery: "Central Business District Abuja Nigeria",
    blurb: "Study-abroad counselling for students across the capital region.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&h=560&q=80",
    details: [
      "Capital-region counselling desk",
      "Course matching for your goals",
      "Full application file support",
      "Family counselling sessions",
    ],
  },
];

export const branchBySlug = Object.fromEntries(branches.map((b) => [b.slug, b]));

// Mission / Vision / Values — each has its own detail page.
export const pillars = [
  {
    slug: "mission",
    title: "Our Mission",
    icon: "compass",
    eyebrow: "What Drives Us",
    teaser: "Honest, expert guidance that makes international education accessible to every student.",
    short:
      "To provide honest, transparent and expert guidance to every student, making international education accessible to all.",
    intro:
      "Our mission is simple: put students first. We guide every applicant with honest advice, transparent processes and expert support — from choosing the right course to landing their visa and settling in abroad.",
    points: [
      { icon: "chat", title: "Honest Counselling", text: "We recommend what's genuinely right for you, never what's easiest for us." },
      { icon: "compass", title: "Personalised Roadmaps", text: "A tailored plan for every student based on goals, budget and profile." },
      { icon: "shield", title: "End-to-End Support", text: "From application to arrival, we stay with you at every single step." },
      { icon: "spark", title: "Accessible Guidance", text: "Free counselling that makes studying abroad achievable for all." },
    ],
  },
  {
    slug: "vision",
    title: "Our Vision",
    icon: "target",
    eyebrow: "Where We're Headed",
    teaser: "To be the world's most trusted gateway for international education.",
    short:
      "To be the world's most trusted gateway for international education, recognised for our commitment to excellence and student success.",
    intro:
      "We envision a world where every ambitious student can access life-changing education without borders. Our vision is to become the most trusted name in study-abroad consultancy — measured by the success of the students we serve.",
    points: [
      { icon: "target", title: "Trusted Worldwide", text: "A globally recognised partner for students and universities alike." },
      { icon: "cap", title: "Student Success First", text: "Our success is defined by the achievements of our students." },
      { icon: "globe", title: "Borderless Opportunity", text: "Opening doors to top destinations across the globe." },
      { icon: "spark", title: "Continuous Excellence", text: "Always raising the bar in service, guidance and outcomes." },
    ],
  },
  {
    slug: "values",
    title: "Our Values",
    icon: "spark",
    eyebrow: "What We Stand For",
    teaser: "Integrity, transparency and a student-first commitment guide us.",
    short:
      "Integrity, student empowerment and transparency drive every consultation and application we handle.",
    intro:
      "Our values are the foundation of everything we do. They shape how we advise, how we work with partner universities, and how we treat every student who walks through our door.",
    points: [
      { icon: "shield", title: "Integrity", text: "We give honest advice, even when it's not the easy answer — your trust matters most." },
      { icon: "users", title: "Student Empowerment", text: "We equip students with clarity and confidence to own their study-abroad journey." },
      { icon: "check", title: "Transparency", text: "No hidden costs or false promises — clear guidance at every single step." },
    ],
  },
];

export const pillarBySlug = Object.fromEntries(pillars.map((p) => [p.slug, p]));

export const stats = [
  { value: 75000, suffix: "+", label: "Students Placed" },
  { value: 11, suffix: "+", label: "Countries" },
  { value: 75, suffix: "+", label: "Events" },
  { value: 34000, suffix: "+", label: "Courses" },
];

export const programs = [
  { key: "foundation", name: "Foundation", count: 8, blurb: "Build the academic base you need to progress into a degree with confidence." },
  { key: "diploma", name: "Diploma", count: 13, blurb: "Practical, industry-ready qualifications that open doors to further study." },
  { key: "undergraduate", name: "Undergraduate", count: 91, blurb: "Bachelor's degrees across top-ranked universities worldwide with scholarship options." },
  { key: "postgraduate", name: "Postgraduate / Masters", count: 23, blurb: "MSc, MBA and MA programmes to accelerate your career with strong outcomes." },
  { key: "mres", name: "MRes / Masters in Research", count: 0, blurb: "Research-focused master's programmes for students preparing for doctoral study or research careers." },
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
  "Nursing & Midwifery",
  "Medicine",
  "Health Sciences",
  "Computing & Technology",
  "Data Science and Analytics",
  "Cyber Security",
  "Artificial Intelligence",
  "Marketing",
  "Finance",
  "Human Resource Management",
  "Accounting",
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
  { slug: "uae", name: "UNITED ARAB EMIRATES (UAE)", flag: "🇦🇪", code: "ae", region: "ASIA", blurb: "Global campuses in a tax-free, career-rich Gulf destination." },
  { slug: "ksa", name: "KINGDOM OF SAUDI ARABIA (KSA)", flag: "🇸🇦", code: "sa", region: "ASIA", blurb: "Rapidly growing scholarship-rich destination under Vision 2030." },
];

export const countryBySlug = Object.fromEntries(countries.map((c) => [c.slug, c]));

// Iconic city / landmark photo per destination (keyword-based, with graceful
// gradient fallback in the UI if the image fails to load).
export const cityImage = {
  malaysia: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&h=520&q=58",
  australia: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&h=520&q=58",
  canada: "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=800&h=520&q=58",
  france: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&h=520&q=58",
  germany: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&h=520&q=58",
  ireland: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&h=520&q=58",
  spain: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&h=520&q=58",
  uae: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&h=520&q=58",
  netherlands: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&h=520&q=58",
  uk: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&h=520&q=58",
  usa: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&h=520&q=58",
  ksa: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&h=520&q=58",
};

const D = {
  standard: ["Academic certificates & transcripts", "English Proficiency", "Passport", "Photo", "CV", "Financial support"],
};

function logoMark(name) {
  const initials = String(name || "U")
    .replace(/[()]/g, "")
    .split(/\s+/)
    .filter((w) => w && !/^(of|the|and|university|college|school|&)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "U";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=192&background=0d157b&color=ffffff&bold=true&format=png`;
}

function withMedia(uni) {
  return {
    ...uni,
    docs: uni.docs || D.standard,
    imageUrl: uni.imageUrl || cityImage[uni.country] || cityImage.uk,
    logoUrl: uni.logoUrl || logoMark(uni.name),
    subjects: uni.subjects?.length ? uni.subjects : ["Business"],
    programs: uni.programs?.length ? uni.programs : ["undergraduate", "postgraduate"],
    intakes: uni.intakes?.length ? uni.intakes : ["January", "September"],
    upcoming: uni.upcoming?.length ? uni.upcoming : ["September"],
  };
}

const universitiesRaw = [
  {
    slug: "taylors-university",
    name: "Taylor's University",
    country: "malaysia",
    city: "Subang Jaya",
    feeFrom: 5200,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma", "phd"],
    subjects: ["Tourism & Hospitality", "Business", "Medicine", "Pharmacy", "Architecture", "Computing & Technology", "Engineering", "Law", "Design", "Education", "Psychology"],
    intakes: ["February", "April", "September"],
    upcoming: ["April", "September"],
    docs: D.standard,
    overview:
      "Taylor's University is one of Malaysia's top-ranked private universities, known for hospitality, business, medicine and design. Its Lakeside Campus in Subang Jaya combines strong industry links with a highly international student community.",
  },
  {
    slug: "sunway-university",
    name: "Sunway University",
    country: "malaysia",
    city: "Bandar Sunway",
    feeFrom: 4800,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma", "phd"],
    subjects: ["Business", "Computing & Technology", "Tourism & Hospitality", "Psychology", "Biological Sciences", "Accounting", "Marketing", "Engineering", "Arts", "Medicine"],
    intakes: ["January", "April", "August"],
    upcoming: ["April", "August"],
    docs: D.standard,
    overview:
      "Sunway University is a leading private university in Bandar Sunway with a longstanding academic partnership with Lancaster University. Students benefit from a modern campus, strong employability focus and pathways into globally recognised degrees.",
  },
  {
    slug: "apu",
    name: "Asia Pacific University of Technology & Innovation (APU)",
    country: "malaysia",
    city: "Kuala Lumpur",
    feeFrom: 4300,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma", "phd"],
    subjects: ["Computing & Technology", "Data Science and Analytics", "Cyber Security", "Artificial Intelligence", "Business", "Engineering", "Accounting", "Design", "Multimedia"],
    intakes: ["February", "May", "September", "November"],
    upcoming: ["September", "November"],
    docs: D.standard,
    overview:
      "APU is one of Malaysia's premier technology universities, award-winning for computing, cyber security, AI and data science. Its smart campus in Technology Park Malaysia is built around innovation, industry projects and graduate employability.",
  },
  {
    slug: "segi-university",
    name: "SEGi University",
    country: "malaysia",
    city: "Kota Damansara",
    feeFrom: 3600,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma", "phd"],
    subjects: ["Medicine", "Dentistry", "Nursing & Midwifery", "Pharmacy", "Health Sciences", "Business", "Education", "Engineering", "Psychology", "Optometry"],
    intakes: ["January", "May", "September"],
    upcoming: ["May", "September"],
    docs: D.standard,
    overview:
      "SEGi University is one of Malaysia's largest private higher-education providers, with a strong portfolio in medicine, dentistry, nursing, business and education across its Kota Damansara campus and college network.",
  },
  {
    slug: "mahsa-university",
    name: "MAHSA University",
    country: "malaysia",
    city: "Jenjarom",
    feeFrom: 3700,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma", "phd"],
    subjects: ["Medicine", "Dentistry", "Nursing & Midwifery", "Pharmacy", "Health Sciences", "Physiotherapy", "Engineering", "Business", "Biosciences"],
    intakes: ["January", "May", "September"],
    upcoming: ["May", "September"],
    docs: D.standard,
    overview:
      "MAHSA University is a leading Malaysian healthcare-focused university offering medicine, dentistry, nursing, pharmacy and allied-health programmes, supported by modern teaching facilities and clinical training pathways.",
  },
  {
    slug: "inti-international-university",
    name: "INTI International University",
    country: "malaysia",
    city: "Nilai",
    feeFrom: 3900,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma"],
    subjects: ["Business", "Engineering", "Computing & Technology", "Health Sciences", "Accounting", "Finance", "Biotechnology", "Mass Communication", "Psychology"],
    intakes: ["January", "April", "August"],
    upcoming: ["April", "August"],
    docs: D.standard,
    overview:
      "INTI International University in Nilai is known for strong industry partnerships, American Degree Transfer pathways and career-ready programmes in business, engineering, computing and health sciences.",
  },
  {
    slug: "university-of-cyberjaya",
    name: "University of Cyberjaya",
    country: "malaysia",
    city: "Cyberjaya",
    feeFrom: 4000,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma", "phd"],
    subjects: ["Medicine", "Pharmacy", "Nursing & Midwifery", "Health Sciences", "Psychology", "Business", "Computing & Technology", "Biomedical Engineering"],
    intakes: ["March", "July", "October"],
    upcoming: ["July", "October"],
    docs: D.standard,
    overview:
      "University of Cyberjaya is a private university in Malaysia's technology hub, specialising in medicine, pharmacy, health sciences and psychology, with a growing portfolio of business and technology programmes.",
  },
  {
    slug: "raffles-university-malaysia",
    name: "Raffles University Malaysia",
    country: "malaysia",
    city: "Johor Bahru",
    feeFrom: 3500,
    programs: ["foundation", "undergraduate", "postgraduate", "diploma"],
    subjects: ["Business", "Design", "Creative Arts", "Psychology", "Accounting", "Computing & Technology", "Tourism & Hospitality", "Marketing"],
    intakes: ["January", "May", "September"],
    upcoming: ["May", "September"],
    docs: D.standard,
    overview:
      "Raffles University Malaysia delivers practice-led programmes in business, design, fashion and psychology, with an international teaching approach and a focus on creative and professional careers.",
  },
  {
    slug: "global-pathways-college", name: "Global Pathways College", country: "uae", city: "Dubai", feeFrom: 6000,
    programs: ["foundation", "diploma", "undergraduate"],
    subjects: ["Business", "Management", "Computing & Technology", "Finance"],
    intakes: ["January", "May", "September"], upcoming: ["May", "September"], docs: D.standard,
    overview: "Global Pathways College in Dubai delivers foundation and pathway programmes that bridge students into leading undergraduate degrees across the UAE and beyond.",
  },
  {
    slug: "gannon-university", name: "Gannon University", country: "usa", city: "Erie, Pennsylvania", feeFrom: 18500,
    programs: ["undergraduate", "postgraduate", "phd"],
    subjects: ["Engineering", "Health Sciences", "Business", "Computing & Technology", "Nursing & Midwifery"],
    intakes: ["January", "August"], upcoming: ["January", "August"], docs: D.standard,
    overview: "Gannon University is a private Catholic university in Pennsylvania offering career-focused undergraduate and graduate programmes with strong scholarship support for international students.",
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
  ...ukUniversities,
  ...ukUniversitiesExtra,
  {
    slug: "avila-university", name: "Avila University", country: "usa", city: "Kansas City, Missouri", feeFrom: 17000,
    programs: ["undergraduate", "postgraduate"],
    subjects: ["Business", "Nursing & Midwifery", "Psychology", "Computing & Technology", "Education"],
    intakes: ["January", "August"], upcoming: ["August"], docs: D.standard,
    overview: "Avila University is a private university in Kansas City offering personalised, values-driven education with generous merit scholarships for international students.",
  },
];

export const universities = universitiesRaw.map(withMedia);

export const universityBySlug = Object.fromEntries(universities.map((u) => [u.slug, u]));

// Featured partners for the homepage marquee/grid
export const partners = [
  "taylors-university",
  "sunway-university",
  "apu",
  "segi-university",
  "mahsa-university",
  "inti-international-university",
  "university-of-cyberjaya",
  "raffles-university-malaysia",
  "coventry-university",
  "university-of-law",
  "aston-university",
  "newcastle-university",
  "queens-university-belfast",
  "city-st-georges-university-of-london",
  "university-of-roehampton",
  "bath-spa-university",
  "bpp-university",
  "canterbury-christ-church-university",
  "leeds-beckett-university",
  "arden-university",
];

export const services = [
  { icon: "chat", title: "Free Counselling", text: "Course, university and country advice." },
  { icon: "compass", title: "University Selection", text: "Matched to your profile and budget." },
  { icon: "doc", title: "Application Help", text: "SOP, LOR and document support." },
  { icon: "passport", title: "Visa Processing", text: "Visa filing for major destinations." },
  { icon: "award", title: "Scholarships", text: "Funding and scholarship options." },
  { icon: "plane", title: "Pre-Departure", text: "Travel, housing and settling-in tips." },
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
  { initials: "RA", name: "Rashida Akter", code: "gb", place: "University of Manchester, UK", text: "Education Doorway made my UK dream come true! The team helped me secure admission and guided me through the entire visa process. Truly incredible service!" },
  { initials: "TH", name: "Tanvir Hossain", code: "ca", place: "University of Toronto, Canada", text: "From SOP writing to visa interview prep, they handled everything professionally. Got a 50% scholarship at a Canadian university thanks to their guidance." },
  { initials: "FK", name: "Fatema Khanam", code: "au", place: "Univ. of Melbourne, Australia", text: "I was confused about which country to choose. The counsellors spent hours understanding my goals and helped me choose Australia — best decision of my life!" },
  { initials: "MI", name: "Mohsin Islam", code: "de", place: "TU Munich, Germany", text: "The visa team at Education Doorway is exceptional. My student visa was approved within 3 weeks! They know exactly what documents are needed." },
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
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&h=560&q=80",
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
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&h=560&q=80",
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
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&h=560&q=80",
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
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&h=560&q=80",
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
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&h=560&q=80",
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
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&h=560&q=80",
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
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&h=560&q=80",
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
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&h=560&q=80",
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
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&h=560&q=80",
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
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&h=560&q=80",
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
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&h=560&q=80",
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

/* ------------------------------------------------------------------ */
/* Video stories — Guardians, Students & University Delegates          */
/* ------------------------------------------------------------------ */

export const storyCategories = [
  {
    key: "guardian",
    label: "Guardian Stories",
    short: "Guardian Says",
    icon: "users",
    blurb: "Parents share why they trusted us with their child's study-abroad journey.",
  },
  {
    key: "student",
    label: "Student Stories",
    short: "Student Says",
    icon: "cap",
    blurb: "Students talk about their journey from application to campus abroad.",
  },
  {
    key: "delegate",
    label: "Delegate Stories",
    short: "Delegate Says",
    icon: "globe",
    blurb: "University representatives on partnering with Education Doorway.",
  },
];

export const storyCategoryByKey = Object.fromEntries(storyCategories.map((c) => [c.key, c]));

export const stories = [
  {
    slug: "guardian-rahima-begum",
    name: "Rahima Begum",
    role: "Guardian",
    roleKey: "guardian",
    relation: "Parent of a student now at the University of Leeds, UK",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&h=560&q=80",
    youtubeId: "ScMzIvxBSi4",
    quote: "They guided our whole family through every single step.",
    text: [
      "Sending our daughter abroad felt overwhelming at first. The Education Doorway team sat with us, explained every stage, and answered all of our questions with patience.",
      "From the university shortlist to the visa interview, they kept us informed the whole way. As parents, that transparency gave us real peace of mind.",
    ],
  },
  {
    slug: "guardian-abdul-karim",
    name: "Abdul Karim",
    role: "Guardian",
    roleKey: "guardian",
    relation: "Parent of a student at the University of Toronto, Canada",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&h=560&q=80",
    youtubeId: "aqz-KE-bpKQ",
    quote: "Honest advice, no false promises — that's why we trusted them.",
    text: [
      "What impressed me most was the honesty. They never over-promised; they told us exactly what was realistic for my son's profile and budget.",
      "The scholarship guidance alone saved us a significant amount. I recommend them to every parent in my circle.",
    ],
  },
  {
    slug: "guardian-shirin-akter",
    name: "Shirin Akter",
    role: "Guardian",
    roleKey: "guardian",
    relation: "Parent of a student at Monash University, Australia",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&h=560&q=80",
    youtubeId: "e-ORhEE9VVg",
    quote: "The pre-departure support made all the difference.",
    text: [
      "The counsellors prepared not just my daughter but our whole family for the transition. Accommodation, banking, safety — everything was covered.",
      "She settled into Melbourne so smoothly. We are grateful for the ongoing support even after she flew.",
    ],
  },
  {
    slug: "student-tanvir-hossain",
    name: "Tanvir Hossain",
    role: "Student",
    roleKey: "student",
    relation: "MSc Data Science · University of Manchester, UK",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&h=560&q=80",
    youtubeId: "dQw4w9WgXcY",
    quote: "From SOP writing to visa prep, they handled everything.",
    text: [
      "I was confused about which universities matched my profile. The team shortlisted the perfect options and helped me craft a standout SOP.",
      "I received two offers and a scholarship. The visa process was smooth because they prepared me for every question.",
    ],
  },
  {
    slug: "student-fatema-khanam",
    name: "Fatema Khanam",
    role: "Student",
    roleKey: "student",
    relation: "BSc Nursing · Monash University, Australia",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&h=560&q=80",
    youtubeId: "L_jWHffIx5E",
    quote: "They found the perfect nursing programme for me.",
    text: [
      "As a nursing aspirant I had very specific requirements. My counsellor understood them and matched me with the right course and university.",
      "Today I'm studying in Australia and loving it. I couldn't have done it without their guidance.",
    ],
  },
  {
    slug: "student-mohsin-islam",
    name: "Mohsin Islam",
    role: "Student",
    roleKey: "student",
    relation: "MSc Engineering · TU Munich, Germany",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&h=560&q=80",
    youtubeId: "3JZ_D3ELwOQ",
    quote: "Studying in Germany with almost no tuition — a dream come true.",
    text: [
      "Germany was always my dream because of its low tuition and strong engineering programmes. The team guided me through the APS and application process.",
      "Their attention to detail with my documents made the difference. I'm now at TU Munich living that dream.",
    ],
  },
  {
    slug: "student-sumaiya-begum",
    name: "Sumaiya Begum",
    role: "Student",
    roleKey: "student",
    relation: "LLB Law · University of Leeds, UK",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&h=560&q=80",
    youtubeId: "kXYiU_JCYtU",
    quote: "The visa team is exceptional — approved in three weeks.",
    text: [
      "My student visa was approved within three weeks. They knew exactly which documents were needed and how to present them.",
      "Every email was answered quickly. I always felt supported throughout the journey.",
    ],
  },
  {
    slug: "student-arif-rahman",
    name: "Arif Rahman",
    role: "Student",
    roleKey: "student",
    relation: "MBA · NYU, New York, USA",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&h=560&q=80",
    youtubeId: "V-_O7nl0Ii0",
    quote: "Got into my first-choice university with a full scholarship.",
    text: [
      "I aimed high and they helped me get there. Their essay coaching and interview prep were world-class.",
      "A full scholarship to NYU still feels surreal. Their dedication is truly unmatched.",
    ],
  },
  {
    slug: "delegate-james-whitfield",
    name: "James Whitfield",
    role: "Delegate",
    roleKey: "delegate",
    relation: "International Officer · University of Law, UK",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&h=560&q=80",
    youtubeId: "hY7m5jjJ9mM",
    quote: "One of our most reliable recruitment partners in Bangladesh.",
    text: [
      "We've partnered with Education Doorway for several intakes. The students they send are well-prepared and genuinely suited to our programmes.",
      "Their professionalism and document accuracy make our admissions process seamless.",
    ],
  },
  {
    slug: "delegate-maria-santos",
    name: "Maria Santos",
    role: "Delegate",
    roleKey: "delegate",
    relation: "Regional Manager · Asia Pacific University, Malaysia",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&h=560&q=80",
    youtubeId: "Zi_XLOBDo_Y",
    quote: "They truly understand what students and universities need.",
    text: [
      "The counselling quality is excellent. Students arrive informed, motivated and ready to succeed on our campus.",
      "It's a pleasure to work with a team that values integrity as much as we do.",
    ],
  },
  {
    slug: "delegate-david-lee",
    name: "David Lee",
    role: "Delegate",
    roleKey: "delegate",
    relation: "Admissions Delegate · University of Niagara Falls, Canada",
    image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=900&h=560&q=80",
    youtubeId: "fJ9rUzIMcZQ",
    quote: "A trusted bridge between our university and Bangladeshi talent.",
    text: [
      "Every year the calibre of applicants improves. Education Doorway understands our entry requirements and guides students accordingly.",
      "We look forward to growing this partnership for many years to come.",
    ],
  },
];

export const storyBySlug = Object.fromEntries(stories.map((s) => [s.slug, s]));
