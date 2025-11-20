import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface LoginRequest {
    phone: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        image_url: string;
    };
}

export const loginApi = async (loginData: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post('/api/v1/login', loginData);
        return response.data.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}

export const refreshToeknApi = async (refresh_token: string): Promise<RefreshTokenResponse> => {
    try {
        const response = await apiClient.post('/api/v1/refresh-token', { refresh_token });
        return response.data.data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

export const logoutApi = async (refresh_token: string): Promise<void> => {
    try {
        await apiClient.post('/api/v1/logout', { refresh_token });
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};