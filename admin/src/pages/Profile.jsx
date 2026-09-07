import { useEffect, useState } from "react";
import { put } from "../api";
import { useAuth } from "../auth";

export default function Profile() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const body = { name };
      if (password) {
        body.password = password;
        body.currentPassword = currentPassword;
      }
      await put("/api/admin/auth/me", body);
      await refresh();
      setCurrentPassword("");
      setPassword("");
      setMessage("Profile updated");
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Profile</h1>
          <p className="muted">Manage your name and password. Available for admin and editor accounts.</p>
        </div>
      </header>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert ok">{message}</div>}

      <div className="profile-hero panel">
        <span className="avatar lg">{(user?.name || user?.email || "?").slice(0, 1).toUpperCase()}</span>
        <div>
          <h2>{user?.name || "Account"}</h2>
          <p className="muted">{user?.email}</p>
          <span className={`role-badge solid ${user?.role}`}>{user?.role}</span>
        </div>
      </div>

      <div className="profile-grid">
        <section className="panel">
          <div className="panel-head">
            <h2>Your access</h2>
          </div>
          <dl className="detail-list">
            <div>
              <dt>Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>
                <span className={`role-badge solid ${user?.role}`}>{user?.role}</span>
              </dd>
            </div>
            <div>
              <dt>Permissions</dt>
              <dd>
                {user?.role === "admin"
                  ? "Full CMS, settings write access, user management, and delete permission"
                  : "Create and edit content and leads. No delete, settings write, or user management."}
              </dd>
            </div>
          </dl>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Update profile</h2>
            <p className="muted">Leave password blank if you only want to change your display name.</p>
          </div>
          <form className="form-grid" onSubmit={onSubmit}>
            <label className="span-2">
              <span>Display name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              <span>Current password</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Required to change password"
                autoComplete="current-password"
              />
            </label>
            <label>
              <span>New password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                minLength={8}
                autoComplete="new-password"
              />
            </label>
            <div className="form-actions span-2">
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? "Saving…" : "Save profile"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
