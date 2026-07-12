import { Link } from "react-router-dom";
import Icon from "./Icon";
import { formatDate, gradientFor } from "../data/site";

export default function EventCard({ event }) {
  const grad = gradientFor(event.slug);
  const d = new Date(event.date);
  const day = d.toLocaleDateString("en-GB", { day: "2-digit" });
  const month = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const online = event.type === "Online";
  return (
    <Link
      to={`/events/${event.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
    >
      <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${grad}`}>
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          onError={(e) => (e.currentTarget.style.display = "none")}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-col items-center rounded-xl bg-white px-3 py-1.5 text-center shadow-lg">
          <span className="font-display text-lg font-extrabold leading-none text-brand-700">{day}</span>
          <span className="text-[10px] font-bold tracking-wide text-slate-500">{month}</span>
        </div>
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm ${
            online ? "bg-emerald-500 text-white" : "bg-gold-500 text-brand-950"
          }`}
        >
          {event.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-display text-[17px] font-bold leading-snug text-ink group-hover:text-brand-700">
          {event.title}
        </h3>
        <div className="mt-3 space-y-1.5 text-sm text-slate-500">
          <p className="flex items-center gap-2"><Icon name="calendar" className="h-4 w-4 text-brand-400" /> {formatDate(event.date, { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</p>
          <p className="flex items-center gap-2"><Icon name="clock" className="h-4 w-4 text-brand-400" /> {event.time}</p>
          <p className="flex items-center gap-2"><Icon name="pin" className="h-4 w-4 text-brand-400" /> {event.location}</p>
        </div>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">{event.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 border-t border-slate-100 pt-3 text-sm font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">
          View details <Icon name="arrow" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
