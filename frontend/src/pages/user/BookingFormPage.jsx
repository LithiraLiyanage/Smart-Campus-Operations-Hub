import { useState } from "react";
import { createBooking } from "../../api/bookingApi";
import "./BookingFormPage.css";

const today = new Date().toISOString().split("T")[0];

export default function BookingFormPage() {
  const [form, setForm] = useState({
    resourceId: "", resourceName: "",
    userId: "", userName: "",
    purpose: "", expectedAttendees: 1,
    specialRequirements: "", contactNumber: "",
    bookingDate: "", startTime: "", endTime: "",
  });
  const [errors, setErrors] = useState({});  // For future validation error handling
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
  if (errors[e.target.name]) {
    setErrors({ ...errors, [e.target.name]: null });
  }
  };
  // Basic client-side validation function 
  const validate = () => {
  const newErrors = {};

  if (!form.resourceId.trim())
    newErrors.resourceId = "Resource ID is required";

  if (!form.resourceName.trim())
    newErrors.resourceName = "Resource Name is required";

  if (!form.userId.trim())
    newErrors.userId = "User ID is required";

  if (!form.userName.trim())
    newErrors.userName = "User Name is required";

  if (!form.contactNumber.trim()) {
    newErrors.contactNumber = "Contact number is required";
  } else if (!/^0\d{9}$/.test(form.contactNumber.trim())) {
    newErrors.contactNumber = "Must be 10 digits starting with 0 (e.g. 0771234567)";
  }

  if (!form.bookingDate)
    newErrors.bookingDate = "Booking date is required";

  if (!form.startTime)
    newErrors.startTime = "Start time is required";

  if (!form.endTime) {
    newErrors.endTime = "End time is required";
  } else if (form.startTime && form.endTime <= form.startTime) {
    newErrors.endTime = "End time must be after start time";
  }

  if (!form.purpose.trim())
    newErrors.purpose = "Purpose is required";

  if (!form.expectedAttendees || form.expectedAttendees < 1)
    newErrors.expectedAttendees = "At least 1 attendee required";

  return newErrors;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("Please fix the errors before submitting.", "error");
      return;
    }
    setErrors({});
    setLoading(true);
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
        resourceId: "", resourceName: "",
        userId: "", userName: "",
        purpose: "", expectedAttendees: 1,
        specialRequirements: "", contactNumber: "",
        bookingDate: "", startTime: "", endTime: "",
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

      {/* Top bar */}
      <div className="booking-topbar">
        <div className="booking-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1>Request a Booking</h1>
          <p>Fill in the details below to reserve your resource</p>
        </div>
      </div>

      {/* Form content */}
      <div className="booking-content">
        <div className="booking-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">

  {/* Resource Details */}
  <div className="form-section-title">Resource Details</div>
  <div className="form-group">
    <label>Resource ID <span className="required">*</span></label>
    <input
      name="resourceId"
      value={form.resourceId}
      onChange={(e) => setForm({ ...form, resourceId: e.target.value.toUpperCase() })}
      required
      placeholder="e.g. LAB-101"
      className={errors.resourceId ? "input-error" : ""}
    />
    {errors.resourceId && <span className="field-error">{errors.resourceId}</span>}
  </div>
  <div className="form-group col-span-3">
    <label>Resource Name <span className="required">*</span></label>
    <input
      name="resourceName"
      value={form.resourceName}
      onChange={handleChange}
      required
      placeholder="e.g. Computer Lab 1"
      className={errors.resourceName ? "input-error" : ""}
    />
    {errors.resourceName && <span className="field-error">{errors.resourceName}</span>}
  </div>

  {/* User Details */}
  <div className="form-section-title">User Details</div>
  <div className="form-group">
    <label>User ID <span className="required">*</span></label>
    <input
      name="userId"
      value={form.userId}
      onChange={handleChange}
      required
      placeholder="e.g. USR-001"
      className={errors.userId ? "input-error" : ""}
    />
    {errors.userId && <span className="field-error">{errors.userId}</span>}
  </div>
  <div className="form-group col-span-2">
    <label>User Name <span className="required">*</span></label>
    <input
      name="userName"
      value={form.userName}
      onChange={handleChange}
      required
      placeholder="e.g. John Doe"
      className={errors.userName ? "input-error" : ""}
    />
    {errors.userName && <span className="field-error">{errors.userName}</span>}
  </div>
  <div className="form-group">
    <label>Contact Number <span className="required">*</span></label>
    <input
      name="contactNumber"
      type="tel"
      value={form.contactNumber}
      onChange={handleChange}
      required
      placeholder="e.g. 0771234567"
      maxLength={10}
      className={errors.contactNumber ? "input-error" : ""}
    />
    {errors.contactNumber && <span className="field-error">{errors.contactNumber}</span>}
  </div>

  {/* Booking Schedule */}
  <div className="form-section-title">Booking Schedule</div>
  <div className="form-group">
    <label>Booking Date <span className="required">*</span></label>
    <input
      name="bookingDate"
      type="date"
      value={form.bookingDate}
      onChange={handleChange}
      required
      min={today}
      className={errors.bookingDate ? "input-error" : ""}
    />
    {errors.bookingDate && <span className="field-error">{errors.bookingDate}</span>}
  </div>
  <div className="form-group">
    <label>Start Time <span className="required">*</span></label>
    <input
      name="startTime"
      type="time"
      value={form.startTime}
      onChange={handleChange}
      required
      className={errors.startTime ? "input-error" : ""}
    />
    {errors.startTime && <span className="field-error">{errors.startTime}</span>}
  </div>
  <div className="form-group">
    <label>End Time <span className="required">*</span></label>
    <input
      name="endTime"
      type="time"
      value={form.endTime}
      onChange={handleChange}
      required
      className={errors.endTime ? "input-error" : ""}
    />
    {errors.endTime && <span className="field-error">{errors.endTime}</span>}
  </div>
  <div className="form-group">
    <label>Capacity <span className="required">*</span></label>
    <input
      name="expectedAttendees"
      type="number"
      min="1"
      value={form.expectedAttendees}
      onChange={handleChange}
      required
      className={errors.expectedAttendees ? "input-error" : ""}
    />
    {errors.expectedAttendees && <span className="field-error">{errors.expectedAttendees}</span>}
  </div>

  {/* Booking Details */}
  <div className="form-section-title">Booking Details</div>
  <div className="form-group col-span-2">
    <label>Purpose <span className="required">*</span></label>
    <input
      name="purpose"
      value={form.purpose}
      onChange={handleChange}
      required
      placeholder="e.g. CS Lab Session"
      className={errors.purpose ? "input-error" : ""}
    />
    {errors.purpose && <span className="field-error">{errors.purpose}</span>}
  </div>
  <div className="form-group col-span-2">
    <label>Special Requirements <span className="optional">(Optional)</span></label>
    <textarea
      name="specialRequirements"
      value={form.specialRequirements}
      onChange={handleChange}
      placeholder="e.g. Projector, whiteboard, AC required..."
    />
  </div>

</div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? <><div className="spinner"></div>Submitting...</>
                : "Submit Booking Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}