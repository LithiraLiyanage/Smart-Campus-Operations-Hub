import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserBookings, cancelBooking, deleteBooking } from "../../api/bookingApi";
import "./MyBookingsPage.css";

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status}`}>{status}</span>
);

export default function MyBookingsPage() {
  const { userId } = useParams();
  const currentUserId = userId || "user123";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [editBooking, setEditBooking] = useState(null); // booking being edited
  const [editForm, setEditForm] = useState({});

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getUserBookings(currentUserId);
      setBookings(res.data);
    } catch {
      showToast("Failed to load bookings.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [currentUserId]);

  // Cancel approved booking
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(id, currentUserId);
      showToast("Booking cancelled successfully.", "success");
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to cancel.", "error");
    }
  };

  // Delete booking
  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this booking?")) return;
    try {
      await deleteBooking(id);
      showToast("Booking deleted.", "success");
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete.", "error");
    }
  };

  // Open update modal
  const handleEditOpen = (booking) => {
    setEditBooking(booking);
    const startDate = booking.startTime?.split("T")[0] || "";
    const startTime = booking.startTime?.split("T")[1]?.slice(0, 5) || "";
    const endTime = booking.endTime?.split("T")[1]?.slice(0, 5) || "";
    setEditForm({
      resourceId: booking.resourceId || "",
      resourceName: booking.resourceName || "",
      purpose: booking.purpose || "",
      expectedAttendees: booking.expectedAttendees || 1,
      specialRequirements: booking.specialRequirements || "",
      contactNumber: booking.contactNumber || "",
      bookingDate: startDate,
      startTime: startTime,
      endTime: endTime,
    });
  };

  // Close modal
  const handleEditClose = () => {
    setEditBooking(null);
    setEditForm({});
  };

  // Submit update
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editForm.startTime && editForm.endTime && editForm.endTime <= editForm.startTime) {
      showToast("End time must be after start time.", "error");
      return;
    }
    try {
      const updatedData = {
        resourceId: editForm.resourceId,
        resourceName: editForm.resourceName,
        userId: currentUserId,
        userName: editBooking.userName || "",
        purpose: editForm.purpose,
        expectedAttendees: parseInt(editForm.expectedAttendees),
        specialRequirements: editForm.specialRequirements,
        contactNumber: editForm.contactNumber,
        startTime: `${editForm.bookingDate}T${editForm.startTime}:00`,
        endTime: `${editForm.bookingDate}T${editForm.endTime}:00`,
      };

      // Use PUT endpoint
      await import("axios").then(({ default: axios }) =>
        axios.put(`http://localhost:8083/api/bookings/${editBooking.id}`, updatedData)
      );

      showToast("Booking updated successfully!", "success");
      handleEditClose();
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update booking.", "error");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="my-bookings-page">
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}

      {/* Update Modal */}
      {editBooking && (
        <div className="modal-overlay" onClick={handleEditClose}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Booking</h2>
              <button className="modal-close" onClick={handleEditClose}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="modal-grid">

                <div className="modal-section-title">Resource Details</div>
                <div className="modal-form-group">
                  <label>Resource ID</label>
                  <input value={editForm.resourceId}
                    onChange={(e) => setEditForm({ ...editForm, resourceId: e.target.value })}
                    required placeholder="e.g. LAB-101" />
                </div>
                <div className="modal-form-group">
                  <label>Resource Name</label>
                  <input value={editForm.resourceName}
                    onChange={(e) => setEditForm({ ...editForm, resourceName: e.target.value })}
                    required placeholder="e.g. Computer Lab 1" />
                </div>

                <div className="modal-section-title">Schedule</div>
                <div className="modal-form-group">
                  <label>Booking Date</label>
                  <input type="date" value={editForm.bookingDate} min={today}
                    onChange={(e) => setEditForm({ ...editForm, bookingDate: e.target.value })}
                    required />
                </div>
                <div className="modal-form-group">
                  <label>Start Time</label>
                  <input type="time" value={editForm.startTime}
                    onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                    required />
                </div>
                <div className="modal-form-group">
                  <label>End Time</label>
                  <input type="time" value={editForm.endTime}
                    onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                    required />
                </div>
                <div className="modal-form-group">
                  <label>Capacity</label>
                  <input type="number" min="1" value={editForm.expectedAttendees}
                    onChange={(e) => setEditForm({ ...editForm, expectedAttendees: e.target.value })}
                    required />
                </div>

                <div className="modal-section-title">Details</div>
                <div className="modal-form-group modal-col-span-2">
                  <label>Purpose</label>
                  <input value={editForm.purpose}
                    onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
                    required placeholder="e.g. CS Lab Session" />
                </div>
                <div className="modal-form-group">
                  <label>Contact Number</label>
                  <input type="tel" value={editForm.contactNumber}
                    onChange={(e) => setEditForm({ ...editForm, contactNumber: e.target.value })}
                    required placeholder="e.g. 0771234567" />
                </div>
                <div className="modal-form-group modal-col-span-3">
                  <label>Special Requirements (Optional)</label>
                  <textarea value={editForm.specialRequirements}
                    onChange={(e) => setEditForm({ ...editForm, specialRequirements: e.target.value })}
                    placeholder="e.g. Projector, whiteboard..." rows={2} />
                </div>

              </div>

              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn"
                  onClick={handleEditClose}>Cancel</button>
                <button type="submit" className="modal-submit-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="my-bookings-container">
        <div className="page-header">
          <div>
            <h1>My Bookings</h1>
            <p>Showing bookings for: <strong>{currentUserId}</strong></p>
          </div>
          <a href="/dashboard/bookings/new" className="new-booking-btn">
            + New Booking
          </a>
        </div>

        <div className="table-card">
          {loading ? (
            <div className="loading-center">
              <div className="spinner-blue"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">📭</div>
              <h3>No bookings found for "{currentUserId}"</h3>
              <p>Submit a new booking request to get started</p>
            </div>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Purpose</th>
                  <th>Schedule</th>
                  <th>Attendees</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="resource-id">{b.resourceId}</div>
                      <div className="time-sub">{b.resourceName}</div>
                    </td>
                    <td>{b.purpose}</td>
                    <td>
                      <div className="time-main">
                        {new Date(b.startTime).toLocaleDateString()}
                      </div>
                      <div className="time-sub">
                        {new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} →{" "}
                        {new Date(b.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td>{b.expectedAttendees}</td>
                    <td>{b.contactNumber || "—"}</td>
                    <td>
                      <StatusBadge status={b.status} />
                      {b.adminReason && (
                        <div style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>
                          {b.adminReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="row-actions">
                        {/* Update — only for PENDING */}
                        {b.status === "PENDING" && (
                          <button className="update-btn"
                            onClick={() => handleEditOpen(b)}>
                            ✏ Update
                          </button>
                        )}
                        {/* Cancel — only for APPROVED */}
                        {b.status === "APPROVED" && (
                          <button className="cancel-btn"
                            onClick={() => handleCancel(b.id)}>
                            Cancel
                          </button>
                        )}
                        {/* Delete — always visible */}
                        <button className="delete-row-btn"
                          onClick={() => handleDelete(b.id)}>
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}