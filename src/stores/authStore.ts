import { defineStore } from 'pinia';
import axios, { AxiosResponse } from 'axios';
import { UserDto } from '../types/dto/UserDto.ts';
import { VerificationDto } from '../types/dto/VerificationDto.ts';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  showAuthOverlay: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('user-token') ?? null,
    isAuthenticated: !!localStorage.getItem('user-token'),
    showAuthOverlay: false,
  }),

  actions: {
    setToken(token: string) {
      this.token = token;
      this.isAuthenticated = true;
      localStorage.setItem('user-token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    clearToken() {
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user-token');
    },

    async login(userDto: UserDto) {
      try {
        const response: AxiosResponse<VerificationDto> = await axios.post('/api/public/user/verify', userDto);
        this.setToken(response.data.token);
      } catch (error) {
        console.log("Error occurred during login: " + error);
      }
    },

    async signup(userDto: UserDto) {
      try {
        const response: AxiosResponse<VerificationDto> = await axios.post('/api/public/user', userDto);
        this.setToken(response.data.token);
      } catch (error) {
        console.log("Error occurred during signup: " + error);
      }
    },

    async logout() {
      this.clearToken();
      location.reload();
    }
  },

  getters: {
    isLoggedIn(): boolean {
      return this.isAuthenticated && !!this.token;
    }
  }
});
