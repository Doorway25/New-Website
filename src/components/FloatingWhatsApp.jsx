import Icon from "./Icon";
import { useSite } from "../api/SiteContext";

export default function FloatingWhatsApp() {
  const { company } = useSite();
  const href = company?.whatsapp || "https://wa.me/";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-emerald-500 py-3.5 pl-3.5 pr-4 text-white shadow-xl shadow-emerald-500/40 transition hover:bg-emerald-600"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-40 group-hover:opacity-0" />
      <Icon name="whatsapp" className="relative h-6 w-6" />
      <span className="relative hidden text-sm font-semibold sm:inline">Any queries?</span>
    </a>
  );
}
