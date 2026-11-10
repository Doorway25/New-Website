/**
 * Fallback Doorcast content when CMS (/api/public/doorcast) is unavailable.
 * Prefer Admin → Doorcast (hero, playlists sync, episodes/shorts).
 */
export const doorcastMeta = {
  title: "DOORCAST",
  tagline: "Beyond the Conversation. Into Your Future.",
  presentedBy: "EDUCATION DOORWAY",
  about:
    "A platform for real conversations, expert insights, inspiring success stories, and global education opportunities. We bring industry leaders, university representatives, and student voices together to help you make informed decisions about your future.",
  shortsIntro: "Watch the youtube shorts to know the key points of the full episode",
  /** Full episodes playlist — “Play all one by one” opens this on YouTube */
  playlistUrl: "https://www.youtube.com/playlist?list=PLTxqWjoR7G9A",
  /** Shorts playlist — “More video stories” opens this on YouTube */
  shortsPlaylistUrl: "https://www.youtube.com/playlist?list=PLPX4VGzg8TQo",
};

/** Full-length episodes (16:9) */
export const doorcastEpisodes = [
  {
    id: "featured",
    title: "Study in Malaysia?",
    youtubeId: "",
    duration: "56 Min",
    description: "Real conversation on opportunities, costs, and pathways for international students in Malaysia.",
  },
];

/** Vertical shorts for the bottom carousel */
export const doorcastShorts = [
  {
    id: "short-1",
    title: "What opportunities await International students?",
    subtitle: "University of Hertfordshire",
    youtubeId: "",
  },
  {
    id: "short-2",
    title: "How to Find UK Scholarships & Apply?",
    subtitle: "Scholarship tips",
    youtubeId: "",
  },
  {
    id: "short-3",
    title: "Quick Offer Letter - Faster UK Visa?",
    subtitle: "Visa pathway",
    youtubeId: "",
  },
  {
    id: "short-4",
    title: "Malaysia vs UK — which fits you?",
    subtitle: "Destination guide",
    youtubeId: "",
  },
  {
    id: "short-5",
    title: "Documents you need before applying",
    subtitle: "Application checklist",
    youtubeId: "",
  },
];
