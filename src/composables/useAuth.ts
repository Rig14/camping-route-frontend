import { useAuthStore } from '../stores/authStore.ts'
import { computed } from "vue";

export function useAuth() {
  const authStore = useAuthStore()

  const isLoggedIn = computed(() => authStore.isLoggedIn);
  const getUserId = computed(() => authStore.getUserId);
  const showAuthOverlay = computed({
    get: () => authStore.showAuthOverlay,
    set: (value: boolean) => { authStore.showAuthOverlay = value; }
  });

  return {
    isLoggedIn,
    getUserId,
    showAuthOverlay,
    login: authStore.login,
    signup: authStore.signup,
    logout: authStore.logout
  }
}