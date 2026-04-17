import React, { useState } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");

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

      const data = await response.json();
      console.log(data);
      alert("Ticket created successfully!");

    } catch (error) {
      console.error(error);
      alert("Error creating ticket");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Incident Ticket System</h1>

      <form onSubmit={handleSubmit}>
        <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} /><br /><br />
        <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} /><br /><br />
        <input placeholder="Category" onChange={(e) => setCategory(e.target.value)} /><br /><br />
        <input placeholder="Priority" onChange={(e) => setPriority(e.target.value)} /><br /><br />
        <input placeholder="Location" onChange={(e) => setLocation(e.target.value)} /><br /><br />
        <input placeholder="Contact" onChange={(e) => setContact(e.target.value)} /><br /><br />

        <button type="submit">Create Ticket</button>
      </form>
    </div>
  );
}

export default App;