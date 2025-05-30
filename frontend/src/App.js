import { useEffect, useState, useRef } from 'react';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import { getBookings } from './services/bookingService';
import './styles/BookingStyles.css';
import { useKeycloak } from './auth/KeycloakProvider';

function App() {
  const [bookings, setBookings] = useState([]);
  const { keycloak, authenticated, login } = useKeycloak();

  useEffect(() => {
    if (authenticated) {
      getBookings().then(res => setBookings(res.data));
    }
  }, [authenticated]);

  const addBooking = (booking) => {
    setBookings([...bookings, booking]);
  };

  const removeBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  if (!authenticated) {
    return (
      <div className="booking-container">
        <header className="booking-header">
          <div className="header-content">
            <h1>Luxury Hotel Booking</h1>
            <p>Experience comfort and elegance at its finest</p>
          </div>
          <div className="login-container">
            <button className="btn btn-login" onClick={login}>
              Login
            </button>
          </div>
        </header>
        <div className="booking-content-single">
          <div className="booking-form-container">
            <h2>Make a Reservation</h2>
            <BookingForm onAdd={addBooking} />

            <div className="room-section">
              <h3>Room Highlights</h3>
              <div className="room-highlights">
                <div className="room-card">
                  <h3>Deluxe Room</h3>
                  <p>Spacious and elegant with city views.</p>
                </div>
                <div className="room-card">
                  <h3>Executive Suite</h3>
                  <p>Premium suite with separate living area.</p>
                </div>
                <div className="room-card">
                  <h3>Presidential Suite</h3>
                  <p>Our finest accommodation with butler service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="booking-container">
        <header className="booking-header">
          <div className="header-content">
            <h1>Luxury Hotel Booking</h1>
            <p>Experience comfort and elegance at its finest</p>
          </div>

          <div className="login-container">
          <span className="welcome-text">
            Welcome, {keycloak.tokenParsed?.preferred_username}
          </span>
            <button
                className="btn btn-logout"
                onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="booking-content">
          <div className="booking-form-container">
            <h2>Make a Reservation</h2>
            <BookingForm onAdd={addBooking} />
          </div>

          <div className="bookings-list-container">
            <h2>Your Bookings</h2>
            <BookingList bookings={bookings} onDelete={removeBooking} />
          </div>
        </div>
      </div>
  );
}

export default App;
