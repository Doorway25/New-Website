import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("admin@educationdoorway.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      const to = location.state?.from?.pathname || "/";
      navigate(to, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <aside className="auth-aside">
          <div className="auth-aside-inner">
            <img className="auth-aside-logo" src="/logo-white.png" alt="Education Doorway" width={180} height={62} />
            <h2>Welcome back</h2>
            <p>Manage universities, courses, articles, events, and SEO from one modern admin CMS.</p>
            <ul className="auth-points">
              <li>Admin & editor roles (editors cannot delete)</li>
              <li>Full page SEO controls</li>
              <li>Leads & notifications</li>
            </ul>
          </div>
        </aside>

        <section className="auth-main">
          <form className="auth-card" onSubmit={onSubmit}>
            <div className="auth-card-head">
              <img className="auth-card-logo" src="/logo-color.png" alt="Education Doorway" width={140} height={48} />
              <div>
                <h1>Sign in</h1>
                <p>Education Doorway admin panel</p>
              </div>
            </div>

            {error && <div className="alert error">{error}</div>}

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@educationdoorway.com"
                required
              />
            </label>

            <label className="field">
              <span className="field-row">
                <span>Password</span>
                <Link to="/forgot-password" className="field-link">
                  Forgot password?
                </Link>
              </span>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button type="button" className="text-btn" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button type="submit" className="btn primary auth-submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>

            <div className="auth-demo">
              <p>Quick fill demo accounts</p>
              <div className="auth-demo-row">
                <button
                  type="button"
                  className="hint-chip"
                  onClick={() => {
                    setEmail("admin@educationdoorway.com");
                    setPassword("Admin123!");
                  }}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className="hint-chip"
                  onClick={() => {
                    setEmail("editor@educationdoorway.com");
                    setPassword("Editor123!");
                  }}
                >
                  Editor
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
