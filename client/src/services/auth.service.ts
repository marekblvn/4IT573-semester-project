import api from "./api";

interface LoginResponse {
  token: string;
  name: string;
}

interface LoginParams {
  username: string;
  password: string;
}

interface RegisterParams {
  username: string;
  name: string;
  password: string;
}

interface RegisterResponse {
  username: string;
}

const authService = {
  login: async (params: LoginParams): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", params);
    return response.data;
  },
  register: async (params: RegisterParams): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", params);
    return response.data;
  },
};

export default authService;
