import { useEffect, useState} from 'react';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import { getBookings } from './services/bookingService';
import './styles/BookingStyles.css';
import { useKeycloak } from './auth/KeycloakProvider';

function App() {
  const [bookings, setBookings] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { keycloak, authenticated, login, logout, showTwoFactorSettings, toggleTwoFactorSettings, twoFactorEnabled, toggleTwoFactor } = useKeycloak();

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
            <div className="user-dropdown">
              <button 
                className="dropdown-toggle" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Welcome, {keycloak.tokenParsed?.preferred_username}
                <span className="dropdown-caret">▼</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu show">
                  <div className="dropdown-section">
                    <button className="dropdown-item" onClick={toggleTwoFactorSettings}>
                      <span className="dropdown-icon">⚙️</span> Settings
                    </button>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-section">
                    <button className="dropdown-item logout-item" onClick={logout}>
                      <span className="dropdown-icon">🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {showTwoFactorSettings && (
              <div className="settings-panel">
                <h3>Security Settings</h3>
                <div className="setting-item">
                  <span>Two-Factor Authentication</span>
                  <button 
                    className={`btn-2fa ${twoFactorEnabled ? 'btn-2fa-enabled' : ''}`}
                    onClick={toggleTwoFactor}
                  >
                    {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>
              </div>
            )}
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
