import { useState } from "react";
import { createBooking } from "../../api/bookingApi";
import "./BookingFormPage.css";

const today = new Date().toISOString().split("T")[0];
const now = new Date().toTimeString().slice(0, 5);

export default function BookingFormPage() {
  const [form, setForm] = useState({
    resourceId: "",
    resourceName: "",
    userId: "",
    userName: "",
    purpose: "",
    expectedAttendees: 1,
    specialRequirements: "",
    contactNumber: "",
    bookingDate: "",
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

    // Validate end time is after start time
    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      showToast("End time must be after start time.", "error");
      setLoading(false);
      return;
    }

    try {
      const formattedData = {
        resourceId: form.resourceId,
        resourceName: form.resourceName,
        userId: form.userId,
        userName: form.userName,
        purpose: form.purpose,
        expectedAttendees: parseInt(form.expectedAttendees),
        specialRequirements: form.specialRequirements,
        contactNumber: form.contactNumber,
        startTime: `${form.bookingDate}T${form.startTime}:00`,
        endTime: `${form.bookingDate}T${form.endTime}:00`,
      };

      await createBooking(formattedData);
      showToast("Booking request submitted successfully!", "success");
      setForm({
        resourceId: "",
        resourceName: "",
        userId: "",
        userName: "",
        purpose: "",
        expectedAttendees: 1,
        specialRequirements: "",
        contactNumber: "",
        bookingDate: "",
        startTime: "",
        endTime: "",
      });
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
      {/* Header */}
      <div className="booking-header">
        <div className="booking-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="booking-header-text">
          <h1>Request a Booking</h1>
          <p>Fill in the details to reserve your resource</p>
        </div>
      </div>

      {/* Card */}
      <div className="booking-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* Resource Details */}
            <div className="form-section-title">Resource Details</div>
            <div className="form-group">
              <label>Resource ID <span className="required">*</span></label>
              <input name="resourceId" value={form.resourceId}
                onChange={handleChange} required placeholder="e.g. LAB-101" />
            </div>
            <div className="form-group col-span-2">
              <label>Resource Name <span className="required">*</span></label>
              <input name="resourceName" value={form.resourceName}
                onChange={handleChange} required placeholder="e.g. Computer Lab 1" />
            </div>

            {/* User Details */}
            <div className="form-section-title">User Details</div>
            <div className="form-group">
              <label>User ID <span className="required">*</span></label>
              <input name="userId" value={form.userId}
                onChange={handleChange} required placeholder="e.g. USR-001" />
            </div>
            <div className="form-group col-span-2">
              <label>User Name <span className="required">*</span></label>
              <input name="userName" value={form.userName}
                onChange={handleChange} required placeholder="e.g. John Doe" />
            </div>

            {/* Booking Schedule */}
            <div className="form-section-title">Booking Schedule</div>
            <div className="form-group">
              <label>Booking Date <span className="required">*</span></label>
              <input name="bookingDate" type="date" value={form.bookingDate}
                onChange={handleChange} required min={today} />
            </div>
            <div className="form-group">
              <label>Start Time <span className="required">*</span></label>
              <input name="startTime" type="time" value={form.startTime}
                onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>End Time <span className="required">*</span></label>
              <input name="endTime" type="time" value={form.endTime}
                onChange={handleChange} required />
            </div>

            {/* Booking Details */}
            <div className="form-section-title">Booking Details</div>
            <div className="form-group col-span-2">
              <label>Purpose <span className="required">*</span></label>
              <input name="purpose" value={form.purpose}
                onChange={handleChange} required placeholder="e.g. CS Lab Session" />
            </div>
            <div className="form-group">
              <label>Capacity <span className="required">*</span></label>
              <input name="expectedAttendees" type="number" min="1"
                value={form.expectedAttendees} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact Number <span className="required">*</span></label>
              <input name="contactNumber" type="tel" value={form.contactNumber}
                onChange={handleChange} required placeholder="e.g. 0771234567" />
            </div>
            <div className="form-group col-span-2">
              <label>Special Requirements <span className="optional">(Optional)</span></label>
              <textarea name="specialRequirements" value={form.specialRequirements}
                onChange={handleChange} placeholder="e.g. Projector, whiteboard, etc."
                rows={3} />
            </div>

          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? <><div className="spinner"></div> Submitting...</>
              : "Submit Booking Request"}
          </button>
        </form>
      </div>
    </div>
  </div>
);
}