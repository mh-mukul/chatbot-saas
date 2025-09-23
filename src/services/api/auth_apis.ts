import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        image_url: string;
    };
}

export const loginApi = async (loginData: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post('/api/login', loginData);
        return response.data.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};