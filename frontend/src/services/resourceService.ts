import axiosClient from '../api/axiosClient';

/**
 * API service for campus resources.
 * Uses the shared axios client so JWT + proxy (/api → backend) work in dev and consistent deployments.
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
    const res = await axiosClient.get<Resource[]>('/resources', { params: buildParams(filters) });
    return res.data;
  },

  /**
   * POST /resources
   */
  async createResource(payload: Omit<Resource, 'id'>): Promise<Resource> {
    const res = await axiosClient.post<Resource>('/resources', payload);
    return res.data;
  },

  /**
   * PUT /resources/{id}
   */
  async updateResource(id: string | number, payload: Partial<Resource>): Promise<Resource> {
    const res = await axiosClient.put<Resource>(`/resources/${id}`, payload);
    return res.data;
  },

  /**
   * DELETE /resources/{id}
   */
  async deleteResource(id: string | number): Promise<void> {
    await axiosClient.delete(`/resources/${id}`);
  },
};

