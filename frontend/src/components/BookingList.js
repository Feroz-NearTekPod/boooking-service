import { deleteBooking } from '../services/bookingService';

export default function BookingList({ bookings, onDelete }) {
  const handleDelete = async (id) => {
    await deleteBooking(id);
    onDelete(id);
  };

  if (bookings.length === 0) {
    return (
      <div className="empty-bookings">
        <p>No bookings found. Make a reservation to get started!</p>
      </div>
    );
  }

  return (
    <ul className="bookings-list">
      {bookings.map(b => (
        <li key={b.id} className="booking-item">
          <div className="booking-info">
            <div className="booking-name">{b.customerName}</div>
            <div className="booking-dates">
              {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}
            </div>
            <div className="booking-room">Room {b.roomNumber}</div>
          </div>
          <button 
            className="btn btn-danger" 
            onClick={() => handleDelete(b.id)}
            aria-label="Delete booking"
          >
            Cancel
          </button>
        </li>
      ))}
    </ul>
  );
}