import axiosClient from './axiosClient';

export interface Facility {
  id?: string;
  name: string;
  type: 'Lab' | 'Hall' | 'Room';
  capacity: number;
  location: string;
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
}

export const facilityApi = {
  getAll: async (): Promise<Facility[]> => {
    const res = await axiosClient.get<Facility[]>('/facilities');
    return res.data;
  },
  getById: async (id: string): Promise<Facility> => {
    const res = await axiosClient.get<Facility>(`/facilities/${id}`);
    return res.data;
  },
  getAvailability: async (id: string, date: string): Promise<any[]> => {
    const res = await axiosClient.get<any[]>(`/facilities/${id}/availability`, {
      params: { date }
    });
    return res.data; // Returns a list of Bookings
  },
  create: async (data: Omit<Facility, 'id'>): Promise<Facility> => {
    const res = await axiosClient.post<Facility>('/facilities', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Facility>): Promise<Facility> => {
    const res = await axiosClient.put<Facility>(`/facilities/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/facilities/${id}`);
  },
};
