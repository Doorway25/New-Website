/** Country-level defaults for university detail tabs. */
const COUNTRY_DEFAULTS = {
  uk: {
    studentLife: [
      "Diverse international campus communities across the UK",
      "Student unions, societies and sports clubs year-round",
      "Part-time work options under Student visa rules (typically up to 20 hrs/week)",
      "Strong careers services and industry networking events",
      "City living with museums, culture and excellent public transport",
    ],
    accommodation: [
      "University halls of residence for first-year students",
      "Private student housing and shared flats near campus",
      "Homestay options through trusted partners in some cities",
      "Support finding housing before you arrive in the UK",
    ],
    campus: [
      "Modern teaching spaces, libraries and labs",
      "Dedicated international student support offices",
      "On-campus cafés, study zones and wellbeing services",
    ],
  },
  malaysia: {
    studentLife: [
      "Affordable living with a vibrant multicultural student scene",
      "Campus clubs, festivals and student leadership opportunities",
      "English-taught programmes with easy travel across ASEAN",
      "Safe, student-friendly cities such as Kuala Lumpur and Cyberjaya",
    ],
    accommodation: [
      "On-campus hostels and university residences",
      "Nearby private apartments at competitive rates",
      "Shared housing popular with international students",
      "Assistance with booking rooms before arrival",
    ],
    campus: [
      "Modern campuses with labs, studios and libraries",
      "Industry-linked facilities for practical learning",
      "International student centres and counselling",
    ],
  },
  australia: {
    studentLife: [
      "Outdoor lifestyle with beaches, parks and a strong sports culture",
      "Active student associations and multicultural communities",
      "Post-study work pathways after eligible programmes",
      "Part-time work opportunities during study",
    ],
    accommodation: [
      "University residential colleges and apartments",
      "Homestay programmes for new arrivals",
      "Shared houses and private rentals near campus",
    ],
    campus: [
      "Research-led facilities and collaborative learning spaces",
      "Career hubs and internship support",
      "Health and wellbeing services on campus",
    ],
  },
  canada: {
    studentLife: [
      "Welcoming, multicultural campuses across Canada",
      "Co-op and internship opportunities on many programmes",
      "Safe cities with strong student support networks",
      "Clear post-graduation work permit pathways for eligible grads",
    ],
    accommodation: [
      "On-campus residences for first-year students",
      "Off-campus apartments and shared housing",
      "Homestay options in selected cities",
    ],
    campus: [
      "Modern classrooms, labs and innovation hubs",
      "International advising and orientation programmes",
      "Recreation centres and student commons",
    ],
  },
  usa: {
    studentLife: [
      "Campus traditions, clubs and intramural sports",
      "Diverse student bodies and active international offices",
      "Career fairs and on-campus recruiting",
      "Optional Practical Training (OPT) pathways for eligible grads",
    ],
    accommodation: [
      "On-campus dormitories and apartments",
      "Off-campus housing near campus",
      "Residence life support for first-year students",
    ],
    campus: [
      "Libraries, labs and student success centres",
      "Health clinics and counselling services",
      "Career and writing centres",
    ],
  },
  germany: {
    studentLife: [
      "English-taught programmes in international cities",
      "Strong student discounts on transport and culture",
      "Internship culture linked to industry",
      "Affordable living compared with many other EU hubs",
    ],
    accommodation: [
      "Student residences where available",
      "Shared flats (WG) popular with students",
      "Support finding housing through university partners",
    ],
    campus: [
      "Applied-sciences facilities and project labs",
      "International offices and German language support",
      "Career services with employer networks",
    ],
  },
  uae: {
    studentLife: [
      "Global campus feel in Dubai and other UAE cities",
      "Safe, modern cities with world-class amenities",
      "Networking with regional and international employers",
      "Multicultural student communities",
    ],
    accommodation: [
      "University residences and partner student housing",
      "Private apartments near campus corridors",
      "Assistance arranging short-term stay on arrival",
    ],
    campus: [
      "Contemporary campuses with digital classrooms",
      "Industry guest lectures and career events",
      "Student lounges and study spaces",
    ],
  },
  default: {
    studentLife: [
      "Welcoming international student community",
      "Clubs, societies and campus events",
      "Careers guidance and employability workshops",
      "Orientation and settling-in support for new arrivals",
    ],
    accommodation: [
      "On-campus or partner student residences",
      "Private rentals and shared housing near campus",
      "Guidance on booking before you travel",
    ],
    campus: [
      "Teaching spaces, libraries and study zones",
      "International student support desk",
      "Wellbeing and academic skills services",
    ],
  },
};

const UNI_OVERRIDES = {
  "taylors-university": {
    studentLife: [
      "Lakeside Campus lifestyle with clubs, sports and student leadership",
      "Strong international community and hospitality industry networking",
      "Career fairs and internship pathways across Klang Valley",
      "Student wellbeing, counselling and academic skills support",
    ],
    accommodation: [
      "On-campus and partner residences near Subang Jaya",
      "Private apartments and shared housing around Bandar Sunway / Subang",
      "Support booking rooms before arrival in Malaysia",
    ],
    campus: [
      "Modern Lakeside Campus with specialist teaching facilities",
      "Libraries, labs, design studios and learning commons",
      "International student centre and counselling services",
    ],
  },
  "sunway-university": {
    studentLife: [
      "Integrated township living with malls, parks and campus events",
      "Active clubs, volunteering and entrepreneurship activities",
      "Lancaster University academic collaboration benefits",
      "Easy access to Kuala Lumpur via BRT and highways",
    ],
    accommodation: [
      "Sunway-managed and partner student residences",
      "Private apartments within Bandar Sunway",
      "Shared flats popular with international students",
    ],
    campus: [
      "Contemporary teaching blocks and research facilities",
      "Library, labs and collaborative study spaces",
      "Student services and international office support",
    ],
  },
  apu: {
    studentLife: [
      "Tech-focused campus culture with hackathons and innovation clubs",
      "Industry projects with Malaysia's digital and cyber security firms",
      "Diverse international cohort across computing and business",
      "Career bootcamps and employer networking events",
    ],
    accommodation: [
      "Partner hostels and apartments near Technology Park Malaysia",
      "Shared housing options around Bukit Jalil / Kuala Lumpur",
      "Arrival housing guidance for new international students",
    ],
    campus: [
      "Smart campus with specialised computing and engineering labs",
      "Innovation hubs and collaborative studios",
      "International student support and counselling",
    ],
  },
  "segi-university": {
    studentLife: [
      "Large private-university community with healthcare and business focus",
      "Student societies, clinical exposure and volunteering",
      "Multicultural campus life in Kota Damansara",
      "Career guidance for professional and health pathways",
    ],
    accommodation: [
      "Nearby student residences and apartments in Kota Damansara",
      "Shared housing and private rentals around Petaling Jaya",
      "Help comparing options before you travel",
    ],
    campus: [
      "Teaching facilities for medicine, dentistry and health sciences",
      "Libraries, labs and simulation suites",
      "International student advising services",
    ],
  },
  "mahsa-university": {
    studentLife: [
      "Healthcare-centred campus community and clinical placements",
      "Student clubs in medicine, nursing and allied health",
      "Supportive environment for international health students",
      "Career preparation for hospital and clinical pathways",
    ],
    accommodation: [
      "Campus hostels and nearby private residences in Jenjarom / Bandar Saujana Putra",
      "Shared apartments for senior students",
      "Pre-arrival housing assistance",
    ],
    campus: [
      "Modern healthcare teaching facilities and labs",
      "Simulation centres and learning resources",
      "International office and student counselling",
    ],
  },
  "inti-international-university": {
    studentLife: [
      "American Degree Transfer and global pathway opportunities",
      "Industry visits, internships and employability workshops",
      "Active clubs across business, engineering and computing",
      "Green Nilai campus with a strong international mix",
    ],
    accommodation: [
      "On-campus residences and hostels in Nilai",
      "Private apartments near campus and nearby townships",
      "Shared housing guidance for international arrivals",
    ],
    campus: [
      "Teaching labs, studios and business learning spaces",
      "Library and collaborative study areas",
      "International student centre and visa guidance support",
    ],
  },
  "university-of-cyberjaya": {
    studentLife: [
      "Study in Malaysia's planned tech city with a calm campus setting",
      "Health-sciences community with clinical and research exposure",
      "Student societies, wellbeing programmes and peer mentoring",
      "Convenient access to KL via major highways and transit links",
    ],
    accommodation: [
      "University residences and partner housing in Cyberjaya",
      "Private apartments popular with medical and pharmacy students",
      "Shared flats with flexible lease options",
    ],
    campus: [
      "Specialist facilities for medicine, pharmacy and health sciences",
      "Labs, libraries and simulation environments",
      "International student support services",
    ],
  },
  "raffles-university-malaysia": {
    studentLife: [
      "Creative and business-focused campus culture in Johor Bahru",
      "Studio critiques, design showcases and industry projects",
      "Close to Singapore for networking and weekend travel",
      "Supportive international student community",
    ],
    accommodation: [
      "Nearby private residences and shared apartments in Johor Bahru",
      "Guidance on housing close to campus and transport links",
      "Arrival support for new international students",
    ],
    campus: [
      "Design studios, workshops and business classrooms",
      "Learning resource centre and collaborative spaces",
      "Student services and international advising",
    ],
  },
  "middlesex-university-london": {
    studentLife: [
      "Hendon campus community with a large international student body",
      "Active student union, societies and volunteering opportunities",
      "London living — culture, networking and part-time job options",
      "Career-focused events with UK employers and alumni",
      "Wellbeing, disability and academic skills support on campus",
    ],
    accommodation: [
      "Partner student residences near Hendon and north London",
      "Private halls and shared flats across Zone 3–4",
      "Help comparing contracts, deposits and travel times to campus",
      "Short-term arrival housing guidance for new international students",
    ],
    campus: [
      "Modern Hendon campus with specialist studios and labs",
      "Library, learning hubs and quiet study areas",
      "International student advice and visa support teams",
    ],
  },
  "university-of-law": {
    studentLife: [
      "Specialist legal community with mooting and pro-bono opportunities",
      "Networking with law firms and chambers",
      "Study hubs across multiple UK locations including London",
      "Career clinics focused on solicitor and barrister pathways",
    ],
    accommodation: [
      "Guidance on student housing near your chosen campus city",
      "Private student residences popular with ULaw cohorts",
      "Shared flats for postgraduate and LPC/SQE students",
    ],
  },
};

export function buildUniversityDetails(uni, country) {
  const defaults = COUNTRY_DEFAULTS[uni.country] || COUNTRY_DEFAULTS.default;
  const override = UNI_OVERRIDES[uni.slug] || {};

  const countryLabel = country?.name
    ? country.name.length <= 3
      ? country.name.toUpperCase()
      : country.name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  return {
    overview: {
      body:
        uni.overview ||
        `${uni.name} is a partner institution supported by Education Doorway for international applications.`,
      highlights: [
        `Located in ${uni.city}${countryLabel ? `, ${countryLabel}` : ""}`,
        `Tuition from $${Number(uni.feeFrom || 0).toLocaleString()} / year (indicative)`,
        `${uni.programs?.length || 0} study levels available`,
        `${uni.subjects?.length || 0} course areas offered`,
        `${uni.intakes?.length || 0} intake periods each year`,
      ],
    },
    programmes: {
      levels: uni.programs || [],
      subjects: uni.subjects || [],
      intakes: uni.intakes || [],
    },
    studentLife: uni.studentLife?.length
      ? uni.studentLife
      : override.studentLife || defaults.studentLife,
    accommodation: uni.accommodation?.length
      ? uni.accommodation
      : override.accommodation || defaults.accommodation,
    campus: uni.campus?.length ? uni.campus : override.campus || defaults.campus,
  };
}
