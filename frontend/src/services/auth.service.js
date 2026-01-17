import apiClient from "./api.client"
import { ENDPOINTS } from "./api.config"

const login = async (username, password) => {
    // Implementation of login function
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
    });

    if(response.data.access){
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
    };
    return response.data;
}

const logout = () =>{
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
}

const AuthService = {
    login,
    logout,
};

export default AuthService;