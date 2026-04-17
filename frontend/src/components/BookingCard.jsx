export default function BookingCard({ booking, onCancel }) {
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">{booking.purpose}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[booking.status]}`}>
          {booking.status}
        </span>
      </div>
      <p className="text-sm text-gray-500">Resource: {booking.resourceId}</p>
      <p className="text-sm text-gray-500">Attendees: {booking.expectedAttendees}</p>
      <p className="text-sm text-gray-500">
        {new Date(booking.startTime).toLocaleString()} →{" "}
        {new Date(booking.endTime).toLocaleString()}
      </p>
      {booking.adminReason && (
        <p className="text-sm text-red-500 mt-1">Reason: {booking.adminReason}</p>
      )}
      {booking.status === "APPROVED" && onCancel && (
        <button
          onClick={() => onCancel(booking.id)}
          className="mt-3 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
}