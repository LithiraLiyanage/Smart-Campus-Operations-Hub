import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiLogOut, FiCheckCircle, FiClock, FiMapPin, FiMail, FiUpload, FiActivity, FiTrendingUp, FiAlertCircle } from "react-icons/fi";

const API = "http://localhost:8081";

function StatusBadge({ status }) {
  return <span className={`badge ${status.toLowerCase()}`}>{status.replace("_", " ")}</span>;
}

export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [tickets, setTickets] = useState([]);
  const [notes, setNotes] = useState({});
  const [files, setFiles] = useState({});

  const loadTickets = async () => {
    const res = await axios.get(`${API}/api/tickets/technician/${encodeURIComponent(user.email)}`);
    setTickets(res.data);
  };

  useEffect(() => { loadTickets(); }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const resolveTicket = async (ticketId) => {
    if (!notes[ticketId]) {
      alert("Please add a technician comment");
      return;
    }
    const data = new FormData();
    data.append("resolutionNotes", notes[ticketId]);
    const selectedFiles = files[ticketId] ? Array.from(files[ticketId]) : [];
    selectedFiles.forEach((file) => data.append("files", file));
    await axios.patch(`${API}/api/tickets/${ticketId}/resolve?role=${user.role}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    await loadTickets();
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-topbar">
        <div className="brand-header">
          <div className="logo-container">
            <div className="logo-icon">
              <FiActivity className="logo-symbol" />
            </div>
            <div>
              <h1 className="brand-title">Smart Campus Operations Hub</h1>
              <p className="brand-subtitle">Technician Dashboard</p>
            </div>
          </div>
          <p className="dashboard-description">See assigned tickets, add proof images, and mark work as resolved.</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          Logout
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon open-stat">
            <FiClock />
          </div>
          <div className="stat-content">
            <div className="stat-number">{tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length}</div>
            <div className="stat-label">Active Tickets</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon progress-stat">
            <FiAlertCircle />
          </div>
          <div className="stat-content">
            <div className="stat-number">{tickets.filter(t => t.status === 'IN_PROGRESS').length}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon resolved-stat">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-number">{tickets.filter(t => t.status === 'RESOLVED').length}</div>
            <div className="stat-label">Resolved Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon tech-stat">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <div className="stat-number">{tickets.length}</div>
            <div className="stat-label">Total Assigned</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Assigned Tickets</h2>
          <div className="card-header-icon">
            <FiAlertCircle />
          </div>
        </div>
        <div className="ticket-list">
          {tickets.length === 0 && (
            <div className="empty-state">
              <FiAlertCircle className="empty-icon" />
              <p className="empty-text">No tickets assigned yet.</p>
              <p className="empty-subtext">Check back later for new assignments!</p>
            </div>
          )}
          {tickets.map((ticket) => (
            <div className="ticket-item" key={ticket.id}>
              <div className="ticket-header">
                <div className="ticket-title-section">
                  <h3 className="ticket-title">{ticket.title}</h3>
                  <p className="ticket-description">{ticket.description}</p>
                  <div className="ticket-meta">
                    <span className="meta-item">
                      <FiUser className="meta-icon" />
                      {ticket.studentName}
                    </span>
                    <span className="meta-item">
                      <FiMapPin className="meta-icon" />
                      {ticket.location}
                    </span>
                    <span className="meta-item">
                      <FiMail className="meta-icon" />
                      {ticket.preferredContact}
                    </span>
                  </div>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
              <div className="ticket-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Priority</span>
                    <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{ticket.category}</span>
                  </div>
                </div>
                {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
                  <div className="actions-section">
                    <div className="form-group">
                      <label className="form-label">Resolution Comment</label>
                      <textarea 
                        placeholder="Describe the work completed and any relevant details" 
                        value={notes[ticket.id] || ""} 
                        onChange={(e) => setNotes({ ...notes, [ticket.id]: e.target.value })} 
                        className="form-textarea"
                        rows={3}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Attach Proof Images (Optional)</label>
                      <div className="file-upload-wrapper">
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          onChange={(e) => setFiles({ ...files, [ticket.id]: e.target.files })} 
                          className="file-input"
                          id={`file-upload-${ticket.id}`}
                        />
                        <label htmlFor={`file-upload-${ticket.id}`} className="file-upload-label">
                          <FiUpload className="upload-icon" />
                          <span>{files[ticket.id]?.length > 0 ? `${files[ticket.id].length} file(s) selected` : 'Choose proof images'}</span>
                        </label>
                      </div>
                    </div>
                    <button className="success-btn" onClick={() => resolveTicket(ticket.id)}>
                      <FiCheckCircle />
                      Mark as Resolved
                    </button>
                  </div>
                )}
                {ticket.resolutionNotes && (
                  <div className="reason-box resolution-notes">
                    <strong>Resolution note:</strong> {ticket.resolutionNotes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
