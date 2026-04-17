import axiosClient from './axiosClient';

export interface ResourceItem {
  id?: string;
  name: string;
  type: 'Lab' | 'Hall' | 'Room';
  capacity: number;
  location: string;
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
}

export const resourceApi = {
  getAll: async (): Promise<ResourceItem[]> => {
    const res = await axiosClient.get<ResourceItem[]>('/resources');
    return res.data;
  },
  getById: async (id: string): Promise<ResourceItem> => {
    const res = await axiosClient.get<ResourceItem>(`/resources/${id}`);
    return res.data;
  },
  create: async (data: Omit<ResourceItem, 'id'>): Promise<ResourceItem> => {
    const res = await axiosClient.post<ResourceItem>('/resources', data);
    return res.data;
  },
  update: async (id: string, data: Partial<ResourceItem>): Promise<ResourceItem> => {
    const res = await axiosClient.put<ResourceItem>(`/resources/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/resources/${id}`);
  },
};
