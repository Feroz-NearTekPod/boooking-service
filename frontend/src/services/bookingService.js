import axios from 'axios';

const API_URL = 'http://localhost:8081/api/bookings';

export const getBookings = () => axios.get(API_URL);
export const createBooking = (booking) => axios.post(API_URL, booking);
export const deleteBooking = (id) => axios.delete(`${API_URL}/${id}`);
