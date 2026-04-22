export default function APortalView({
  portalActions,
  handlePortalAction,
  successMessage,
}) {
  return (
    <main className="dashboard-shell">
      <div className="abstract-bg" />
      <div className="dashboard-wrap">
        <header className="hero-banner portal-hero">
          <span className="hero-tag">✦ Smart Campus Access</span>
          <h1>Smart Campus Portal</h1>
          <p>
            Welcome! Select an action below to get started. Book rooms, submit
            support tickets, or access the admin management panel.
          </p>
        </header>

        <section className="action-grid portal-grid">
          {portalActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className={`action-button ${action.accent}`}
              onClick={() => handlePortalAction(action.id)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-title">{action.title}</span>
              <small>{action.subtitle}</small>
            </button>
          ))}
        </section>

        {successMessage && <p className="message success">{successMessage}</p>}
      </div>
    </main>
  );
}
