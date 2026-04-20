import axiosClient from './axiosClient';

export interface LoginPayload {
  username: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  role: 'ADMIN' | 'USER';
}

export const authApi = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    // If backend isn't ready for /auth/login, we might need a mock, 
    // but we will implement the actual HTTP call for a production ready approach.
    try {
      const response = await axiosClient.post<LoginResponse>('/auth/login', data);
      return response.data;
    } catch (e) {
      // In case we want to fallback to mock for testing purposes if backend is unavailable 
      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     if(data.username === 'admin') resolve({ token: 'mock-admin-token', role: 'ADMIN' });
      //     else if(data.username === 'user') resolve({ token: 'mock-user-token', role: 'USER' });
      //     else reject({ response: { data: { message: 'Invalid credentials' } }});
      //   }, 1000);
      // });
      throw e;
    }
  },
};
