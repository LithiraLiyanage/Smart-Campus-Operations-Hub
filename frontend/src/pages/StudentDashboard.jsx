import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiLogOut, FiPlus, FiFileText, FiMapPin, FiClock, FiCheckCircle, FiAlertCircle, FiUpload, FiTrendingUp } from "react-icons/fi";

const API = "http://localhost:8081";

function StatusBadge({ status }) {
  const key = status.toLowerCase();
  return <span className={`badge ${key}`}>{status.replace("_", " ")}</span>;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    location: "",
    preferredContact: ""
  });
  const [files, setFiles] = useState([]);
  const [tickets, setTickets] = useState([]);

  const loadTickets = async () => {
    const res = await axios.get(`${API}/api/tickets/student/${encodeURIComponent(user.email)}`);
    setTickets(res.data);
  };

  useEffect(() => { loadTickets(); }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    data.append("studentName", user.name);
    data.append("studentEmail", user.email);
    Array.from(files).forEach(file => data.append("files", file));

    await axios.post(`${API}/api/tickets`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setForm({ title: "", description: "", category: "", priority: "", location: "", preferredContact: "" });
    setFiles([]);
    await loadTickets();
    alert("Ticket submitted successfully");
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-topbar">
        <div className="brand-header">
          <div className="logo-container">
            <div className="logo-icon">
              <FiTrendingUp className="logo-symbol" />
            </div>
            <div>
              <h1 className="brand-title">Smart Campus Operations Hub</h1>
              <p className="brand-subtitle">Student Dashboard</p>
            </div>
          </div>
          <p className="dashboard-description">Welcome {user.name}. Create incident tickets and track your previous submissions.</p>
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
            <div className="stat-number">{tickets.filter(t => t.status === 'OPEN').length}</div>
            <div className="stat-label">Open Tickets</div>
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
            <div className="stat-label">Resolved</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon tech-stat">
            <FiFileText />
          </div>
          <div className="stat-content">
            <div className="stat-number">{tickets.length}</div>
            <div className="stat-label">Total Tickets</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2>Submit a new incident ticket</h2>
            <div className="card-header-icon">
              <FiPlus />
            </div>
          </div>
          <p className="helper-text">Students can attach up to 3 images directly in the ticket form.</p>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Ticket Title</label>
              <input 
                placeholder="Brief description of the issue" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                required 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea 
                placeholder="Describe the issue clearly" 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                required 
                className="form-textarea"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input 
                placeholder="e.g. Electrical, WiFi, Plumbing" 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })} 
                required 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} required className="form-select">
                <option value="">Select priority</option>
                <option value="LOW">Low - Minor issue</option>
                <option value="MEDIUM">Medium - Affects functionality</option>
                <option value="HIGH">High - Urgent attention needed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location / Resource</label>
              <input 
                placeholder="Building, room number, or specific resource" 
                value={form.location} 
                onChange={(e) => setForm({ ...form, location: e.target.value })} 
                required 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Contact (Phone Number)</label>
              <input 
                type="tel"
                placeholder="Enter 10-digit phone number" 
                value={form.preferredContact} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setForm({ ...form, preferredContact: value });
                }} 
                required 
                className="form-input"
                maxLength={10}
                pattern="[0-9]{10}"
                title="Please enter exactly 10 digits"
              />
              {form.preferredContact && form.preferredContact.length < 10 && (
                <span className="validation-error">Phone number must be exactly 10 digits</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Attach Evidence (Optional)</label>
              <div className="file-upload-wrapper">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => setFiles(e.target.files)} 
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <FiUpload className="upload-icon" />
                  <span>{files.length > 0 ? `${files.length} file(s) selected` : 'Choose images to upload'}</span>
                </label>
              </div>
            </div>
            <button className="primary-btn" type="submit">
              <FiPlus />
              Submit Ticket
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>My Tickets</h2>
            <div className="card-header-icon">
              <FiFileText />
            </div>
          </div>
          <div className="ticket-list">
            {tickets.length === 0 && (
              <div className="empty-state">
                <FiFileText className="empty-icon" />
                <p className="empty-text">No tickets submitted yet.</p>
                <p className="empty-subtext">Create your first ticket to get started!</p>
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
                        <FiMapPin className="meta-icon" />
                        {ticket.location}
                      </span>
                      <span className="meta-item">
                        <FiUser className="meta-icon" />
                        {ticket.assignedTechnician || "Not assigned yet"}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
                <div className="ticket-details">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Category</span>
                      <span className="detail-value">{ticket.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Priority</span>
                      <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
                    </div>
                  </div>
                  {ticket.rejectedReason && (
                    <div className="reason-box rejected-reason">
                      <strong>Rejected reason:</strong> {ticket.rejectedReason}
                    </div>
                  )}
                  {ticket.resolutionNotes && (
                    <div className="reason-box resolution-notes">
                      <strong>Resolution:</strong> {ticket.resolutionNotes}
                    </div>
                  )}
                  {ticket.attachments?.length > 0 && (
                    <div className="attachments-section">
                      <strong>Evidence Images:</strong>
                      <div className="preview-images">
                        {ticket.attachments.map((file, index) => (
                          <a key={index} href={`${API}/${file}`} target="_blank" rel="noreferrer" className="attachment-link">
                            <FiFileText className="attachment-icon" />
                            Evidence {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
