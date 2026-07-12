# Abroad Study Consultancy — Website (Frontend)

A modern, fully responsive **frontend** for an education / study-abroad consultancy firm,
built with **React + Vite + Tailwind CSS v4 + React Router**. This is a UI-only project
(no backend) — forms validate client-side and show a success state.

## ✨ Features

- **Beautiful, modern UI** — gradient hero, glassmorphism cards, scroll-reveal animations, animated counters and marquees.
- **Sticky navbar** with mega-menu dropdowns (Countries, Courses, Universities) and a mobile drawer.
- **Menu bar**: Home · Countries · Courses · Universities · About Us · Contact Us + Apply Now CTA.
- **Universities listing** with live filters (country, program, course, sort-by-fee) and pagination.
- **Reusable "Book Free Counselling"** section with a math security check on every page.
- Fully **responsive** (mobile → desktop) and accessible.

## 🗺️ Pages / Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/countries` | All study destinations |
| `/study` | All universities (with filters) |
| `/study/:country` | Universities filtered by country (e.g. `/study/uk`) |
| `/study/:country/:program/:course` | Deep-filtered listing (e.g. `/study/all/undergraduate/all`) |
| `/university/:slug` | University detail (e.g. `/university/ucsi-university`) |
| `/courses` | Global courses / programmes |
| `/about-us` | About the agency |
| `/contact-us` | Contact details + map |
| `/apply-now` | Full application form |

## 🚀 Getting started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build to /dist
npm run preview  # preview the production build
```

## 🧱 Tech stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [React Router v7](https://reactrouter.com/)

## 📁 Structure

```
src/
├── components/   # Navbar, Footer, Icon, cards, forms, reveal animations…
├── data/site.js  # All content (countries, universities, courses, testimonials…)
├── pages/        # One file per route
├── App.jsx       # Routes + layout
└── main.jsx      # Entry (Router)
```

## 🌐 Deployment

Deep-link support for static hosts is preconfigured:
- **Netlify** → `public/_redirects`
- **Vercel** → `vercel.json`

> All data in `src/data/site.js` is demo content and can be edited freely.
