import { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus, deleteBooking } from "../../api/bookingApi";
import "./AdminBookingsPage.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
// ── PDF Report Generation ----------------------------------
  const generateReport = () => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const generatedAt = new Date().toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });

  // ── Header background
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, pageWidth, 28, "F");

  // ── Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("Smart Campus Operations Hub", 14, 12);

  // ── Subtitle
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Booking Management Report", 14, 20);

  // ── Generated date on right
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${generatedAt}`, pageWidth - 14, 20, { align: "right" });

  // ── Summary stats row
  const stats = [
    { label: "Total Bookings", value: bookings.length, color: [37, 99, 235] },
    { label: "Pending",        value: bookings.filter(b => b.status === "PENDING").length,   color: [217, 119, 6] },
    { label: "Approved",       value: bookings.filter(b => b.status === "APPROVED").length,  color: [5, 150, 105] },
    { label: "Rejected",       value: bookings.filter(b => b.status === "REJECTED").length,  color: [220, 38, 38] },
    { label: "Cancelled",      value: bookings.filter(b => b.status === "CANCELLED").length, color: [100, 116, 139] },
  ];

  const statBoxWidth = (pageWidth - 28) / stats.length;
  stats.forEach((stat, i) => {
    const x = 14 + i * statBoxWidth;
    // Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, 32, statBoxWidth - 3, 16, 2, 2, "F");
    // Value
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...stat.color);
    doc.text(String(stat.value), x + (statBoxWidth - 3) / 2, 41, { align: "center" });
    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(stat.label, x + (statBoxWidth - 3) / 2, 45, { align: "center" });
  });

  // ── Table
  const tableData = bookings.map((b, index) => [
    index + 1,
    b.resourceId || "—",
    b.resourceName || "—",
    b.userName || b.userId || "—",
    b.contactNumber || "—",
    b.purpose || "—",
    b.expectedAttendees || "—",
    b.startTime ? new Date(b.startTime).toLocaleDateString() : "—",
    b.startTime
      ? `${new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} → ${new Date(b.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : "—",
    b.specialRequirements || "—",
    b.status || "—",
    b.adminReason || "—",
  ]);

  autoTable(doc, {
    startY: 52,
    head: [[
      "#", "Resource ID", "Resource Name", "User", "Contact",
      "Purpose", "Capacity", "Date", "Time", "Special Req.", "Status", "Reason"
    ]],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      font: "helvetica",
      textColor: [71, 85, 105],
      lineColor: [226, 232, 240],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0:  { cellWidth: 8,  halign: "center" },
      1:  { cellWidth: 22 },
      2:  { cellWidth: 28 },
      3:  { cellWidth: 24 },
      4:  { cellWidth: 22 },
      5:  { cellWidth: 28 },
      6:  { cellWidth: 16, halign: "center" },
      7:  { cellWidth: 22, halign: "center" },
      8:  { cellWidth: 28 },
      9:  { cellWidth: 24 },
      10: { cellWidth: 18, halign: "center" },
      11: { cellWidth: 24 },
    },
    // Color status cell
    didDrawCell: (data) => {
      if (data.section === "body" && data.column.index === 10) {
        const status = data.cell.raw;
        const colors = {
          PENDING:   [217, 119,   6],
          APPROVED:  [  5, 150, 105],
          REJECTED:  [220,  38,  38],
          CANCELLED: [100, 116, 139],
        };
        if (colors[status]) {
          doc.setTextColor(...colors[status]);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.text(
            status,
            data.cell.x + data.cell.width / 2,
            data.cell.y + data.cell.height / 2 + 1,
            { align: "center" }
          );
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // ── Footer on each page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerY = doc.internal.pageSize.getHeight() - 8;
    doc.setFillColor(248, 250, 252);
    doc.rect(0, footerY - 4, pageWidth, 12, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Smart Campus Operations Hub — Confidential", 14, footerY);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, footerY, { align: "right" });
  }

  // ── Save
  const fileName = `Booking_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
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

  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
    {/* Stats */}
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

    {/* Download button */}
    <button className="download-report-btn" onClick={generateReport}
      disabled={loading || bookings.length === 0}>
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Download Report
    </button>
  </div>

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
                        <th>Capacity</th>
                        <th>Contact</th>
                        <th>Special Requirements</th>
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
          <div className="time-sub">{b.userId}</div>
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
        <td>{b.specialRequirements || "—"}</td>
        <td>
          <StatusBadge status={b.status} />
          {b.adminReason && (
            <div className="time-sub" style={{ color: "#ef4444", marginTop: 3 }}>
              {b.adminReason}
            </div>
          )}
        </td>
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
            <button className="delete-btn" onClick={() => handleDelete(b.id)}>
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