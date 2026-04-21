import axios from 'axios';

/**
 * API service for campus resources.
 * Filtering logic: we only send non-empty filter values as query params.
 */

export type ResourceType = 'ROOM' | 'LAB' | 'EQUIPMENT';
export type ResourceStatus = 'ACTIVE' | 'OUT_OF_SERVICE';

export interface Resource {
  id?: string | number;
  name: string;
  type: ResourceType;
  capacity: number;
  location: string;
  status: ResourceStatus;
}

export interface ResourceFilters {
  type?: ResourceType;
  capacity?: number;
  location?: string;
  status?: ResourceStatus;
}

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

function buildParams(filters: ResourceFilters = {}) {
  const params: Record<string, string | number> = {};

  if (filters.type) params.type = filters.type;
  if (filters.status) params.status = filters.status;
  if (typeof filters.capacity === 'number' && !Number.isNaN(filters.capacity)) params.capacity = filters.capacity;
  if (filters.location) params.location = filters.location;

  return params;
}

export const resourceService = {
  /**
   * GET /resources?type=...&capacity=...&location=...&status=...
   */
  async getResources(filters: ResourceFilters): Promise<Resource[]> {
    const res = await api.get<Resource[]>('/resources', { params: buildParams(filters) });
    return res.data;
  },

  /**
   * POST /resources
   */
  async createResource(payload: Omit<Resource, 'id'>): Promise<Resource> {
    const res = await api.post<Resource>('/resources', payload);
    return res.data;
  },

  /**
   * PUT /resources/{id}
   */
  async updateResource(id: string | number, payload: Partial<Resource>): Promise<Resource> {
    const res = await api.put<Resource>(`/resources/${id}`, payload);
    return res.data;
  },

  /**
   * DELETE /resources/{id}
   */
  async deleteResource(id: string | number): Promise<void> {
    await api.delete(`/resources/${id}`);
  },
};

