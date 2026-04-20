import axiosClient from './axiosClient';

export interface Booking {
  id?: string;
  facilityId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  status?: string;
}

export interface BookingRequest {
  facilityId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export const bookingApi = {
  create: async (data: BookingRequest): Promise<Booking> => {
    const res = await axiosClient.post<Booking>('/bookings', data);
    return res.data;
  },
  getAll: async (): Promise<Booking[]> => {
    const res = await axiosClient.get<Booking[]>('/bookings');
    return res.data;
  }
};
