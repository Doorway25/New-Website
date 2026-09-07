import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  company,
  stats,
  branches,
  pillars,
  programs,
  subjects,
  popularSubjects,
  countries,
  countryBySlug,
  cityImage,
  universities,
  partners,
  services,
  whyUs,
  testimonials,
  articles,
  events,
  storyCategories,
  stories,
} from "../../src/data/site.js";
import { legalBySlug } from "../../src/data/legal.js";
import { buildUniversityDetails } from "../../src/data/universityDetails.js";

const prisma = new PrismaClient();

function asText(value) {
  if (Array.isArray(value)) return value.join("\n\n");
  return value || null;
}

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@educationdoorway.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash,
      role: "admin",
      active: true,
    },
    update: {
      passwordHash,
      role: "admin",
      active: true,
    },
  });

  await prisma.adminUser.upsert({
    where: { email: "editor@educationdoorway.com" },
    create: {
      email: "editor@educationdoorway.com",
      name: "Editor",
      passwordHash: await bcrypt.hash("Editor123!", 10),
      role: "editor",
      active: true,
    },
    update: {
      role: "editor",
      active: true,
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: "main" },
    create: {
      key: "main",
      name: company.name,
      short: company.short,
      tagline: company.tagline,
      since: company.since,
      phone: company.phone,
      phoneAlt: company.phoneAlt,
      email: company.email,
      hours: company.hours,
      address: company.address,
      whatsapp: company.whatsapp,
      socials: company.socials,
      stats,
    },
    update: {
      name: company.name,
      short: company.short,
      tagline: company.tagline,
      since: company.since,
      phone: company.phone,
      phoneAlt: company.phoneAlt,
      email: company.email,
      hours: company.hours,
      address: company.address,
      whatsapp: company.whatsapp,
      socials: company.socials,
      stats,
    },
  });

  const pages = [
    {
      slug: "home",
      title: "Home",
      subtitle: company.tagline,
      eyebrow: "Study Abroad",
      body: "Trusted guidance for international education.",
    },
    {
      slug: "about-us",
      title: "About Us",
      subtitle: "Your trusted path to study abroad",
      eyebrow: "Our Story",
      body: "Education Doorway helps students choose the right course, university and destination.",
    },
    {
      slug: "contact-us",
      title: "Contact Us",
      subtitle: "Talk to our counsellors",
      eyebrow: "Get in touch",
      body: "Visit a branch or book a free counselling session.",
    },
    {
      slug: "apply-now",
      title: "Apply Now",
      subtitle: "Start your application",
      eyebrow: "Admissions",
      body: "Share your details and our team will guide you through the next steps.",
    },
    {
      slug: "study",
      title: "Study Abroad",
      subtitle: "Browse partner universities worldwide",
      eyebrow: "Universities",
      body: "Filter by country, programme and course to find your fit.",
    },
    {
      slug: "countries",
      title: "Study Destinations",
      subtitle: "Explore countries we support",
      eyebrow: "Destinations",
      body: "Compare study destinations and find the right path for you.",
    },
    {
      slug: "articles",
      title: "Articles",
      subtitle: "Guides and insights for studying abroad",
      eyebrow: "Resources",
      body: "Practical advice on applications, visas and student life.",
    },
    {
      slug: "events",
      title: "Events",
      subtitle: "Fairs, webinars and counselling days",
      eyebrow: "Upcoming",
      body: "Meet our team and university partners.",
    },
    {
      slug: "stories",
      title: "Video Stories",
      subtitle: "Real journeys from students and families",
      eyebrow: "Success",
      body: "Watch stories from guardians, students and university delegates.",
    },
    ...Object.values(legalBySlug).map((p) => ({
      slug: p.path.replace(/^\//, ""),
      title: p.title,
      subtitle: p.subtitle,
      eyebrow: p.eyebrow,
      body: p.sections
        .map((s) => {
          const paras = (s.paragraphs || []).join("\n\n");
          const bullets = (s.bullets || []).map((b) => `• ${b}`).join("\n");
          return `${s.heading}\n\n${paras}${bullets ? `\n\n${bullets}` : ""}`;
        })
        .join("\n\n"),
      content: { updated: p.updated, sections: p.sections },
      metaTitle: `${p.title} | Education Doorway`,
      metaDescription: p.subtitle,
    })),
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      create: page,
      update: page,
    });
  }

  for (const [i, item] of countries.entries()) {
    await prisma.country.upsert({
      where: { slug: item.slug },
      create: {
        ...item,
        imageUrl: cityImage[item.slug] || null,
        sortOrder: i,
      },
      update: {
        name: item.name,
        flag: item.flag,
        code: item.code,
        region: item.region,
        blurb: item.blurb,
        imageUrl: cityImage[item.slug] || null,
        sortOrder: i,
      },
    });
  }

  for (const [i, item] of programs.entries()) {
    await prisma.program.upsert({
      where: { key: item.key },
      create: { ...item, sortOrder: i },
      update: { name: item.name, count: item.count, blurb: item.blurb, sortOrder: i },
    });
  }

  const popularNames = new Set(popularSubjects);
  const popularSort = Object.fromEntries(popularSubjects.map((name, i) => [name, i]));

  for (const [i, name] of subjects.entries()) {
    const popular = popularNames.has(name);
    await prisma.subject.upsert({
      where: { name },
      create: {
        name,
        popular,
        sortOrder: popular ? popularSort[name] : 100 + i,
      },
      update: {
        popular,
        sortOrder: popular ? popularSort[name] : 100 + i,
      },
    });
  }

  for (const [i, item] of universities.entries()) {
    const country = countryBySlug[item.country];
    const details = buildUniversityDetails(item, country);
    const data = {
      slug: item.slug,
      name: item.name,
      countrySlug: item.country,
      city: item.city,
      feeFrom: item.feeFrom,
      imageUrl: item.imageUrl || null,
      logoUrl: item.logoUrl || null,
      programs: item.programs,
      subjects: item.subjects,
      intakes: item.intakes,
      upcoming: item.upcoming,
      docs: item.docs,
      overview: item.overview,
      studentLife: details.studentLife,
      accommodation: details.accommodation,
      campus: details.campus,
      featured: partners.includes(item.slug),
      sortOrder: i,
      published: true,
    };
    await prisma.university.upsert({
      where: { slug: item.slug },
      create: data,
      update: data,
    });
  }

  const keepUniversitySlugs = universities.map((u) => u.slug);
  const malaysiaKeep = universities.filter((u) => u.country === "malaysia").map((u) => u.slug);
  const ukKeep = universities.filter((u) => u.country === "uk").map((u) => u.slug);
  await prisma.university.deleteMany({
    where: {
      countrySlug: "malaysia",
      slug: { notIn: malaysiaKeep },
    },
  });
  await prisma.university.deleteMany({
    where: {
      countrySlug: "uk",
      slug: { notIn: ukKeep },
    },
  });
  await prisma.university.deleteMany({
    where: { slug: { notIn: keepUniversitySlugs } },
  });
  await prisma.partner.deleteMany({
    where: { slug: { notIn: partners } },
  });
  // Keep affiliated partners limited to UK & Malaysia universities
  const partnerCountryOk = new Set(
    universities.filter((u) => u.country === "uk" || u.country === "malaysia").map((u) => u.slug)
  );
  await prisma.partner.deleteMany({
    where: { slug: { notIn: [...partnerCountryOk] } },
  });
  await prisma.partner.deleteMany({
    where: { slug: { notIn: keepUniversitySlugs } },
  });

  for (const [i, slug] of partners.entries()) {
    await prisma.partner.upsert({
      where: { slug },
      create: { slug, sortOrder: i, published: true },
      update: { sortOrder: i, published: true },
    });
  }

  for (const [i, item] of services.entries()) {
    const existing = await prisma.service.findFirst({ where: { title: item.title } });
    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: { ...item, sortOrder: i },
      });
    } else {
      await prisma.service.create({ data: { ...item, sortOrder: i } });
    }
  }

  for (const [i, item] of whyUs.entries()) {
    const existing = await prisma.whyUs.findFirst({ where: { title: item.title } });
    if (existing) {
      await prisma.whyUs.update({
        where: { id: existing.id },
        data: { ...item, sortOrder: i },
      });
    } else {
      await prisma.whyUs.create({ data: { ...item, sortOrder: i } });
    }
  }

  for (const [i, item] of testimonials.entries()) {
    const existing = await prisma.testimonial.findFirst({ where: { name: item.name, place: item.place } });
    if (existing) {
      await prisma.testimonial.update({
        where: { id: existing.id },
        data: { ...item, sortOrder: i },
      });
    } else {
      await prisma.testimonial.create({ data: { ...item, sortOrder: i } });
    }
  }

  for (const [i, item] of pillars.entries()) {
    await prisma.pillar.upsert({
      where: { slug: item.slug },
      create: { ...item, sortOrder: i },
      update: { ...item, sortOrder: i },
    });
  }

  for (const [i, item] of branches.entries()) {
    const data = {
      slug: item.slug,
      city: item.city,
      country: item.country,
      code: item.code,
      head: !!item.head,
      address: item.address,
      phone: item.phone,
      phoneAlt: item.phoneAlt || null,
      email: item.email,
      hours: item.hours,
      mapQuery: item.mapQuery || null,
      blurb: item.blurb || null,
      imageUrl: item.image || null,
      details: item.details || [],
      sortOrder: i,
    };
    await prisma.branch.upsert({
      where: { slug: item.slug },
      create: data,
      update: data,
    });
  }

  for (const item of articles) {
    await prisma.article.upsert({
      where: { slug: item.slug },
      create: { ...item, date: new Date(item.date) },
      update: { ...item, date: new Date(item.date) },
    });
  }

  for (const item of events) {
    const data = {
      ...item,
      date: new Date(item.date),
      description: asText(item.description),
    };
    await prisma.event.upsert({
      where: { slug: item.slug },
      create: data,
      update: data,
    });
  }

  for (const [i, item] of storyCategories.entries()) {
    await prisma.storyCategory.upsert({
      where: { key: item.key },
      create: { ...item, sortOrder: i },
      update: { ...item, sortOrder: i },
    });
  }

  for (const item of stories) {
    await prisma.story.upsert({
      where: { slug: item.slug },
      create: item,
      update: item,
    });
  }

  console.log("Seed complete.");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
  console.log("Editor: editor@educationdoorway.com / Editor123!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
