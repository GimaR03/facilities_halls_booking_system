import { useState } from "react";

const loginHighlights = [
  {
    eyebrow: "Faster reservations",
    title: "Book rooms without the clutter",
    description:
      "Jump back into your campus workspace and continue reservations, requests, and updates in one place.",
  },
  {
    eyebrow: "Clear status tracking",
    title: "See what matters right away",
    description:
      "Keep an eye on bookings, approvals, and maintenance progress with a calmer, easier flow.",
  },
];

const demoUsers = [
  {
    role: "Demo Admin",
    email: "admin@my.sliit.lk",
    password: "Admin@123",
  },
  {
    role: "Maintenance Staff",
    email: "maintenance@my.sliit.lk",
    password: "Maintenance@123",
  },
];

export default function ALoginView({
  clearMessages,
  setCurrentDashboard,
  loginForm,
  setLoginForm,
  handleLoginSubmit,
  handleGoogleLogin,
  errorMessage,
  successMessage,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="dashboard-shell">
      <div className="abstract-bg" />
      <div className="dashboard-wrap portal-container">
        <header className="hero-banner portal-hero-v2 auth-hero">
          <div className="hero-content">
            <span className="hero-tag">✦ Staff & Admin Portal</span>
            <h1>Welcome Back</h1>
            <p>
              Access your personalized campus dashboard to manage reservations, 
              track requests, and oversee facility operations.
            </p>
          </div>
          <div className="hero-visual">
            <div className="pulsing-orb" style={{ background: "radial-gradient(circle, var(--sky) 0%, transparent 70%)" }} />
          </div>
        </header>

        <section className="portal-action-section">
          <div className="auth-split-layout">
            <div className="auth-info-pane">
              <div className="section-header">
                <h2>Why sign in?</h2>
                <p>Unlock professional management tools</p>
              </div>
              <div className="auth-feature-list">
                {loginHighlights.map((item, index) => (
                  <div key={index} className="auth-feature-item" style={{ "--delay": `${index * 0.1}s` }}>
                    <div className="feature-dot" />
                    <div className="feature-text">
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="auth-demo-section stats-bar-premium" style={{ padding: "1.5rem", marginTop: "2rem", flexDirection: "column", alignItems: "flex-start" }}>
                <span className="stat-label" style={{ marginBottom: "1rem" }}>Quick Access Demo</span>
                <div className="demo-badge-grid">
                  {demoUsers.map((user) => (
                    <div key={user.email} className="demo-badge">
                      <span>{user.role}</span>
                      <strong>{user.email}</strong>
                      <small>{user.password}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="auth-form-pane">
              <form className="portal-card-premium login-form-card" onSubmit={handleLoginSubmit} style={{ animationDelay: "0.2s", display: "block", cursor: "default" }}>
                <div className="form-header">
                  <h3>Secure Login</h3>
                  <p>Enter your credentials below</p>
                </div>

                <div className="input-group">
                  <label className="portal-label">Email Address</label>
                  <input
                    required
                    type="email"
                    className="portal-input"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="e.g. user@my.sliit.lk"
                  />
                  <small className="auth-field-note">
                    Only `@my.sliit.lk` accounts can access the system.
                  </small>
                </div>

                <div className="input-group">
                  <label className="portal-label">Password</label>
                  <div className="password-wrapper">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      className="portal-input"
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="form-footer-actions">
                  <button type="submit" className="primary-btn portal-btn">
                    Sign In
                  </button>
                  <button
                    type="button"
                    className="secondary-btn portal-btn"
                    onClick={handleGoogleLogin}
                  >
                    Continue With Google
                  </button>
                  <button
                    type="button"
                    className="secondary-btn portal-btn-link"
                    onClick={() => {
                      clearMessages();
                      setCurrentDashboard("register");
                    }}
                  >
                    Don&apos;t have an account? <strong>Register</strong>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>


        {errorMessage && (
          <div className="toast-message error">
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="toast-message success">
            <span>{successMessage}</span>
          </div>
        )}
      </div>
    </main>
  );
}
