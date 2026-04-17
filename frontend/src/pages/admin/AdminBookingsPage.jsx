import { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus, deleteBooking } from "../../api/bookingApi";
import BookingCard from "../../components/BookingCard";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState({});

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApprove = async (id) => {
    try {
      await updateBookingStatus(id, "APPROVED", "");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    const reason = rejectReason[id];
    if (!reason || reason.trim() === "") {
      alert("Please enter a reason for rejection");
      return;
    }
    try {
      await updateBookingStatus(id, "REJECTED", reason);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reject");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    try {
      await deleteBooking(id);
      fetchBookings();
    } catch (err) {
      alert("Failed to delete booking");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Admin — All Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="mb-6">
            <BookingCard booking={b} />
            {b.status === "PENDING" && (
              <div className="mt-2 space-y-2">
                <button
                  onClick={() => handleApprove(b.id)}
                  className="mr-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <input
                  type="text"
                  placeholder="Rejection reason"
                  value={rejectReason[b.id] || ""}
                  onChange={(e) =>
                    setRejectReason({ ...rejectReason, [b.id]: e.target.value })
                  }
                  className="border rounded px-2 py-1 text-sm w-64"
                />
                <button
                  onClick={() => handleReject(b.id)}
                  className="ml-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
            <button
              onClick={() => handleDelete(b.id)}
              className="mt-2 text-xs text-gray-400 hover:text-red-500 underline"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}