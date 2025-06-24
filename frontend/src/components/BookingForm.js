import { useState, useEffect } from 'react';
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
  const [dateError, setDateError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Validate dates whenever they change
    validateDates();
  }, [form.checkInDate, form.checkOutDate]);

  const validateDates = () => {
    setDateError('');
    
    if (form.checkInDate && form.checkOutDate) {
      const checkIn = new Date(form.checkInDate);
      const checkOut = new Date(form.checkOutDate);
      
      if (checkOut <= checkIn) {
        setDateError('Check-out date must be after check-in date');
        return false;
      }
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear errors when user starts typing
    setError('');
    if (name === 'checkInDate' || name === 'checkOutDate') {
      setDateError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowLoginPrompt(false);

    // Validate dates before submission
    if (!validateDates()) {
      return;
    }

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
          className="form-input"
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
          className="form-select"
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
            min={today}
            required 
            className="form-input date-input"
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
            min={form.checkInDate || today}
            required 
            className="form-input date-input"
          />
        </div>
      </div>

      {dateError && (
        <div className="date-error-message">
          {dateError}
        </div>
      )}

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

      <button 
        className="btn btn-primary" 
        type="submit"
        disabled={!!dateError}
      >
        Book Now
      </button>
    </form>
  );
}
