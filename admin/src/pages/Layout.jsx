import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useAuth } from "../auth";
import { NAV_GROUPS } from "../resources";

const NAV_ICONS = {
  grid: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
  inbox: "M4 6h16v12H4V6Zm0 4 8 5 8-5",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-7-9h14M12 3c2.5 2.8 2.5 14.2 0 18M12 3c-2.5 2.8-2.5 14.2 0 18",
  building: "M4 20h16M6 20V8l6-4 6 4v12M10 12h4M10 16h4",
  layers: "M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5M3 17l9 5 9-5",
  book: "M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V4Zm0 14h12",
  file: "M7 3h7l5 5v13H7V3Zm7 0v5h5",
  article: "M5 4h14v16H5V4Zm3 4h8M8 12h8M8 16h5",
  calendar: "M7 3v3M17 3v3M4 8h16M5 5h14v15H5V5Z",
  star: "M12 3l2.4 4.9L20 9l-4 3.9.9 5.1L12 15.8 7.1 18l.9-5.1L4 9l5.6-1.1L12 3Z",
  tag: "M3 12V5h7l9 9-7 7-9-9Zm5-3.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  pin: "M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  columns: "M5 4h5v16H5V4Zm9 0h5v16h-5V4Z",
  quote: "M7 8h5v5H8.5A2.5 2.5 0 0 0 6 15.5V17h2v-1.5A.5.5 0 0 1 8.5 15H12V6H7v2Zm9 0h5v5h-3.5A2.5 2.5 0 0 0 15 15.5V17h2v-1.5a.5.5 0 0 1 .5-.5H21V6h-5v2Z",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18",
  check: "M5 12.5 9.5 17 19 7.5",
  users: "M16 19v-1.5A3.5 3.5 0 0 0 12.5 14h-1A3.5 3.5 0 0 0 8 17.5V19M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 8v-1a3 3 0 0 0-2-2.8M17 8a2.5 2.5 0 0 1 0 5",
  settings: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm8.5 3a7.8 7.8 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a8.3 8.3 0 0 0-1.7-1L15.8 2h-4l-.5 2.5a8.3 8.3 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7.8 7.8 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a8.3 8.3 0 0 0 1.7 1L11.8 22h4l.5-2.5a8.3 8.3 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0",
  shield: "M12 3 5 6v6c0 5 3.5 8.5 7 9 3.5-.5 7-4 7-9V6l-7-3Z",
};

function NavIcon({ name }) {
  const d = NAV_ICONS[name] || NAV_ICONS.file;
  return (
    <svg className="nav-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 960) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className={`shell ${open ? "nav-open" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img
            className="sidebar-logo"
            src="/logo-white.png"
            alt="Education Doorway"
            width={160}
            height={55}
          />
          <span className="sidebar-brand-meta">
            {user?.role === "editor" ? "Editor CMS" : "Admin CMS"}
          </span>
          <button type="button" className="icon-btn sidebar-close" aria-label="Close menu" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_GROUPS.map((group) => {
            const items = group.items.filter((item) => !item.adminOnly || user?.role === "admin");
            if (!items.length) return null;
            return (
              <div key={group.key} className="nav-group">
                <p className="nav-group-label">{group.label}</p>
                {items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  >
                    <NavIcon name={item.icon} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/profile" className="profile-chip" onClick={() => setOpen(false)}>
            <span className="avatar">{(user?.name || user?.email || "?").slice(0, 1).toUpperCase()}</span>
            <span>
              <strong>{user?.name || "Account"}</strong>
              <em className={`role-badge ${user?.role}`}>{user?.role}</em>
            </span>
          </NavLink>
          <button type="button" className="btn ghost full" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      {open && <button type="button" className="sidebar-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />}

      <div className="shell-main">
        <TopBar onMenuClick={() => setOpen((v) => !v)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
