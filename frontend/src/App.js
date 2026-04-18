import React, { useEffect, useState } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/tickets");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 🔥 NEW FUNCTION: Update Status
  const updateStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/tickets/${id}/status?role=TECHNICIAN`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify("RESOLVED")
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      alert("Status updated successfully!");
      fetchTickets();
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticket = {
      title,
      description,
      category,
      priority,
      location,
      preferredContact: contact
    };

    try {
      const response = await fetch("http://localhost:8081/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ticket)
      });

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      await response.json();
      alert("Ticket created successfully!");

      setTitle("");
      setDescription("");
      setCategory("");
      setPriority("");
      setLocation("");
      setContact("");

      fetchTickets();
    } catch (error) {
      console.error(error);
      alert("Error creating ticket");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Incident Ticket System</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <br /><br />

        <button type="submit">Create Ticket</button>
      </form>

      <hr />

      <h2>All Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px"
            }}
          >
            <h3>{ticket.title}</h3>
            <p><strong>Description:</strong> {ticket.description}</p>
            <p><strong>Category:</strong> {ticket.category}</p>
            <p><strong>Priority:</strong> {ticket.priority}</p>
            <p><strong>Location:</strong> {ticket.location}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
            <p><strong>Contact:</strong> {ticket.preferredContact}</p>
            <p><strong>Technician:</strong> {ticket.assignedTechnician || "Not assigned"}</p>

            <button onClick={() => updateStatus(ticket.id)}>
              Mark as Resolved
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;