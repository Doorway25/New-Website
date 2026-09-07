import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../api";
import { useAuth } from "../auth";

function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

export default function TopBar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [groups, setGroups] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs] = useState({ items: [], unread: 0 });
  const [mobileSearch, setMobileSearch] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useClickOutside(searchRef, () => setSearchOpen(false));
  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(profileRef, () => setProfileOpen(false));

  useEffect(() => {
    let cancelled = false;
    async function loadNotifs() {
      try {
        const data = await get("/api/admin/notifications");
        if (!cancelled) setNotifs(data);
      } catch {
        if (!cancelled) setNotifs({ items: [], unread: 0 });
      }
    }
    loadNotifs();
    const id = setInterval(loadNotifs, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setGroups([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await get(`/api/admin/search?q=${encodeURIComponent(query)}`);
        setGroups(data.groups || []);
        setSearchOpen(true);
      } catch {
        setGroups([]);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  function goTo(href) {
    setSearchOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
    setMobileSearch(false);
    setQ("");
    navigate(href);
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="icon-btn menu-btn" aria-label="Open menu" onClick={onMenuClick}>
          <MenuIcon />
        </button>
        <div className={`search-wrap ${mobileSearch ? "mobile-open" : ""}`} ref={searchRef}>
          <form
            className="search-box"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim().length >= 2) setSearchOpen(true);
            }}
          >
            <SearchIcon />
            <input
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => q.trim().length >= 2 && setSearchOpen(true)}
              placeholder="Search universities, articles, events…"
              aria-label="Global search"
            />
            {searching && <span className="search-spinner" aria-hidden />}
          </form>

          {searchOpen && q.trim().length >= 2 && (
            <div className="dropdown-panel search-panel">
              {!groups.length && !searching && <p className="dropdown-empty">No results for “{q.trim()}”</p>}
              {groups.map((group) => (
                <div key={group.key} className="search-group">
                  <p className="dropdown-label">{group.label}</p>
                  {group.items.map((item) => (
                    <button
                      key={`${group.key}-${item.id}`}
                      type="button"
                      className="dropdown-item"
                      onClick={() => goTo(item.href)}
                    >
                      <strong>{item.title}</strong>
                      {item.subtitle ? <span>{item.subtitle}</span> : null}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="topbar-right">
        <button
          type="button"
          className="icon-btn search-toggle"
          aria-label="Search"
          onClick={() => {
            setMobileSearch((v) => !v);
            setNotifOpen(false);
            setProfileOpen(false);
          }}
        >
          <SearchIcon />
        </button>

        <div className="notif-wrap" ref={notifRef}>
          <button
            type="button"
            className="icon-btn"
            aria-label="Notifications"
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
              setSearchOpen(false);
            }}
          >
            <BellIcon />
            {notifs.unread > 0 && <span className="badge-dot">{notifs.unread > 9 ? "9+" : notifs.unread}</span>}
          </button>
          {notifOpen && (
            <div className="dropdown-panel notif-panel">
              <div className="dropdown-head">
                <strong>Notifications</strong>
                <span className="muted">{notifs.unread} new</span>
              </div>
              {!notifs.items?.length && <p className="dropdown-empty">No new notifications</p>}
              {notifs.items?.map((item) => (
                <button key={item.id} type="button" className="dropdown-item" onClick={() => goTo(item.href || "/leads")}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                  <em>{formatWhen(item.createdAt)}</em>
                </button>
              ))}
              <Link to="/leads" className="dropdown-footer" onClick={() => setNotifOpen(false)}>
                View all leads
              </Link>
            </div>
          )}
        </div>

        <div className="profile-wrap" ref={profileRef}>
          <button
            type="button"
            className={`profile-btn${profileOpen ? " is-open" : ""}`}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
              setSearchOpen(false);
            }}
          >
            <span className="avatar sm">{(user?.name || user?.email || "?").slice(0, 1).toUpperCase()}</span>
            <span className="profile-btn-text">
              <strong>{user?.name || "Account"}</strong>
              <em className={`role-badge ${user?.role}`}>{user?.role}</em>
            </span>
            <ChevronIcon open={profileOpen} />
          </button>
          {profileOpen && (
            <div className="dropdown-panel profile-panel" role="menu">
              <div className="profile-menu-head">
                <span className="avatar md">{(user?.name || user?.email || "?").slice(0, 1).toUpperCase()}</span>
                <div className="profile-menu-meta">
                  <strong>{user?.name || "Account"}</strong>
                  <span>{user?.email}</span>
                  <em className={`role-badge ${user?.role}`}>{user?.role}</em>
                </div>
              </div>

              <div className="profile-menu-list">
                <button type="button" className="profile-menu-item" role="menuitem" onClick={() => goTo("/profile")}>
                  <span className="profile-menu-icon" aria-hidden>
                    <UserIcon />
                  </span>
                  <span className="profile-menu-copy">
                    <strong>Profile settings</strong>
                    <span>Name & password</span>
                  </span>
                  <ChevronRightIcon />
                </button>
                {user?.role === "admin" && (
                  <button type="button" className="profile-menu-item" role="menuitem" onClick={() => goTo("/users")}>
                    <span className="profile-menu-icon" aria-hidden>
                      <UsersIcon />
                    </span>
                    <span className="profile-menu-copy">
                      <strong>Manage users</strong>
                      <span>Admin & editor accounts</span>
                    </span>
                    <ChevronRightIcon />
                  </button>
                )}
              </div>

              <div className="profile-menu-foot">
                <button type="button" className="profile-menu-item danger" role="menuitem" onClick={logout}>
                  <span className="profile-menu-icon" aria-hidden>
                    <LogoutIcon />
                  </span>
                  <span className="profile-menu-copy">
                    <strong>Log out</strong>
                    <span>Sign out of admin</span>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function formatWhen(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`profile-chevron${open ? " open" : ""}`}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="profile-menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M14 19a4.5 4.5 0 0 1 6.5-4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
      <path d="M14 12H21" />
      <path d="M18 8l4 4-4 4" />
    </svg>
  );
}
