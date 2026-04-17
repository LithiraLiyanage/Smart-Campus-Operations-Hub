import { useEffect, useState } from "react";
import { getUserBookings, cancelBooking } from "../api/bookingApi";
import BookingCard from "../components/BookingCard";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = "user123"; // replace with actual logged-in user later

  const fetchBookings = async () => {
    try {
      const res = await getUserBookings(userId);
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

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(id, userId);
      fetchBookings(); // refresh list
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel booking");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading bookings...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
        ))
      )}
    </div>
  );
}