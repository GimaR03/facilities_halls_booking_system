import { useState } from "react";

const checklist = [
  "Use a @my.sliit.lk email address",
  "Password must be at least 6 characters",
  "Admin and maintenance accounts are managed separately",
];

export default function ARegisterView({
  clearMessages,
  setCurrentDashboard,
  registerForm,
  setRegisterForm,
  handleRegisterSubmit,
  errorMessage,
  successMessage,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="dashboard-shell">
      <div className="abstract-bg" />
      <div className="dashboard-wrap portal-container">
        <header className="hero-banner portal-hero-v2 register-hero-v2">
          <div className="hero-content">
            <span className="hero-tag">✦ Create Account</span>
            <h1>Register Your Campus Access</h1>
            <p>
              Create a standard user account with your SLIIT email, then sign in to
              access room booking and ticket submission.
            </p>
          </div>
          <div className="hero-visual">
            <div
              className="pulsing-orb"
              style={{ background: "radial-gradient(circle, var(--leaf) 0%, transparent 70%)" }}
            />
          </div>
        </header>

        <section className="portal-action-section">
          <div className="auth-split-layout registration-layout">
            <div className="auth-form-pane">
              <form
                className="portal-card-premium login-form-card"
                onSubmit={handleRegisterSubmit}
                style={{ animationDelay: "0.1s", display: "block", cursor: "default" }}
              >
                <div className="form-header">
                  <h3>New User Registration</h3>
                  <p>Email and password are enough to get started</p>
                </div>

                <div className="input-group">
                  <label className="portal-label">Full Name (Optional)</label>
                  <input
                    className="portal-input"
                    value={registerForm.fullName}
                    onChange={(event) =>
                      setRegisterForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    placeholder="e.g. Nethmi Perera"
                  />
                </div>

                <div className="input-group">
                  <label className="portal-label">Campus Email</label>
                  <input
                    required
                    type="email"
                    className="portal-input"
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="e.g. user@my.sliit.lk"
                  />
                </div>

                <div className="input-group">
                  <label className="portal-label">Password</label>
                  <div className="password-wrapper">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      className="portal-input"
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label className="portal-label">Confirm Password</label>
                  <div className="password-wrapper">
                    <input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      className="portal-input"
                      value={registerForm.confirmPassword}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          confirmPassword: event.target.value,
                        }))
                      }
                      placeholder="Repeat your password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="form-footer-actions">
                  <button type="submit" className="primary-btn portal-btn">
                    Create Account
                  </button>
                  <button
                    type="button"
                    className="secondary-btn portal-btn-link"
                    onClick={() => {
                      clearMessages();
                      setCurrentDashboard("login");
                    }}
                  >
                    Already have an account? <strong>Login</strong>
                  </button>
                </div>
              </form>
            </div>

            <aside className="auth-info-pane registration-side">
              <div
                className="stats-bar-premium register-status-card"
                style={{ flexDirection: "column", padding: "1.5rem" }}
              >
                <span className="stat-label" style={{ marginBottom: "1rem" }}>
                  Registration Rules
                </span>
                <div className="auth-feature-list">
                  {checklist.map((item) => (
                    <div key={item} className="auth-feature-item">
                      <div className="feature-dot" />
                      <div className="feature-text">
                        <strong>{item}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
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
