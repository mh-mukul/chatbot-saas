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