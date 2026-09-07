/** Extra UK partner universities (batch 2) */

import { ukPartnerLogoBySlug } from "./ukPartnerLogos.js";

const D = {
  standard: ["Academic certificates & transcripts", "English Proficiency", "Passport", "Photo", "CV", "Financial support"],
};

const UK_IMG = [
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&h=520&q=58",
  "https://images.unsplash.com/photo-1486299267070-83823fcee8bc?auto=format&fit=crop&w=800&h=520&q=58",
  "https://images.unsplash.com/photo-1526129313331-aa19dcee6eea?auto=format&fit=crop&w=800&h=520&q=58",
  "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=800&h=520&q=58",
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&h=520&q=58",
  "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&h=520&q=58",
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&h=520&q=58",
  "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=800&h=520&q=58",
];

function imgFor(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h + slug.charCodeAt(i) * (i + 1)) % UK_IMG.length;
  return UK_IMG[h];
}

function logoFor(name) {
  const initials = String(name || "U")
    .replace(/[()]/g, "")
    .split(/\s+/)
    .filter((w) => w && !/^(of|the|and|university|college|school)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "U";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=256&background=0d157b&color=ffffff&bold=true&format=png`;
}

export function uk(entry) {
  return {
    ...entry,
    country: "uk",
    programs: entry.programs || ["foundation", "undergraduate", "postgraduate"],
    intakes: entry.intakes || ["January", "September"],
    upcoming: entry.upcoming || ["September"],
    docs: entry.docs || D.standard,
    imageUrl: entry.imageUrl || imgFor(entry.slug),
    logoUrl: entry.logoUrl || ukPartnerLogoBySlug[entry.slug] || logoFor(entry.name),
  };
}

export const ukUniversitiesExtra = [
  uk({
    slug: "bangor-university",
    name: "Bangor University",
    city: "Bangor",
    feeFrom: 17500,
    subjects: ["Ocean Sciences", "Psychology", "Business", "Law", "Education", "Health Sciences", "Arts", "Computing & Technology"],
    overview:
      "Bangor University sits between mountains and the sea in North Wales, known for ocean sciences, psychology and a supportive, scenic campus experience for international students.",
  }),
  uk({
    slug: "st-marys-university-london",
    name: "St Mary's University, London",
    city: "Twickenham, London",
    feeFrom: 16500,
    subjects: ["Education", "Sport Science", "Business", "Law", "Theology", "Psychology", "Creative Arts", "Health Sciences"],
    overview:
      "St Mary's is a friendly London university in Twickenham with strengths in education, sport and the humanities, offering a close community feel with easy access to central London.",
  }),
  uk({
    slug: "cardiff-metropolitan-university",
    name: "Cardiff Metropolitan University",
    city: "Cardiff",
    feeFrom: 16000,
    subjects: ["Art & Design", "Business", "Sport Science", "Education", "Tourism & Hospitality", "Health Sciences", "Computing & Technology"],
    overview:
      "Cardiff Met focuses on practice-based learning in design, sport, education and business across Cardiff campuses, with strong links to Welsh industry and creative employers.",
  }),
  uk({
    slug: "arts-university-bournemouth",
    name: "Arts University Bournemouth",
    city: "Bournemouth",
    feeFrom: 18500,
    subjects: ["Art & Design", "Fashion", "Film", "Animation", "Architecture", "Photography", "Creative Arts"],
    overview:
      "AUB is a specialist creative university on the south coast, renowned for art, design, film and performance with industry-standard studios and a tightly focused creative community.",
  }),
  uk({
    slug: "soas-university-of-london",
    name: "SOAS University of London",
    city: "London",
    feeFrom: 21000,
    subjects: ["International Relations", "Law", "Politics", "Economics", "Languages", "Anthropology", "Development Studies", "Arts"],
    overview:
      "SOAS is the University of London’s specialist institution for Asia, Africa and the Middle East, offering world-leading programmes in languages, politics, law and development.",
  }),
  uk({
    slug: "bath-spa-university",
    name: "Bath Spa University",
    city: "Bath",
    feeFrom: 16500,
    subjects: ["Creative Arts", "Education", "Business", "Psychology", "Biology", "Music", "Writing", "Design"],
    overview:
      "Bath Spa combines creative and professional degrees with beautiful campuses around Bath, popular for art, education, writing and the performing arts.",
  }),
  uk({
    slug: "coventry-university",
    name: "Coventry University",
    city: "Coventry",
    feeFrom: 17500,
    subjects: ["Engineering", "Business", "Design", "Health Sciences", "Computing & Technology", "Media", "Law", "Architecture"],
    overview:
      "Coventry is a large modern university known for employability, engineering, design and health, with a lively city-centre campus and global network of study locations.",
  }),
  uk({
    slug: "bournemouth-university",
    name: "Bournemouth University",
    city: "Bournemouth",
    feeFrom: 17500,
    subjects: ["Media", "Tourism & Hospitality", "Business", "Health Sciences", "Computing & Technology", "Engineering", "Psychology"],
    overview:
      "Bournemouth University is recognised for media, tourism and professional placements, set in a popular coastal town with strong industry connections.",
  }),
  uk({
    slug: "canterbury-christ-church-university",
    name: "Canterbury Christ Church University",
    city: "Canterbury",
    feeFrom: 15500,
    subjects: ["Education", "Health Sciences", "Nursing & Midwifery", "Business", "Arts", "Policing", "Psychology", "Theology"],
    overview:
      "CCCU offers career-focused degrees in education, health and the public sector from its historic Canterbury base, with additional campuses across Kent.",
  }),
  uk({
    slug: "goldsmiths-university-of-london",
    name: "Goldsmiths, University of London",
    city: "London",
    feeFrom: 20000,
    subjects: ["Art & Design", "Media", "Computing & Technology", "Psychology", "Sociology", "Music", "Politics", "Creative Arts"],
    overview:
      "Goldsmiths is a creative and socially engaged University of London college in New Cross, famous for art, design, media, computing and the social sciences.",
  }),
  uk({
    slug: "university-of-brighton",
    name: "University of Brighton",
    city: "Brighton",
    feeFrom: 16500,
    subjects: ["Art & Design", "Business", "Health Sciences", "Engineering", "Education", "Sport Science", "Computing & Technology"],
    overview:
      "Brighton combines creative campus culture with professional degrees in health, design and business, in one of the UK’s most vibrant coastal cities.",
  }),
  uk({
    slug: "kingston-university",
    name: "Kingston University",
    city: "Kingston upon Thames, London",
    feeFrom: 17000,
    subjects: ["Art & Design", "Business", "Engineering", "Health Sciences", "Law", "Computing & Technology", "Architecture"],
    overview:
      "Kingston University is known for design, business and engineering, with riverside campuses southwest of London and strong creative industry links.",
  }),
  uk({
    slug: "university-of-derby",
    name: "University of Derby",
    city: "Derby",
    feeFrom: 15500,
    subjects: ["Business", "Engineering", "Health Sciences", "Arts", "Education", "Sport Science", "Computing & Technology", "Law"],
    overview:
      "Derby focuses on applied learning and employability across business, engineering and health, with modern facilities in the East Midlands.",
  }),
  uk({
    slug: "university-of-greenwich",
    name: "University of Greenwich",
    city: "London",
    feeFrom: 17000,
    subjects: ["Business", "Engineering", "Architecture", "Computing & Technology", "Law", "Education", "Health Sciences", "Science"],
    overview:
      "Greenwich offers a striking maritime campus by the Thames plus Medway sites, with popular programmes in business, engineering, architecture and computing.",
  }),
  uk({
    slug: "university-of-huddersfield",
    name: "University of Huddersfield",
    city: "Huddersfield",
    feeFrom: 16000,
    subjects: ["Business", "Engineering", "Music", "Health Sciences", "Art & Design", "Computing & Technology", "Law", "Education"],
    overview:
      "Huddersfield is TEF Gold-rated for teaching excellence, with strengths in business, engineering, music and health in a welcoming Yorkshire town setting.",
  }),
  uk({
    slug: "leeds-arts-university",
    name: "Leeds Arts University",
    city: "Leeds",
    feeFrom: 17500,
    subjects: ["Art & Design", "Fashion", "Graphics", "Animation", "Fine Art", "Creative Arts", "Photography"],
    overview:
      "Leeds Arts University is a specialist creative institution delivering focused art and design degrees in one of the UK’s major cultural cities.",
  }),
  uk({
    slug: "norwich-university-of-the-arts",
    name: "Norwich University of the Arts",
    city: "Norwich",
    feeFrom: 17000,
    subjects: ["Art & Design", "Games", "Film", "Fashion", "Architecture", "Photography", "Creative Arts"],
    overview:
      "NUA is a specialist arts university in Norwich’s creative quarter, known for games, design, film and architecture with strong studio culture.",
  }),
  uk({
    slug: "de-montfort-university",
    name: "De Montfort University",
    city: "Leicester",
    feeFrom: 16000,
    subjects: ["Art & Design", "Business", "Law", "Computing & Technology", "Engineering", "Health Sciences", "Media"],
    overview:
      "DMU in Leicester is known for design, technology and business programmes, with a modern city campus and international student community.",
  }),
  uk({
    slug: "london-south-bank-university",
    name: "London South Bank University",
    city: "London",
    feeFrom: 16500,
    subjects: ["Engineering", "Business", "Health Sciences", "Law", "Computing & Technology", "Architecture", "Built Environment"],
    overview:
      "LSBU is a practical London university near Elephant & Castle, strong in engineering, health, business and the built environment with employer-focused teaching.",
  }),
  uk({
    slug: "birmingham-city-university",
    name: "Birmingham City University",
    city: "Birmingham",
    feeFrom: 16500,
    subjects: ["Art & Design", "Business", "Health Sciences", "Law", "Computing & Technology", "Media", "Music", "Architecture"],
    overview:
      "BCU delivers career-oriented degrees across Birmingham campuses, with notable strengths in art & design, health, business and creative industries.",
  }),
  uk({
    slug: "university-of-east-london",
    name: "University of East London",
    city: "London",
    feeFrom: 15500,
    subjects: ["Business", "Psychology", "Health Sciences", "Computing & Technology", "Architecture", "Sports", "Arts", "Law"],
    overview:
      "UEL serves a diverse London community with campuses in Stratford and Docklands, offering accessible routes into business, psychology, health and creative subjects.",
  }),
  uk({
    slug: "university-of-westminster",
    name: "University of Westminster",
    city: "London",
    feeFrom: 17500,
    subjects: ["Media", "Business", "Architecture", "Law", "Computing & Technology", "Arts", "Politics", "Fashion"],
    overview:
      "Westminster combines central London campuses with strengths in media, architecture, business and politics — ideal for students seeking a capital-city experience.",
  }),
  uk({
    slug: "brunel-university-london",
    name: "Brunel University of London",
    city: "Uxbridge, London",
    feeFrom: 19000,
    subjects: ["Engineering", "Business", "Design", "Sport Science", "Health Sciences", "Computing & Technology", "Law"],
    overview:
      "Brunel is known for engineering, design and sport sciences on a self-contained west London campus, with a strong sandwich-year and industry placement culture.",
  }),
  uk({
    slug: "anglia-ruskin-university",
    name: "Anglia Ruskin University - ARU",
    city: "Cambridge",
    feeFrom: 16000,
    subjects: ["Business", "Health Sciences", "Art & Design", "Law", "Computing & Technology", "Education", "Medicine", "Psychology"],
    overview:
      "ARU has campuses in Cambridge, Chelmsford and beyond, offering practical degrees in business, health, creative arts and law with a large international cohort.",
  }),
  uk({
    slug: "london-metropolitan-university",
    name: "London Metropolitan University",
    city: "London",
    feeFrom: 15000,
    subjects: ["Business", "Art & Design", "Law", "Computing & Technology", "Social Sciences", "Health Sciences", "Architecture"],
    overview:
      "London Met provides affordable London study options across Islington and Aldgate campuses, with flexible routes into business, art, law and the social sciences.",
  }),
  uk({
    slug: "university-of-roehampton",
    name: "University of Roehampton",
    city: "London",
    feeFrom: 15500,
    subjects: ["Business", "Psychology", "Education", "Dance", "Life Sciences", "Media", "Social Sciences"],
    overview:
      "Roehampton offers a parkland campus in south-west London with strengths in education, psychology, dance and business, plus a strong student support ethos.",
  }),
  uk({
    slug: "university-for-the-creative-arts",
    name: "University for the Creative Arts",
    city: "Farnham",
    feeFrom: 17500,
    subjects: ["Art & Design", "Fashion", "Architecture", "Film", "Games", "Photography", "Creative Arts"],
    overview:
      "UCA is a specialist creative arts university with campuses across southern England, focused on fashion, design, architecture, film and digital creativity.",
  }),
  uk({
    slug: "university-of-buckingham",
    name: "The University of Buckingham",
    city: "Buckingham",
    feeFrom: 20000,
    subjects: ["Business", "Law", "Medicine", "Psychology", "Computing & Technology", "Politics", "Education"],
    overview:
      "Buckingham is the UK’s first private university, known for intensive two-year degrees, small class sizes and programmes in business, law and medicine.",
  }),
  uk({
    slug: "bimm-university",
    name: "BIMM University",
    city: "Brighton",
    feeFrom: 16500,
    subjects: ["Music", "Creative Arts", "Film", "Event Management", "Performing Arts", "Business"],
    overview:
      "BIMM University specialises in contemporary music, performance and creative industries training across multiple UK cities including Brighton, London and Manchester.",
  }),
  uk({
    slug: "birkbeck-university-of-london",
    name: "Birkbeck, University of London",
    city: "London",
    feeFrom: 17000,
    subjects: ["Law", "Business", "Psychology", "Arts", "Computing & Technology", "Politics", "Science"],
    overview:
      "Birkbeck is the University of London’s evening-study specialist in Bloomsbury, ideal for flexible undergraduate and postgraduate study alongside work.",
  }),
  uk({
    slug: "bpp-university",
    name: "BPP University",
    city: "London",
    feeFrom: 16000,
    subjects: ["Law", "Business", "Accounting", "Finance", "Health Sciences", "Psychology"],
    overview:
      "BPP University focuses on professional qualifications in law, business, accounting and health, with city-centre study centres across the UK.",
  }),
  uk({
    slug: "cambridge-school-of-visual-performing-arts",
    name: "Cambridge School of Visual & Performing Arts",
    city: "Cambridge",
    feeFrom: 22000,
    subjects: ["Art & Design", "Drama", "Music", "Fashion", "Creative Arts", "Foundation Art"],
    overview:
      "CSVPA delivers specialist art, design and performing arts education in Cambridge, including foundation and degree pathways for creative international students.",
  }),
  uk({
    slug: "glasgow-school-of-art",
    name: "Glasgow School of Art",
    city: "Glasgow",
    feeFrom: 22000,
    subjects: ["Art & Design", "Architecture", "Fine Art", "Design", "Digital Design", "Creative Arts"],
    overview:
      "The Glasgow School of Art is one of Europe’s leading independent art schools, offering rigorous programmes in fine art, design and architecture.",
  }),
  uk({
    slug: "institute-of-contemporary-music-performance",
    name: "Institute of Contemporary Music Performance",
    city: "London",
    feeFrom: 17000,
    subjects: ["Music", "Creative Arts", "Music Business", "Songwriting", "Production", "Performance"],
    overview:
      "ICMP is a specialist contemporary music school in London focused on performance, production, songwriting and the music business.",
  }),
  uk({
    slug: "university-of-oxford-lifelong-learning",
    name: "University of Oxford Lifelong Learning",
    city: "Oxford",
    feeFrom: 12000,
    programs: ["undergraduate", "postgraduate", "diploma"],
    subjects: ["Arts", "History", "Literature", "Local History", "Creative Writing", "Archaeology", "Philosophy"],
    overview:
      "Oxford’s Department for Continuing Education offers flexible undergraduate, postgraduate and short-course pathways for lifelong learners worldwide.",
  }),
  uk({
    slug: "regents-university-london",
    name: "Regent's University London",
    city: "London",
    feeFrom: 21000,
    subjects: ["Business", "Fashion", "Psychology", "Film", "Politics", "Marketing", "Interior Design"],
    overview:
      "Regent’s is a private university in Regent’s Park offering an international campus experience with strengths in business, fashion, psychology and the creative arts.",
  }),
  uk({
    slug: "royal-college-of-art",
    name: "Royal College of Art",
    city: "London",
    feeFrom: 32000,
    programs: ["postgraduate", "phd"],
    subjects: ["Art & Design", "Architecture", "Fashion", "Communication", "Design Engineering", "Fine Art"],
    overview:
      "The RCA is the world’s leading postgraduate art and design university, offering master’s and research degrees across art, design, architecture and innovation.",
  }),
  uk({
    slug: "royal-conservatoire-of-scotland",
    name: "Royal Conservatoire of Scotland",
    city: "Glasgow",
    feeFrom: 23000,
    subjects: ["Music", "Drama", "Dance", "Production", "Film", "Performing Arts"],
    overview:
      "RCS is Scotland’s national conservatoire for music, drama, dance, production and film, training performers and creatives to a professional standard.",
  }),
  uk({
    slug: "southampton-solent-university",
    name: "Southampton Solent University",
    city: "Southampton",
    feeFrom: 15500,
    subjects: ["Maritime", "Business", "Media", "Sport Science", "Art & Design", "Computing & Technology", "Law"],
    overview:
      "Solent University is known for maritime, media, sport and business programmes in Southampton, with a practical, career-led teaching style.",
  }),
  uk({
    slug: "qa-higher-education-ulster",
    name: "QA Higher Education / Ulster University (London, Birmingham and Manchester)",
    city: "London",
    feeFrom: 15500,
    subjects: ["Business", "Computing & Technology", "Accounting", "Health Sciences", "Engineering", "Law"],
    overview:
      "QA Higher Education partners with Ulster University to deliver UK degree programmes in London, Birmingham and Manchester with flexible intakes and career-focused pathways.",
  }),
  uk({
    slug: "university-of-london",
    name: "University of London",
    city: "London",
    feeFrom: 18000,
    subjects: ["Law", "Business", "Economics", "Politics", "Computing & Technology", "Arts", "Science"],
    overview:
      "The University of London is a federal university offering world-recognised degrees through its member institutions and flexible online and campus study options.",
  }),
  uk({
    slug: "middlesex-university-london",
    name: "Middlesex University London",
    city: "London",
    feeFrom: 15000,
    subjects: ["Business", "Computing & Technology", "Nursing & Midwifery", "Law", "Creative Arts", "Psychology", "Education"],
    overview:
      "Middlesex University London is a modern, career-focused university in Hendon with strong industry links and a diverse international community.",
  }),
  uk({
    slug: "university-of-law",
    name: "The University of Law (ULaw)",
    city: "London",
    feeFrom: 16000,
    subjects: ["Law", "Business", "Finance", "Psychology", "Management", "Policing"],
    overview:
      "The University of Law is one of the UK’s longest-established specialist providers of legal education and training, with a growing portfolio of business programmes.",
  }),
  uk({
    slug: "arden-university",
    name: "Arden University",
    city: "Coventry",
    feeFrom: 13500,
    subjects: ["Business", "Computing & Technology", "Law", "Psychology", "Health Sciences", "Accounting"],
    overview:
      "Arden University offers flexible undergraduate and postgraduate degrees designed for career-focused students, with blended and online study options across the UK.",
  }),
  uk({
    slug: "buckinghamshire-new-university",
    name: "Buckinghamshire New University",
    city: "High Wycombe",
    feeFrom: 14000,
    subjects: ["Business", "Aviation", "Nursing & Midwifery", "Creative Arts", "Sport Science", "Computing & Technology"],
    overview:
      "Buckinghamshire New University (Bucks) is a practice-focused institution known for aviation, nursing, creative industries and applied business programmes.",
  }),
  uk({
    slug: "regent-college-london",
    name: "Regent College London",
    city: "London",
    feeFrom: 12500,
    subjects: ["Business", "Health Sciences", "Computing & Technology", "Accounting", "Education"],
    overview:
      "Regent College London delivers career-oriented higher education pathways in business, health and technology across multiple London campuses.",
  }),
  uk({
    slug: "leeds-beckett-university",
    name: "Leeds Beckett University",
    city: "Leeds",
    feeFrom: 15000,
    subjects: ["Business", "Sport Science", "Computing & Technology", "Law", "Creative Arts", "Health Sciences", "Education"],
    overview:
      "Leeds Beckett University is a large civic university in Yorkshire with strong links to industry, sport, business and the creative professions.",
  }),
  uk({
    slug: "wrexham-university",
    name: "Wrexham University",
    city: "Wrexham",
    feeFrom: 13000,
    subjects: ["Business", "Engineering", "Health Sciences", "Computing & Technology", "Creative Arts", "Sport Science"],
    overview:
      "Wrexham University (Prifysgol Wrecsam) is a student-focused Welsh university offering applied degrees with strong employability and industry engagement.",
  }),
  uk({
    slug: "bloomsbury-institute-london",
    name: "Bloomsbury Institute London",
    city: "London",
    feeFrom: 12000,
    subjects: ["Business", "Law", "Accounting", "Management"],
    overview:
      "Bloomsbury Institute London is a specialist higher education provider in central London focused on business, law and accounting programmes.",
  }),
  uk({
    slug: "health-sciences-university",
    name: "Health Sciences University",
    city: "Bournemouth",
    feeFrom: 14500,
    subjects: ["Health Sciences", "Physiotherapy", "Chiropractic", "Sport Science", "Psychology"],
    overview:
      "Health Sciences University (HSU) specialises in health, rehabilitation and clinical education, preparing students for careers in allied health professions.",
  }),
  uk({
    slug: "university-of-winchester",
    name: "University of Winchester",
    city: "Winchester",
    feeFrom: 14500,
    subjects: ["Education", "Business", "Arts", "Psychology", "Sport Science", "History", "Law"],
    overview:
      "The University of Winchester is a values-driven university in a historic cathedral city, known for education, humanities, business and sport.",
  }),
  uk({
    slug: "lincoln-bishop-university",
    name: "Lincoln Bishop University",
    city: "Lincoln",
    feeFrom: 13500,
    subjects: ["Education", "Business", "Health Sciences", "Psychology", "Sport Science", "Theology"],
    overview:
      "Lincoln Bishop University (formerly Bishop Grosseteste) is a compact campus university in Lincoln with a strong reputation for education and applied social sciences.",
  }),
  uk({
    slug: "into-university-partnerships",
    name: "INTO University Partnerships",
    city: "London",
    feeFrom: 16000,
    subjects: ["Foundation", "Business", "Engineering", "Science", "Computing & Technology"],
    overview:
      "INTO partners with leading UK universities to deliver pathway, foundation and pre-master’s programmes that prepare international students for degree study.",
  }),
  uk({
    slug: "oxford-international",
    name: "Oxford International",
    city: "London",
    feeFrom: 14000,
    subjects: ["Foundation", "Business", "Computing & Technology", "English", "Pathways"],
    overview:
      "Oxford International provides pathway programmes, English language courses and university progression routes for international students across the UK.",
  }),
];
