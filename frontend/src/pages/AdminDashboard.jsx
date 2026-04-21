import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiLogOut, FiCheckCircle, FiXCircle, FiClock, FiMapPin, FiMail, FiAlertCircle, FiUsers, FiActivity } from "react-icons/fi";

const API = "http://localhost:8081";

function StatusBadge({ status }) {
  return <span className={`badge ${status.toLowerCase()}`}>{status.replace("_", " ")}</span>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [rejectReasons, setRejectReasons] = useState({});

  const loadData = async () => {
    const [ticketRes, techRes] = await Promise.all([
      axios.get(`${API}/api/tickets`),
      axios.get(`${API}/users?role=TECHNICIAN`).catch(() => ({ data: [] }))
    ]);
    setTickets(ticketRes.data);
    setTechnicians(techRes.data || []);
  };

  useEffect(() => { loadData(); }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const approveTicket = async (ticketId) => {
    const selected = technicians.find((tech) => tech.id === assignments[ticketId]);
    if (!selected) {
      alert("Please select a technician first");
      return;
    }
    await axios.patch(`${API}/api/tickets/${ticketId}/approve?role=${user.role}&technicianName=${encodeURIComponent(selected.name)}&technicianEmail=${encodeURIComponent(selected.email)}`);
    await loadData();
  };

  const rejectTicket = async (ticketId) => {
    const reason = rejectReasons[ticketId];
    if (!reason) {
      alert("Please enter a reject reason");
      return;
    }
    await axios.patch(`${API}/api/tickets/${ticketId}/reject?role=${user.role}`, JSON.stringify(reason), { headers: { "Content-Type": "application/json" }});
    await loadData();
  };

  const closeTicket = async (ticketId) => {
    await axios.patch(`${API}/api/tickets/${ticketId}/close?role=${user.role}`);
    await loadData();
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
              <p className="brand-subtitle">Admin Dashboard</p>
            </div>
          </div>
          <p className="dashboard-description">Review all incident tickets, assign technicians, reject invalid requests, and close resolved tickets.</p>
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
            <FiActivity />
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
            <FiUsers />
          </div>
          <div className="stat-content">
            <div className="stat-number">{technicians.length}</div>
            <div className="stat-label">Technicians</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All Tickets</h2>
          <div className="card-header-icon">
            <FiAlertCircle />
          </div>
        </div>
        <div className="ticket-list">
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
                      <FiMail className="meta-icon" />
                      {ticket.studentEmail}
                    </span>
                    <span className="meta-item">
                      <FiMapPin className="meta-icon" />
                      {ticket.location}
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
                  <div className="detail-item">
                    <span className="detail-label">Assigned</span>
                    <span className="detail-value">{ticket.assignedTechnician || "Not assigned"}</span>
                  </div>
                </div>
              </div>

              {ticket.status === "OPEN" && (
                <div className="actions-section">
                  <div className="action-controls">
                    <div className="select-wrapper">
                      <select value={assignments[ticket.id] || ""} onChange={(e) => setAssignments({ ...assignments, [ticket.id]: e.target.value })} className="technician-select">
                        <option value="">Select technician</option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>{tech.name} ({tech.email})</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-wrapper">
                      <input 
                        placeholder="Reject reason" 
                        value={rejectReasons[ticket.id] || ""} 
                        onChange={(e) => setRejectReasons({ ...rejectReasons, [ticket.id]: e.target.value })} 
                        className="reject-input"
                      />
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button className="success-btn" onClick={() => approveTicket(ticket.id)}>
                      <FiCheckCircle />
                      Approve & Assign
                    </button>
                    <button className="danger-btn" onClick={() => rejectTicket(ticket.id)}>
                      <FiXCircle />
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {ticket.status === "RESOLVED" && (
                <div className="actions-section">
                  <button className="primary-btn" onClick={() => closeTicket(ticket.id)}>
                    <FiCheckCircle />
                    Close Ticket
                  </button>
                </div>
              )}

              {ticket.rejectedReason && (
                <div className="reason-box rejected-reason">
                  <strong>Rejected reason:</strong> {ticket.rejectedReason}
                </div>
              )}
              {ticket.resolutionNotes && (
                <div className="reason-box resolution-notes">
                  <strong>Technician comment:</strong> {ticket.resolutionNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
