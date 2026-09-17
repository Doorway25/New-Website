import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SeoHead from "../components/SeoHead";
import { useSite } from "../api/SiteContext";

const PAGE_SIZE = 12;

export default function EventGalleryAlbum() {
  const { albumKey } = useParams();
  const { eventAlbums } = useSite();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lightbox, setLightbox] = useState(null);

  const page = Math.max(1, Number(searchParams.get("page") || 1) || 1);

  const albums = useMemo(() => eventAlbums || [], [eventAlbums]);
  const album = useMemo(
    () => albums.find((a) => a.key === albumKey) || null,
    [albums, albumKey]
  );

  const images = useMemo(
    () => (Array.isArray(album?.images) ? album.images.filter(Boolean) : []),
    [album]
  );

  const totalPages = Math.max(1, Math.ceil(images.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageImages = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return images.slice(start, start + PAGE_SIZE).map((src, i) => ({
      key: `${album?.key || "album"}-${start + i}`,
      src,
      title: album?.name || "Gallery",
      albumName: album?.name,
      index: start + i,
    }));
  }, [images, currentPage, album]);

  const related = useMemo(
    () =>
      albums.filter(
        (a) => a.key !== albumKey && Array.isArray(a.images) && a.images.length > 0
      ),
    [albums, albumKey]
  );

  function goPage(next) {
    const p = Math.min(totalPages, Math.max(1, next));
    setSearchParams(p <= 1 ? {} : { page: String(p) }, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!album) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Album not found</h1>
        <p className="mt-3 text-slate-500">This gallery album may have been removed or is empty.</p>
        <Link
          to="/events?tab=gallery"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title={`${album.name} Gallery | Education Doorway`}
        description={`Browse ${images.length} photos from ${album.name} at Education Doorway events.`}
        path={`/events/gallery/${album.key}`}
        image={images[0]}
      />
      <PageHero
        eyebrow="Event Gallery"
        title={album.name}
        subtitle={`${images.length} photo${images.length === 1 ? "" : "s"} from this album`}
        crumbs={[
          { label: "Events", to: "/events" },
          { label: "Gallery", to: "/events?tab=gallery" },
          { label: album.name },
        ]}
      />

      <section className="container-x relative z-10 -mt-6 pb-12">
        {images.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
            No photos in this album yet.
          </p>
        ) : (
          <>
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {pageImages.map((item, i) => (
                <Reveal key={item.key} delay={(i % 6) * 40} className="mb-4 break-inside-avoid">
                  <button
                    type="button"
                    onClick={() => setLightbox(item)}
                    className="group relative block w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg"
                  >
                    <img src={item.src} alt={`${album.name} ${item.index + 1}`} loading="lazy" className="block w-full object-contain" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/70 to-transparent px-3 pb-3 pt-8 text-left text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                      Photo {item.index + 1}
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                  disabled={currentPage <= 1}
                  onClick={() => goPage(currentPage - 1)}
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                  disabled={currentPage >= totalPages}
                  onClick={() => goPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/events?tab=gallery"
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            All albums
          </Link>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-white py-14">
          <div className="container-x">
            <Reveal>
              <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Relevant albums</h2>
              <p className="mt-2 text-slate-500">More event photos you may also like.</p>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel, i) => (
                <Reveal key={rel.key} delay={(i % 3) * 70}>
                  <Link
                    to={`/events/gallery/${encodeURIComponent(rel.key)}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                      <img
                        src={rel.images[0]}
                        alt={rel.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div
                      className="flex items-center justify-between gap-3 px-4 py-3.5"
                      style={{ backgroundColor: "#0d157b" }}
                    >
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-lg font-bold text-white">{rel.name}</h3>
                        <p className="mt-0.5 text-xs text-white/75">
                          {rel.images.length} photo{rel.images.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#0d157b]">
                        View all <Icon name="arrow" className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {lightbox ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-950/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={lightbox.src} alt={lightbox.title} className="mx-auto max-h-[75vh] w-full object-contain" />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
              <div>
                <p className="font-display text-lg font-bold text-ink">{lightbox.title}</p>
                <p className="text-sm text-slate-500">Photo {(lightbox.index ?? 0) + 1}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <CounsellingSection />
    </>
  );
}
