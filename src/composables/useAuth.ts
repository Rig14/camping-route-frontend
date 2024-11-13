import { useAuthStore } from '../stores/authStore.ts'
import { computed } from "vue";

export function useAuth() {
  const authStore = useAuthStore()

  const isLoggedIn = computed(() => authStore.isLoggedIn);
  const showAuthOverlay = computed({
    get: () => authStore.showAuthOverlay,
    set: (value: boolean) => { authStore.showAuthOverlay = value; }
  });

  return {
    isLoggedIn,
    showAuthOverlay,
    login: authStore.login,
    signup: authStore.signup,
    logout: authStore.logout
  }
}