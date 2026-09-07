import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get } from "../api";
import { useAuth } from "../auth";

const CARDS = [
  { key: "universities", label: "Universities", to: "/universities", tone: "blue", hint: "Partner campuses" },
  { key: "countries", label: "Countries", to: "/countries", tone: "navy", hint: "Study destinations" },
  { key: "articles", label: "Articles", to: "/articles", tone: "sky", hint: "Guides & insights" },
  { key: "events", label: "Events", to: "/events", tone: "teal", hint: "Fairs & webinars" },
  { key: "stories", label: "Stories", to: "/stories", tone: "indigo", hint: "Student voices" },
  { key: "branches", label: "Branches", to: "/branches", tone: "slate", hint: "Global offices" },
  { key: "pages", label: "Pages", to: "/pages", tone: "violet", hint: "Site pages" },
  { key: "leads", label: "New leads", to: "/leads", tone: "gold", hint: "Awaiting follow-up" },
];

const ACTIONS = [
  { to: "/universities/new", label: "Add university", desc: "Create a new partner campus" },
  { to: "/articles/new", label: "Write article", desc: "Publish a study guide" },
  { to: "/events/new", label: "Create event", desc: "Schedule a fair or webinar" },
  { to: "/branches/new", label: "Add branch", desc: "Register a new office" },
  { to: "/leads", label: "Review leads", desc: "Follow up on enquiries" },
  { to: "/settings", label: "Site settings", desc: "Company & contact details" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    get("/api/admin/dashboard")
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="page dash-page">
      <section className="dash-hero">
        <div>
          <p className="eyebrow">CMS overview</p>
          <h1>
            {greeting}, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="muted">
            Manage universities, content, branches and leads across Education Doorway.
            {user?.role ? ` Signed in as ${user.role}.` : ""}
          </p>
        </div>
        <div className="dash-hero-actions">
          <Link className="btn primary" to="/universities/new">
            New university
          </Link>
          <Link className="btn" to="/leads">
            Open leads
          </Link>
        </div>
      </section>

      {error && <div className="alert error">{error}</div>}

      {!stats && !error && <p className="muted">Loading dashboard…</p>}

      {stats && (
        <>
          <div className="stat-grid">
            {CARDS.map((card) => (
              <Link key={card.key} to={card.to} className={`stat-card tone-${card.tone}`}>
                <div className="stat-card-top">
                  <span className="stat-label">{card.label}</span>
                  <span className="stat-icon" aria-hidden>
                    {iconFor(card.key)}
                  </span>
                </div>
                <span className="stat-value">{stats[card.key] ?? 0}</span>
                <span className="stat-hint">{card.hint}</span>
              </Link>
            ))}
          </div>

          <div className="dash-split">
            <section className="panel dash-panel">
              <div className="panel-head row-between">
                <div>
                  <h2>Quick actions</h2>
                  <p className="muted">Jump into the most common CMS tasks.</p>
                </div>
              </div>
              <div className="action-grid">
                {ACTIONS.map((item) => (
                  <Link key={item.to} to={item.to} className="action-tile">
                    <strong>{item.label}</strong>
                    <span>{item.desc}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="panel dash-panel">
              <div className="panel-head row-between">
                <div>
                  <h2>Recent leads</h2>
                  <p className="muted">Latest enquiries from the website.</p>
                </div>
                <Link to="/leads" className="text-link">
                  View all
                </Link>
              </div>
              {!stats.recentLeads?.length ? (
                <div className="empty-soft">
                  <p>No leads yet</p>
                  <span className="muted">New counselling and apply forms will appear here.</span>
                </div>
              ) : (
                <ul className="lead-feed">
                  {stats.recentLeads.map((lead) => (
                    <li key={lead.id}>
                      <div>
                        <strong>{lead.name}</strong>
                        <span className="muted">
                          {lead.type || "enquiry"}
                          {lead.email ? ` · ${lead.email}` : ""}
                        </span>
                      </div>
                      <em className={`badge ${lead.status === "new" ? "ok" : ""}`}>{lead.status}</em>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function iconFor(key) {
  const paths = {
    universities: "M4 19h16M6 19V9l6-4 6 4v10M9 19v-5h6v5",
    countries: "M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    articles: "M5 4h10l4 4v12H5V4Zm10 0v4h4",
    events: "M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
    stories: "M12 3l2.2 4.5L19 8.3l-3.5 3.4.8 4.8L12 14.8 7.7 16.5l.8-4.8L5 8.3l4.8-.8L12 3Z",
    branches: "M12 2v6M12 22v-6M4.9 7.5l5.2 3M19.1 16.5l-5.2-3M4.9 16.5l5.2-3M19.1 7.5l-5.2 3",
    pages: "M8 4h8v16H8V4Zm3 4h2M9 12h6M9 16h5",
    leads: "M12 3a6 6 0 0 1 6 6c0 4-6 10-6 10S6 13 6 9a6 6 0 0 1 6-6Zm0 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={paths[key] || paths.pages} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
