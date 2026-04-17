export type Role = 'ADMIN' | 'USER' | null;

export interface User {
  username: string;
  role: Role;
}

export type FacilityType = 'Lab' | 'Hall' | 'Room';
export type FacilityStatus = 'AVAILABLE' | 'NOT_AVAILABLE';

export interface Facility {
  id: string; // or number depending on backend
  name: string;
  type: FacilityType;
  capacity: number;
  location: string;
  status: FacilityStatus;
}
