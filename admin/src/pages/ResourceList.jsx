import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_URL, del, get } from "../api";
import { useAuth } from "../auth";
import { hasPublished, resources } from "../resources";

function mediaUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url) || url.startsWith("blob:")) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function ResourceList({ resourceKey }) {
  const { user } = useAuth();
  const canDelete = user?.role === "admin";
  const resource = resources[resourceKey];
  const showPublished = hasPublished(resource);
  const filterTabs = resource.filterTabs || null;
  const pageSize = resource.pageSize || 20;
  const partnerMode = !!resource.partnerMode;

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);
  const filterValue = filterTabs ? searchParams.get(filterTabs.param) || "" : "";

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(q);
  const [uniBySlug, setUniBySlug] = useState({});

  async function load() {
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (q) params.set("q", q);
      // country filter for partners is client-side after enrich
      if (filterTabs && filterValue && filterTabs.param !== "country") {
        params.set(filterTabs.param, filterValue);
      }
      const res = await get(`/api/admin/${resource.path}?${params}`);
      setData(res);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceKey, q, page, filterValue]);

  useEffect(() => {
    setQuery(q);
  }, [q, resourceKey]);

  useEffect(() => {
    if (!partnerMode) {
      setUniBySlug({});
      return;
    }
    const countries = resource.countriesOnly || ["uk", "malaysia"];
    Promise.all(
      countries.map((countrySlug) =>
        get(`/api/admin/universities?pageSize=200&countrySlug=${encodeURIComponent(countrySlug)}`)
          .then((res) => res?.items || [])
          .catch(() => [])
      )
    ).then((lists) => {
      const map = {};
      for (const list of lists) {
        for (const u of list) map[u.slug] = u;
      }
      setUniBySlug(map);
    });
  }, [partnerMode, resourceKey, resource.countriesOnly]);

  async function onDelete(id, title) {
    if (!canDelete) return;
    if (!window.confirm(`Delete “${title}”?`)) return;
    try {
      await del(`/api/admin/${resource.path}/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function onSearch(e) {
    e.preventDefault();
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (filterTabs && filterValue) next.set(filterTabs.param, filterValue);
    setSearchParams(next);
  }

  function setFilter(value) {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (value) next.set(filterTabs.param, value);
    setSearchParams(next);
  }

  function goPage(nextPage) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  }

  const enrichedItems = useMemo(() => {
    const items = data?.items || [];
    if (!partnerMode) return items;
    return items
      .map((item) => {
        const uni = uniBySlug[item.slug];
        return {
          ...item,
          displayName: uni?.name || item.slug,
          displayCountry: uni?.countrySlug || "",
          displayCity: uni?.city || "",
          logoUrl: uni?.logoUrl || "",
          countrySlug: uni?.countrySlug || "",
        };
      })
      .filter((item) => {
        if (!filterValue) return true;
        return item.countrySlug === filterValue;
      })
      .filter((item) => {
        // Drop partners that are not UK/MY universities
        if (!Object.keys(uniBySlug).length) return true;
        return Boolean(uniBySlug[item.slug]);
      });
  }, [data, partnerMode, uniBySlug, filterValue]);

  const items = partnerMode ? enrichedItems : data?.items || [];
  const totalPages = partnerMode ? 1 : data?.totalPages || 1;
  const newHref =
    filterTabs && filterValue && filterTabs.param !== "country"
      ? `/${resource.path}/new?${filterTabs.param}=${encodeURIComponent(filterValue)}`
      : `/${resource.path}/new`;

  return (
    <div className="page">
      <header className="page-header row">
        <div>
          <p className="eyebrow">{resource.group || "Library"}</p>
          <h1>{partnerMode ? "Affiliated Universities" : resource.label}</h1>
          <p className="muted">
            {resource.help
              ? resource.help
              : data
                ? `${data.total} total · manage public website content`
                : "Loading…"}
          </p>
          {resource.help && data ? (
            <p className="muted field-count">
              {partnerMode ? `${items.length} shown` : `${data.total} total`}
            </p>
          ) : null}
        </div>
        <Link className="btn primary" to={newHref}>
          New {resource.singular.toLowerCase()}
        </Link>
      </header>

      {filterTabs ? (
        <div className="filter-tabs" role="tablist" aria-label={`${resource.label} filters`}>
          {filterTabs.options.map((tab) => {
            const active = filterValue === tab.value;
            return (
              <button
                key={tab.value || "all"}
                type="button"
                role="tab"
                aria-selected={active}
                className={`filter-tab ${active ? "active" : ""}`}
                onClick={() => setFilter(tab.value)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <form className="toolbar" onSubmit={onSearch}>
        <input
          type="search"
          placeholder={partnerMode ? "Search university…" : `Search ${resource.label.toLowerCase()}…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      {error && <div className="alert error">{error}</div>}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{partnerMode ? "University" : "Name"}</th>
              <th>{partnerMode ? "Country" : "Details"}</th>
              {showPublished && <th>Status</th>}
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!items.length && (
              <tr>
                <td colSpan={showPublished ? 4 : 3} className="muted empty-cell">
                  No items found.
                </td>
              </tr>
            )}
            {items.map((item) => {
              const title = partnerMode
                ? item.displayName
                : item[resource.titleKey] || item.id;
              const subtitle = partnerMode
                ? [item.displayCountry?.toUpperCase(), item.displayCity, `Order ${item.sortOrder ?? 0}`]
                    .filter(Boolean)
                    .join(" · ")
                : item[resource.subtitleKey] || "";
              return (
                <tr key={item.id}>
                  <td>
                    <Link className="table-title partner-row-title" to={`/${resource.path}/${item.id}`}>
                      {partnerMode ? (
                        <span className="partner-list-cell">
                          <span className="partner-list-logo">
                            {item.logoUrl ? (
                              <img src={mediaUrl(item.logoUrl)} alt="" loading="lazy" />
                            ) : (
                              <span>{String(title).slice(0, 1)}</span>
                            )}
                          </span>
                          <span>{title}</span>
                        </span>
                      ) : (
                        title
                      )}
                    </Link>
                  </td>
                  <td className="muted">{String(subtitle)}</td>
                  {showPublished && (
                    <td>
                      <span className={`badge ${item.published ? "ok" : ""}`}>
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </td>
                  )}
                  <td className="row-actions">
                    <Link className="action-edit" to={`/${resource.path}/${item.id}`}>
                      Edit
                    </Link>
                    {canDelete && (
                      <button type="button" className="link danger" onClick={() => onDelete(item.id, title)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data && !partnerMode && (
        <div className="pager">
          <button type="button" className="btn" disabled={page <= 1} onClick={() => goPage(page - 1)}>
            Previous
          </button>
          <span className="muted">
            Page {data.page} of {totalPages}
            {typeof data.total === "number" ? ` · ${data.total} items` : ""}
          </span>
          <button
            type="button"
            className="btn"
            disabled={page >= totalPages}
            onClick={() => goPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
      {partnerMode && (
        <div className="pager">
          <span className="muted">{items.length} affiliated universities (UK & Malaysia)</span>
        </div>
      )}
    </div>
  );
}
