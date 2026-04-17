import { useState } from "react";
import { createBooking } from "../api/bookingApi";

export default function BookingFormPage() {
  const [form, setForm] = useState({
    resourceId: "",
    userId: "user123", // replace with actual logged-in user later
    purpose: "",
    expectedAttendees: 1,
    startTime: "",
    endTime: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await createBooking(form);
      setMessage("Booking request submitted successfully! Status: PENDING");
      setForm({
        resourceId: "",
        userId: "user123",
        purpose: "",
        expectedAttendees: 1,
        startTime: "",
        endTime: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Request a Booking</h2>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Resource ID</label>
          <input
            name="resourceId"
            value={form.resourceId}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. resource001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Purpose</label>
          <input
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. CS Lab Session"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expected Attendees</label>
          <input
            name="expectedAttendees"
            type="number"
            min="1"
            value={form.expectedAttendees}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            name="startTime"
            type="datetime-local"
            value={form.startTime}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            name="endTime"
            type="datetime-local"
            value={form.endTime}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Booking Request"}
        </button>
      </form>
    </div>
  );
}