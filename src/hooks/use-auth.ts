
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { refreshToeknApi, logoutApi } from "@/services/api/auth_apis";
import { authApiClient } from "@/services/api/api_client";
import { useToast } from "@/hooks/use-toast";

export const useAuth = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);


    // Helper to refresh token
    const tryRefreshToken = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
            throw new Error("Refresh token not found");
        }
        const response = await refreshToeknApi(refreshToken);
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        return response.access_token;
    };

    // Setup global axios interceptor for 401
    useEffect(() => {
        let interceptorId: number | null = null;
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
            setIsAuthenticated(false);
            return;
        }
        setIsAuthenticated(true);

        // Attach global 401 handler
        if (authApiClient && authApiClient.interceptors) {
            interceptorId = authApiClient.interceptors.response.use(
                (response) => response,
                async (error) => {
                    const originalRequest = error.config;
                    if (error.response && error.response.status === 401 && !originalRequest._retry) {
                        originalRequest._retry = true;
                        try {
                            const newAccessToken = await tryRefreshToken();
                            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                            setIsAuthenticated(true);
                            return authApiClient(originalRequest);
                        } catch (refreshError) {
                            setIsAuthenticated(false);
                            handleLogout(false);
                            return Promise.reject(refreshError);
                        }
                    }
                    return Promise.reject(error);
                }
            );
        }

        return () => {
            // Remove interceptor on cleanup
            if (authApiClient && authApiClient.interceptors && interceptorId !== null) {
                authApiClient.interceptors.response.eject(interceptorId);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = async (showToast = true) => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
            try {
                await logoutApi(refreshToken);
            } catch (error) {
                console.error("Logout API call failed", error);
            }
        }
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        navigate("/");
        if (showToast) {
            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
            });
        }
    };

    return { isAuthenticated, handleLogout };
};
