import axios from 'axios';
import keycloak from '../auth/KeycloakService';

const API_URL = 'http://localhost:8081/api/bookings';

export const getBookings = () => axios.get(API_URL);

export const createBooking = (booking) => {
  // Proceed with the booking
  return axios.post(API_URL, booking);
};

export const deleteBooking = (id) => axios.delete(`${API_URL}/${id}`);
