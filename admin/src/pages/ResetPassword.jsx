import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { post } from "../api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!token) {
      setError("Reset link is missing or invalid.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await post("/api/admin/auth/reset-password", { token, password });
      setMessage(data.message || "Password updated.");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setError(err.message || "Reset failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell narrow">
        <section className="auth-main full">
          <form className="auth-card" onSubmit={onSubmit}>
            <div className="auth-card-head">
              <img className="auth-card-logo" src="/logo-color.png" alt="Education Doorway" width={140} height={48} />
              <div>
                <h1>Set new password</h1>
                <p>Choose a strong password for your account</p>
              </div>
            </div>

            {!token && <div className="alert error">This reset link is invalid. Request a new one.</div>}
            {error && <div className="alert error">{error}</div>}
            {message && <div className="alert ok">{message}</div>}

            <label className="field">
              <span>New password</span>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                  disabled={!token}
                />
                <button type="button" className="text-btn" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <label className="field">
              <span>Confirm password</span>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                minLength={8}
                required
                disabled={!token}
              />
            </label>

            <button type="submit" className="btn primary auth-submit" disabled={submitting || !token}>
              {submitting ? "Updating…" : "Update password"}
            </button>

            <p className="auth-foot">
              <Link to="/forgot-password">Request another link</Link>
              {" · "}
              <Link to="/login">Sign in</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
