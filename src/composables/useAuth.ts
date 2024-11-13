import { useAuthStore } from '../stores/authStore.ts'
import { useRouter } from 'vue-router'
import {computed} from "vue";

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const requireAuth = async () => {
      const isAuthenticated = await authStore.checkAuth()
      if (!isAuthenticated) {
        await router.push('/')
      }
  }

  const isLoggedIn = computed(() => authStore.isLoggedIn);

  return {
    isLoggedIn,
    requireAuth,
    login: authStore.login,
    signup: authStore.signup,
    logout: authStore.logout
  }
}