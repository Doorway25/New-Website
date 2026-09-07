import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const data = await post("/api/admin/auth/forgot-password", { email: email.trim() });
      setMessage(data.message || "If an account exists, continue to reset your password.");
      if (data.resetToken) {
        navigate(`/reset-password?token=${encodeURIComponent(data.resetToken)}`, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Request failed");
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
                <h1>Forgot password</h1>
                <p>Enter your admin email to reset access</p>
              </div>
            </div>

            {error && <div className="alert error">{error}</div>}
            {message && <div className="alert ok">{message}</div>}

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@educationdoorway.com"
                required
              />
            </label>

            <button type="submit" className="btn primary auth-submit" disabled={submitting}>
              {submitting ? "Checking…" : "Continue"}
            </button>

            <p className="auth-foot">
              Remembered it? <Link to="/login">Back to sign in</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
