import { Link, useParams } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import StoryCard from "../components/StoryCard";
import SeoHead from "../components/SeoHead";
import { useSite } from "../api/SiteContext";

export default function StoryDetail() {
  const { slug } = useParams();
  const { stories, storyBySlug, storyCategoryByKey } = useSite();
  const story = storyBySlug[slug];

  if (!story) {
    return (
      <section className="container-x py-24 text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink">Story not found</h1>
        <p className="mt-3 text-slate-500">The story you're looking for doesn't exist or has been moved.</p>
        <Link to="/stories" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 font-semibold text-white">
          Back to Stories <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  const cat = storyCategoryByKey[story.roleKey];
  const related = stories.filter((s) => s.roleKey === story.roleKey && s.slug !== story.slug).slice(0, 3);

  return (
    <>
      <SeoHead
        seo={story}
        title={`${story.name} — ${story.role} Story | Education Doorway`}
        description={story.quote}
        image={story.image}
        path={`/story/${story.slug}`}
      />
      <section className="relative overflow-hidden bg-brand-950 pb-14 pt-14">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,rgba(0,178,255,.55),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(79,210,255,.3),transparent_40%)]" />
        <div className="container-x relative max-w-4xl">
          <nav className="flex items-center gap-1.5 text-sm text-slate-400">
            <Link to="/" className="hover:text-white">Home</Link>
            <Icon name="chevron" className="h-4 w-4 -rotate-90 text-slate-500" />
            <Link to="/stories" className="hover:text-white">Stories</Link>
            {cat && (
              <>
                <Icon name="chevron" className="h-4 w-4 -rotate-90 text-slate-500" />
                <Link to={`/stories/${cat.key}`} className="hover:text-white">{cat.short}</Link>
              </>
            )}
          </nav>
          <span className="mt-5 inline-block rounded-full bg-gold-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold-400">
            {story.role} Story
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {story.name}
          </h1>
          <p className="mt-2 text-slate-300">{story.relation}</p>
        </div>
      </section>

      <article className="container-x -mt-8 relative z-10 max-w-4xl pb-8">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-brand-950/5">
          {story.youtubeId ? (
            <div className="aspect-video w-full bg-brand-950">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${story.youtubeId}`}
                title={`${story.name} — video testimonial`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : null}

          <div className="grid gap-6 p-6 sm:p-9 md:grid-cols-[1fr_1.4fr]">
            {/* Image */}
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800">
              <img
                src={story.image}
                alt={story.name}
                onError={(e) => (e.currentTarget.style.display = "none")}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Text */}
            <div>
              <div className="flex text-gold-500">
                {Array.from({ length: 5 }).map((_, k) => <Icon key={k} name="star" className="h-4 w-4 fill-current" stroke={0} />)}
              </div>
              <blockquote className="mt-3 font-display text-xl font-bold leading-snug text-ink">"{story.quote}"</blockquote>
              <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-slate-600">
                {story.text.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-6 mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-50 p-5 sm:mx-9 sm:mb-9">
            <div>
              <p className="font-display text-lg font-bold text-ink">Want a story like this?</p>
              <p className="text-sm text-slate-500">Book a free counselling session with our experts.</p>
            </div>
            <Link to="/apply-now" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-700">
              Get Free Guidance <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <Link to="/stories" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline">
          <Icon name="arrow" className="h-4 w-4 rotate-180" /> Back to all stories
        </Link>
      </article>

      {related.length > 0 && (
        <section className="container-x pb-4">
          <h2 className="font-display text-2xl font-extrabold text-ink">More {cat ? cat.short : "Stories"}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s, i) => (
              <Reveal key={s.slug} delay={i * 70}>
                <StoryCard story={s} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CounsellingSection />
    </>
  );
}
