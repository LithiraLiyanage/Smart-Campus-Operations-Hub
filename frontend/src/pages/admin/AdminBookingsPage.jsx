import { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus, deleteBooking } from "../../api/bookingApi";
import "./AdminBookingsPage.css";

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status}`}>{status}</span>
);

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState({});
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch {
      showToast("Failed to load bookings.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleApprove = async (id) => {
    setActionLoading(id + "_approve");
    try {
      await updateBookingStatus(id, "APPROVED", "");
      showToast("Booking approved successfully.", "success");
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to approve.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason[id]?.trim()) {
      showToast("Please enter a rejection reason.", "error");
      return;
    }
    setActionLoading(id + "_reject");
    try {
      await updateBookingStatus(id, "REJECTED", rejectReason[id]);
      showToast("Booking rejected.", "success");
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to reject.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this booking?")) return;
    try {
      await deleteBooking(id);
      showToast("Booking deleted.", "success");
      fetchBookings();
    } catch {
      showToast("Failed to delete.", "error");
    }
  };

  return (
    <div className="admin-page">

      {toast && (
        <div className={`toast ${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}

      {/* Top bar */}
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <div className="admin-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1>Booking Management</h1>
            <p>Review, approve, or reject booking requests</p>
          </div>
        </div>

        {/* Stats in topbar */}
        {!loading && (
          <div className="stats-row">
            {["PENDING", "APPROVED", "REJECTED", "CANCELLED"].map((s) => (
              <div key={s} className={`stat-card stat-${s}`}>
                <div className="count">{bookings.filter(b => b.status === s).length}</div>
                <div className="label">{s}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="admin-content">
        <div className="table-card">
          {loading ? (
            <div className="loading-center">
              <div className="spinner-blue"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">📋</div>
              <h3>No bookings yet</h3>
              <p>Booking requests will appear here</p>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>User</th>
                    <th>Purpose</th>
                    <th>Schedule</th>
                    <th>Attendees</th>
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
                      <td>
                        <div style={{ fontWeight: 500, color: "#1e293b" }}>{b.userName || b.userId}</div>
                        <div className="time-sub">{b.contactNumber}</div>
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
                      <td><StatusBadge status={b.status} /></td>
                      <td>
                        <div className="actions-cell">
                          {b.status === "PENDING" && (
                            <>
                              <div className="action-buttons">
                                <button className="approve-btn"
                                  onClick={() => handleApprove(b.id)}
                                  disabled={actionLoading === b.id + "_approve"}>
                                  ✓ Approve
                                </button>
                                <button className="reject-btn"
                                  onClick={() => handleReject(b.id)}
                                  disabled={actionLoading === b.id + "_reject"}>
                                  ✕ Reject
                                </button>
                              </div>
                              <input className="reason-input" type="text"
                                placeholder="Rejection reason..."
                                value={rejectReason[b.id] || ""}
                                onChange={(e) => setRejectReason({
                                  ...rejectReason, [b.id]: e.target.value
                                })}
                              />
                            </>
                          )}
                          <button className="delete-btn"
                            onClick={() => handleDelete(b.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}