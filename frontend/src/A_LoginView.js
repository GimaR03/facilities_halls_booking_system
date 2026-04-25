import { useState } from "react";

const loginHighlights = [
  {
    eyebrow: "Hall reservations",
    title: "Plan rooms with less back-and-forth",
    description:
      "Check availability, submit requests, and return to active bookings from one organized dashboard.",
    icon: "RS",
  },
  {
    eyebrow: "Ticket visibility",
    title: "Follow maintenance progress clearly",
    description:
      "Track requests, technician updates, and operational changes without chasing scattered messages.",
    icon: "TK",
  },
  {
    eyebrow: "Admin control",
    title: "Review approvals with the right context",
    description:
      "Keep reservations, facilities data, and staff workflows aligned in a shared campus workspace.",
    icon: "AD",
  },
];

const platformStats = [
  { value: "3", label: "connected workflows in one place" },
  { value: "24/7", label: "visibility into requests and updates" },
  { value: "1", label: "shared hub for halls and facilities" },
];

const platformMoments = [
  {
    title: "Reserve spaces",
    description: "Handle halls, labs, and classrooms from a single booking flow.",
  },
  {
    title: "Monitor requests",
    description: "See approvals, ticket activity, and operational updates in context.",
  },
  {
    title: "Support your team",
    description: "Give admins and maintenance staff one coordinated place to work.",
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

  void handleGoogleLogin;

  return (
    <main className="dashboard-shell">
      <div className="abstract-bg" />
      <div className="dashboard-wrap portal-container">
        <header className="hero-banner admin-hero-v3 login-hero-v4">
          <div className="hero-content login-hero-content">
            <span className="hero-tag">Staff &amp; Admin Portal</span>
            <h1>Welcome back to your facilities hub</h1>
            <p>
              Manage hall bookings, monitor maintenance tickets, and keep campus
              operations moving from one calm, connected workspace.
            </p>
            <div className="hero-signal-strip">
              <span className="hero-signal-pill">Room reservations</span>
              <span className="hero-signal-pill">Maintenance tracking</span>
              <span className="hero-signal-pill">Admin approvals</span>
            </div>
          </div>

          <aside className="hero-focus-card">
            <span className="hero-focus-kicker">Built for daily campus operations</span>
            <strong>One sign-in opens the tools your role needs most.</strong>
            <p>
              Staff, administrators, and maintenance teams can each move through
              requests faster with cleaner visibility and fewer handoff delays.
            </p>
            <div className="hero-focus-metrics">
              <div>
                <span>Bookings</span>
                <strong>Centralized</strong>
              </div>
              <div>
                <span>Updates</span>
                <strong>Clear</strong>
              </div>
            </div>
          </aside>
        </header>

        <section className="auth-layout-v3">
          <div className="auth-info-v3">
            <div className="section-header">
              <span className="panel-kicker">Campus Operations</span>
              <h2>Everything your team needs in one place</h2>
              <p>
                This website helps staff manage bookings, approvals, and
                maintenance activity with a cleaner experience that is easy to
                return to every day.
              </p>
            </div>

            <div className="auth-story-card">
              <span className="auth-story-kicker">Why teams choose this portal</span>
              <strong>
                From lecture hall scheduling to maintenance follow-up, each step
                stays visible, practical, and easier to manage.
              </strong>
              <p>
                The experience is designed to reduce confusion, keep requests
                moving, and give every campus team a shared view of what needs
                attention next.
              </p>
            </div>

            <div className="auth-feature-grid">
              {loginHighlights.map((item) => (
                <article key={item.title} className="auth-feature-v3">
                  <div className="icon">{item.icon}</div>
                  <div className="auth-feature-copy">
                    <span>{item.eyebrow}</span>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="auth-metric-grid">
              {platformStats.map((item) => (
                <div key={item.label} className="stat-card-v3 auth-metric-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="auth-workflow-card">
              <span className="auth-workflow-kicker">What you can do here</span>
              <div className="auth-workflow-list">
                {platformMoments.map((item) => (
                  <div key={item.title} className="auth-workflow-item">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="auth-card-v3 auth-card-shell animate-fade-in">
            <div className="form-header auth-form-header">
              <span className="panel-kicker">Protected Access</span>
              <h3>Secure Login</h3>
              <p>
                Sign in with your campus account to continue to bookings,
                approvals, and maintenance tools.
              </p>
            </div>

            <div className="auth-card-note">
              Your dashboard adapts to your role so the most relevant tools are
              ready as soon as you enter.
            </div>

            <form className="modern-form-wrap" onSubmit={handleLoginSubmit}>
              <label className="modern-label">
                Campus Email
                <input
                  required
                  type="email"
                  className="modern-input"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="e.g. admin@my.sliit.lk"
                />
              </label>

              <label className="modern-label">
                Password
                <div className="password-wrapper">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    className="modern-input"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="password-inline-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <div className="login-utility-row">
                <label className="remember-check">
                  <input type="checkbox" />
                  Remember me
                </label>
                <button type="button" className="forgot-link">
                  Forgot Password?
                </button>
              </div>

              <div className="auth-button-stack">
                <button type="submit" className="tiny-btn auth-submit-btn">
                  Sign In to Dashboard
                </button>
                <button
                  type="button"
                  className="tiny-btn auth-secondary-btn"
                  onClick={() => {
                    clearMessages();
                    setCurrentDashboard("register");
                  }}
                >
                  Create New Account
                </button>
              </div>

              <p className="form-note">
                New here? Create an account to start managing facilities,
                reservations, and support requests with your team.
              </p>
            </form>
          </div>
        </section>

        {errorMessage && (
          <div className="toast-message error animate-fade-in">
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="toast-message success animate-fade-in">
            <span>{successMessage}</span>
          </div>
        )}
      </div>
    </main>
  );
}
