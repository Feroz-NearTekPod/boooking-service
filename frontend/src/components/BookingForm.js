import { useState } from 'react';
import { createBooking } from '../services/bookingService';
import { useKeycloak } from '../auth/KeycloakProvider';

export default function BookingForm({ onAdd }) {
  const { authenticated, login } = useKeycloak();
  const [form, setForm] = useState({
    customerName: '',
    roomNumber: '',
    checkInDate: '',
    checkOutDate: ''
  });
  const [error, setError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowLoginPrompt(false);

    // If not authenticated, show login prompt instead of attempting API call
    if (!authenticated) {
      setShowLoginPrompt(true);
      setError('Authentication required. Please login to book a room.');
      return;
    }

    try {
      const res = await createBooking(form);
      onAdd(res.data);
      setForm({ customerName: '', roomNumber: '', checkInDate: '', checkOutDate: '' });
    } catch (err) {
      console.error('Booking error:', err);
      setError('An error occurred while processing your booking. Please try again.');
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="customerName">Full Name</label>
        <input 
          id="customerName"
          name="customerName" 
          value={form.customerName} 
          onChange={handleChange} 
          placeholder="Enter your full name" 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="roomNumber">Room Type</label>
        <select 
          id="roomNumber"
          name="roomNumber" 
          value={form.roomNumber} 
          onChange={handleChange}
          required
        >
          <option value="">Select a room type</option>
          <option value="101">Deluxe Room (101)</option>
          <option value="201">Executive Suite (201)</option>
          <option value="301">Presidential Suite (301)</option>
          <option value="401">Family Room (401)</option>
        </select>
      </div>

      <div className="date-inputs">
        <div className="form-group">
          <label htmlFor="checkInDate">Check-in Date</label>
          <input 
            id="checkInDate"
            name="checkInDate" 
            type="date" 
            value={form.checkInDate} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="checkOutDate">Check-out Date</label>
          <input 
            id="checkOutDate"
            name="checkOutDate" 
            type="date" 
            value={form.checkOutDate} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          {showLoginPrompt && (
            <button 
              className="btn btn-login-prompt" 
              onClick={(e) => {
                e.preventDefault();
                login();
              }}
            >
              Login Now
            </button>
          )}
        </div>
      )}
      <button className="btn btn-primary" type="submit">Book Now</button>
    </form>
  );
}
