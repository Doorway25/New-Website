/**
 * Ensure CMS page rows exist for listing SEO (safe to re-run).
 * Usage from backend/: node scripts/ensure-seo-pages.js
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PAGES = [
  { slug: "home", title: "Home", subtitle: "Trusted Path to Study Abroad", eyebrow: "Study Abroad" },
  { slug: "about-us", title: "About Us", subtitle: "Your trusted path to study abroad", eyebrow: "Our Story" },
  { slug: "contact-us", title: "Contact Us", subtitle: "Talk to our counsellors", eyebrow: "Get in touch" },
  { slug: "apply-now", title: "Apply Now", subtitle: "Start your application", eyebrow: "Admissions" },
  { slug: "study", title: "Study Abroad", subtitle: "Browse partner universities worldwide", eyebrow: "Universities", metaTitle: "University Finder | Education Doorway", metaDescription: "Filter universities by country, programme and course." },
  { slug: "countries", title: "Study Destinations", subtitle: "Explore countries we support", eyebrow: "Destinations" },
  { slug: "courses", title: "Course Finder", subtitle: "Find your course and academic level", eyebrow: "Courses", metaTitle: "Course Finder | Education Doorway", metaDescription: "Find your course and academic level with Education Doorway." },
  { slug: "articles", title: "Articles", subtitle: "Guides and insights for studying abroad", eyebrow: "Resources" },
  { slug: "events", title: "Events", subtitle: "Fairs, webinars and counselling days", eyebrow: "Upcoming" },
  { slug: "stories", title: "Video Stories", subtitle: "Real journeys from students and families", eyebrow: "Success" },
  { slug: "study-in-uk", title: "Study in UK", subtitle: "UK universities and pathways", eyebrow: "United Kingdom", metaTitle: "Study in UK | Education Doorway", metaDescription: "Explore UK universities and study pathways." },
  { slug: "team", title: "Our Team", subtitle: "Meet the people behind Education Doorway", eyebrow: "About", metaTitle: "Our Team | Education Doorway", metaDescription: "Meet the Education Doorway team." },
];

async function main() {
  for (const page of PAGES) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      create: {
        ...page,
        published: true,
        body: page.subtitle || "",
        metaTitle: page.metaTitle || `${page.title} | Education Doorway`,
        metaDescription: page.metaDescription || page.subtitle || "",
      },
      update: {
        // Only fill empty SEO — do not overwrite admin edits
      },
    });
    const existing = await prisma.page.findUnique({ where: { slug: page.slug } });
    if (existing && !existing.metaTitle) {
      await prisma.page.update({
        where: { slug: page.slug },
        data: {
          metaTitle: page.metaTitle || `${page.title} | Education Doorway`,
          metaDescription: existing.metaDescription || page.metaDescription || page.subtitle || "",
        },
      });
    }
    console.log("ok", page.slug);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
