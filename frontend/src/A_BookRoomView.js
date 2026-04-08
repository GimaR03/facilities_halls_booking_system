export default function ABookRoomView({
  clearMessages,
  setCurrentDashboard,
  buildings,
  bookRoomSelectedBuildingId,
  setBookRoomSelectedBuildingId,
  setBookRoomSelectedFloorId,
  bookRoomSelectedBuilding,
  bookRoomSelectedFloorId,
  bookRoomFloors,
  bookRoomSelectedFloor,
  bookRoomRooms,
  getRoomQuickNote,
  formatLabel,
  setErrorMessage,
  setSuccessMessage,
  errorMessage,
  successMessage,
}) {
  const step = !bookRoomSelectedBuildingId ? 1 : !bookRoomSelectedFloorId ? 2 : 3;

  return (
    <main className="dashboard-shell">
      <div className="abstract-bg" />
      <div className="dashboard-wrap">
        <header className="hero-banner portal-hero">
          <div className="hero-head-row">
            <span className="hero-tag">✦ Smart Campus Access</span>
            <button
              type="button"
              className="tiny-btn hero-back"
              onClick={() => {
                clearMessages();
                setCurrentDashboard("portal");
              }}
            >
              ← Back To Portal
            </button>
          </div>
          <h1>Book a Room</h1>
          <p>Select a building and floor to view and reserve available rooms.</p>
        </header>

        {/* Step indicators */}
        <div className="booking-steps">
          <div className={`booking-step ${step >= 1 ? "active" : ""} ${step > 1 ? "done" : ""}`}>
            <span className="step-num">{step > 1 ? "✓" : "1"}</span>
            <span className="step-label">Choose Building</span>
          </div>
          <div className="step-connector" />
          <div className={`booking-step ${step >= 2 ? "active" : ""} ${step > 2 ? "done" : ""}`}>
            <span className="step-num">{step > 2 ? "✓" : "2"}</span>
            <span className="step-label">Choose Floor</span>
          </div>
          <div className="step-connector" />
          <div className={`booking-step ${step >= 3 ? "active" : ""}`}>
            <span className="step-num">3</span>
            <span className="step-label">Pick a Room</span>
          </div>
        </div>

        <div className="book-room-container">
          <div className="book-room-selectors">
            <div className="selector-group">
              <label>🏛️ Select Building</label>
              <select
                value={bookRoomSelectedBuildingId || ""}
                onChange={(event) => {
                  setBookRoomSelectedBuildingId(event.target.value);
                  setBookRoomSelectedFloorId(null);
                }}
              >
                <option value="">— Choose a Building —</option>
                {buildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name} (No {building.buildingNo})
                  </option>
                ))}
              </select>
            </div>

            <div className={`selector-group ${!bookRoomSelectedBuilding ? "selector-disabled" : ""}`}>
              <label>🏢 Select Floor</label>
              <select
                value={bookRoomSelectedFloorId || ""}
                disabled={!bookRoomSelectedBuilding}
                onChange={(event) => setBookRoomSelectedFloorId(event.target.value)}
              >
                <option value="">
                  {bookRoomSelectedBuilding ? "— Choose a Floor —" : "Select a building first"}
                </option>
                {bookRoomFloors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!bookRoomSelectedFloor && (
            <div className="booking-placeholder">
              <p className="booking-placeholder-icon">🏢</p>
              <p className="booking-placeholder-text">
                {!bookRoomSelectedBuildingId
                  ? "Select a building above to get started."
                  : "Now select a floor to see available rooms."}
              </p>
            </div>
          )}

          {bookRoomSelectedFloor && (
            <div className="glass-panel book-room-panel">
              <div className="panel-header-actions">
                <div>
                  <p className="panel-kicker">Available Rooms</p>
                  <h2>
                    {bookRoomSelectedBuilding.name} · {bookRoomSelectedFloor.label}
                  </h2>
                </div>
                <span className="room-count-badge">
                  {bookRoomRooms.length} room{bookRoomRooms.length !== 1 ? "s" : ""}
                </span>
              </div>

              {bookRoomRooms.length === 0 ? (
                <p className="empty">No rooms on this floor.</p>
              ) : (
                <div className="room-booking-grid">
                  {bookRoomRooms.map((room) => {
                    const note = getRoomQuickNote(room);
                    const isAvailable = room.status === "ACTIVE";
                    return (
                      <article key={room.id} className="room-booking-card">
                        <div className="room-booking-card-head">
                          <div>
                            <h3>{room.name}</h3>
                            <span className="room-type-badge">
                              {formatLabel(room.type)}
                            </span>
                          </div>
                          <span
                            className={`status-pill ${room.status.toLowerCase()}`}
                          >
                            {formatLabel(room.status)}
                          </span>
                        </div>
                        <div className="room-booking-meta">
                          <span>👥 {room.capacity} seats</span>
                          <span>
                            🕐{" "}
                            {room.availabilityStart?.slice(0, 5)} –{" "}
                            {room.availabilityEnd?.slice(0, 5)}
                          </span>
                        </div>
                        <span className={`quick-note ${note.tone}`}>
                          {note.text}
                        </span>
                        <button
                          type="button"
                          className={`room-book-btn ${
                            isAvailable ? "primary-btn" : "room-book-btn-disabled"
                          }`}
                          onClick={() => {
                            if (!isAvailable) {
                              setErrorMessage(
                                `Room ${room.name} is not available for booking.`
                              );
                              return;
                            }
                            clearMessages();
                            setSuccessMessage(
                              `Booking request sent for ${room.name}.`
                            );
                          }}
                        >
                          {isAvailable ? "✓ Book Now" : "Unavailable"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {errorMessage && <p className="message error">{errorMessage}</p>}
          {successMessage && <p className="message success">{successMessage}</p>}
        </div>
      </div>
    </main>
  );
}
