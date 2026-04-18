import axios from "axios";

const BASE_URL = "http://localhost:8083/api/bookings";

export const createBooking = (data) => axios.post(BASE_URL, data);

export const getAllBookings = () => axios.get(BASE_URL);

export const getUserBookings = (userId) =>
  axios.get(`${BASE_URL}/user/${userId}`);

export const getBookingById = (id) => axios.get(`${BASE_URL}/${id}`);

export const updateBookingStatus = (id, status, reason) =>
  axios.patch(`${BASE_URL}/${id}/status`, { status, reason });

export const cancelBooking = (id, userId) =>
  axios.patch(`${BASE_URL}/${id}/cancel`, null, { params: { userId } });

export const deleteBooking = (id) => axios.delete(`${BASE_URL}/${id}`);

export const updateBooking = (id, data) =>
  axios.put(`${BASE_URL}/${id}`, data);