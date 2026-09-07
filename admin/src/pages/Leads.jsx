import { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL, del, get, getToken, put } from "../api";
import { useAuth } from "../auth";

const STATUSES = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

const TYPES = [
  { value: "", label: "All types" },
  { value: "counselling", label: "Counselling" },
  { value: "apply", label: "Apply" },
  { value: "branch", label: "Branch" },
  { value: "contact", label: "Contact" },
];

export default function Leads() {
  const { user } = useAuth();
  const canDelete = user?.role === "admin";
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";
  const q = searchParams.get("q") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const page = Number(searchParams.get("page") || 1);

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(q);
  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);
  const [openId, setOpenId] = useState("");
  const [exporting, setExporting] = useState(false);

  const filterParams = useMemo(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    if (q) params.set("q", q);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return params;
  }, [status, type, q, from, to]);

  async function load() {
    setError("");
    try {
      const params = new URLSearchParams(filterParams);
      params.set("page", String(page));
      params.set("pageSize", "20");
      setData(await get(`/api/admin/leads?${params}`));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, type, q, from, to, page]);

  useEffect(() => {
    setQuery(q);
    setFromDate(from);
    setToDate(to);
  }, [q, from, to]);

  async function setLeadStatus(id, nextStatus) {
    try {
      await put(`/api/admin/leads/${id}`, { status: nextStatus });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function onDelete(id, name) {
    if (!canDelete) return;
    if (!window.confirm(`Delete lead from “${name}”?`)) return;
    try {
      await del(`/api/admin/leads/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function applyFilters(e) {
    e?.preventDefault?.();
    const next = new URLSearchParams();
    if (status) next.set("status", status);
    if (type) next.set("type", type);
    if (query.trim()) next.set("q", query.trim());
    if (fromDate) next.set("from", fromDate);
    if (toDate) next.set("to", toDate);
    setSearchParams(next);
  }

  function setFilter(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  }

  function clearFilters() {
    setQuery("");
    setFromDate("");
    setToDate("");
    setSearchParams(new URLSearchParams());
  }

  async function downloadCsv() {
    setExporting(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/leads/export?${filterParams}`, {
        headers: {
          Authorization: `Bearer ${getToken() || ""}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Export failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Could not download CSV");
    } finally {
      setExporting(false);
    }
  }

  const statusCounts = data?.statusCounts || {};
  const totalForTabs = Object.values(statusCounts).reduce((sum, n) => sum + Number(n || 0), 0) || data?.total || 0;
  const hasActiveFilters = Boolean(status || type || q || from || to);

  return (
    <div className="page leads-page">
      <header className="page-header row leads-header">
        <div>
          <p className="eyebrow">Enquiries</p>
          <h1>Leads</h1>
          <p className="muted">
            {data
              ? `${data.total} matching · counselling, apply & branch forms`
              : "Loading enquiries…"}
          </p>
        </div>
        <div className="leads-header-actions">
          <button type="button" className="btn primary" onClick={downloadCsv} disabled={exporting || !data?.total}>
            {exporting ? "Preparing…" : "Download CSV"}
          </button>
        </div>
      </header>

      <div className="filter-tabs" role="tablist" aria-label="Lead status">
        {STATUSES.map((tab) => {
          const count =
            tab.value === ""
              ? totalForTabs
              : statusCounts[tab.value] ?? 0;
          const active = status === tab.value;
          return (
            <button
              key={tab.value || "all"}
              type="button"
              role="tab"
              aria-selected={active}
              className={`filter-tab ${active ? "active" : ""}`}
              onClick={() => setFilter("status", tab.value)}
            >
              {tab.label}
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      <form className="leads-toolbar panel" onSubmit={applyFilters}>
        <label className="leads-field grow">
          <span>Search</span>
          <input
            type="search"
            placeholder="Name, email, phone, message…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="leads-field">
          <span>Type</span>
          <select value={type} onChange={(e) => setFilter("type", e.target.value)}>
            {TYPES.map((t) => (
              <option key={t.value || "all"} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="leads-field">
          <span>From</span>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </label>
        <label className="leads-field">
          <span>To</span>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </label>
        <div className="leads-toolbar-actions">
          <button type="submit" className="btn primary">
            Apply
          </button>
          {hasActiveFilters && (
            <button type="button" className="btn ghost" onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>
      </form>

      {error && <div className="alert error">{error}</div>}

      <div className="table-wrap leads-table-wrap">
        <table className="data-table leads-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!data?.items?.length && (
              <tr>
                <td colSpan={6} className="empty-cell muted">
                  No leads found for these filters.
                </td>
              </tr>
            )}
            {data?.items?.map((lead) => {
              const open = openId === lead.id;
              const metaEntries = lead.meta && typeof lead.meta === "object" ? Object.entries(lead.meta) : [];
              return (
                <Fragment key={lead.id}>
                  <tr className={open ? "is-open" : ""}>
                    <td>
                      <button
                        type="button"
                        className="lead-name-btn"
                        onClick={() => setOpenId(open ? "" : lead.id)}
                      >
                        <strong className="table-title">{lead.name}</strong>
                        {lead.message ? (
                          <span className="muted small lead-preview">{lead.message}</span>
                        ) : (
                          <span className="muted small">No message</span>
                        )}
                      </button>
                    </td>
                    <td className="muted">
                      <div>{lead.email || "—"}</div>
                      <div>{lead.phone || ""}</div>
                    </td>
                    <td>
                      <span className="type-pill">{formatType(lead.type)}</span>
                    </td>
                    <td>
                      <div className="status-cell">
                        <span className={`status-pill status-${lead.status}`}>{lead.status}</span>
                        <select
                          aria-label={`Status for ${lead.name}`}
                          value={lead.status}
                          onChange={(e) => setLeadStatus(lead.id, e.target.value)}
                        >
                          {STATUSES.filter((s) => s.value).map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="muted">{formatWhen(lead.createdAt)}</td>
                    <td className="row-actions">
                      <button type="button" className="link" onClick={() => setOpenId(open ? "" : lead.id)}>
                        {open ? "Hide" : "View"}
                      </button>
                      {canDelete && (
                        <button type="button" className="link danger" onClick={() => onDelete(lead.id, lead.name)}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                  {open && (
                    <tr className="lead-detail-row">
                      <td colSpan={6}>
                        <div className="lead-detail">
                          <div>
                            <h3>Message</h3>
                            <p>{lead.message || "—"}</p>
                          </div>
                          <div>
                            <h3>Details</h3>
                            <dl className="lead-meta">
                              <div>
                                <dt>Type</dt>
                                <dd>{formatType(lead.type)}</dd>
                              </div>
                              <div>
                                <dt>Email</dt>
                                <dd>{lead.email || "—"}</dd>
                              </div>
                              <div>
                                <dt>Phone</dt>
                                <dd>{lead.phone || "—"}</dd>
                              </div>
                              <div>
                                <dt>Created</dt>
                                <dd>{formatWhen(lead.createdAt)}</dd>
                              </div>
                              {metaEntries.map(([key, value]) => (
                                <div key={key}>
                                  <dt>{key}</dt>
                                  <dd>{typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {data && (
        <div className="pager">
          <button
            type="button"
            className="btn"
            disabled={page <= 1}
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.set("page", String(page - 1));
              setSearchParams(next);
            }}
          >
            Previous
          </button>
          <span className="muted">
            Page {data.page} of {data.totalPages} · {data.total} items
          </span>
          <button
            type="button"
            className="btn"
            disabled={page >= data.totalPages}
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.set("page", String(page + 1));
              setSearchParams(next);
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function formatType(value) {
  if (!value) return "—";
  return String(value).replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatWhen(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
