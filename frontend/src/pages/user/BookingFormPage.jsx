import { useState } from "react";
import { createBooking } from "../../api/bookingApi";
import "./BookingFormPage.css";

export default function BookingFormPage() {
  const [form, setForm] = useState({
    resourceId: "",
    userId: "user123",
    purpose: "",
    expectedAttendees: 1,
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBooking(form);
      showToast("Booking request submitted successfully!", "success");
      setForm({ resourceId: "", userId: "user123", purpose: "", expectedAttendees: 1, startTime: "", endTime: "" });
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to submit booking.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}

      <div className="booking-wrapper">
        <div className="booking-header">
          <div className="booking-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1>Request a Booking</h1>
          <p>Fill in the details to reserve your resource</p>
        </div>

        <div className="booking-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Resource ID</label>
              <input name="resourceId" value={form.resourceId} onChange={handleChange}
                required placeholder="e.g. LAB-101" />
            </div>

            <div className="form-group">
              <label>Purpose</label>
              <input name="purpose" value={form.purpose} onChange={handleChange}
                required placeholder="e.g. CS Lab Session" />
            </div>

            <div className="form-group">
              <label>Expected Attendees</label>
              <input name="expectedAttendees" type="number" min="1"
                value={form.expectedAttendees} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time</label>
                <input name="startTime" type="datetime-local"
                  value={form.startTime} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input name="endTime" type="datetime-local"
                  value={form.endTime} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <><div className="spinner"></div> Submitting...</> : "Submit Booking Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}