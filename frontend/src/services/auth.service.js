import apiClient from "./api.client"
import { ENDPOINTS } from "./api.config"

const login = async (username, password) => {
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

const register = (username, email, password, role) => {
  return apiClient.post("/register/", {
    username,
    email,
    password,
    role
  });
};

const getProfile = () => {
  return apiClient.get('/user/profile/');
};

const AuthService = {
    login,
    logout,
    register,
    getProfile,
};

export default AuthService;