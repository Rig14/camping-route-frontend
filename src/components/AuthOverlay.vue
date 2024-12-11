<script setup lang="ts">
import {ref, reactive, inject} from 'vue'
import {Axios} from "axios";
import {UserDto} from "../types/dto/UserDto.ts";
import {LoginForm} from "../types/form/LoginForm.ts";
import {SignupForm} from "../types/form/SignupForm.ts";
import {useAuth} from "../composables/useAuth.ts";

const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected")
}

const emit = defineEmits(['close'])

const activeTab = ref<'login' | 'signup'>('login')
const {login, signup} = useAuth()

const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})

const signupForm = reactive<SignupForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const createLoginUserDto = (form: LoginForm): UserDto => {
  return {
    username: form.username,
    password: form.password
  }
}

const createSignupUserDto = (form: SignupForm): UserDto => {
  return {
    username: form.username,
    email: form.email,
    password: form.password
  }
}

const toggleTab = () => {
  activeTab.value = activeTab.value == 'login' ? 'signup' : 'login';
}

const handleLogin = async () => {
  try {
    const userDto = createLoginUserDto(loginForm)
    await login(userDto)
    emit('close')
  } catch (error) {
    console.error("Error occurred during login:", error)
  }
}

const handleSignup = async () => {
  try {
    const userDto = createSignupUserDto(signupForm)
    await signup(userDto)
    emit('close')
  } catch (error) {
    console.error("Error occurred during signup:", error)
  }
}
</script>

<template>
  <div
      class="fixed w-full h-full z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click="emit('close')"
  >
    <div
        class="bg-[#242424] rounded-lg shadow-xl max-w-md w-full relative"
        @click.stop
    >
      <button
          @click="emit('close')"
          class="absolute right-4 top-4 text-white text-lg hover:text-red-300 py-0.5 px-1.5 rounded-full bg-transparent"
          aria-label="Close"
      >
        ✕
      </button>


      <p class="mt-5 text-center text-white font-bold text-lg">
        {{ activeTab == 'login' ? 'Logi sisse' : 'Loo konto' }}
      </p>

      <!-- Login Form -->
      <div v-if="activeTab === 'login'" class="p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <input
                v-model="loginForm.username"
                placeholder="Kasutajanimi"
                name="username"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent"
            />
          </div>
          <div>
            <input
                v-model="loginForm.password"
                placeholder="Salasõna"
                name="password"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent"
            />
          </div>
          <button
              type="submit"
              class="w-full bg-emerald-800 text-white py-2 px-4 rounded-md hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2"
          >
            Logi sisse
          </button>
        </form>
      </div>

      <!-- Signup Form -->
      <div v-if="activeTab === 'signup'" class="p-6">
        <form @submit.prevent="handleSignup" class="space-y-4">
          <div>
            <div>
              <input
                  v-model="signupForm.username"
                  placeholder="Kasutajanimi"
                  name="username"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <input
                v-model="signupForm.email"
                placeholder="Email"
                name="email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent"
            />
          </div>
          <div>
            <input
                v-model="signupForm.password"
                placeholder="Salasõna"
                name="password"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent"
            />
          </div>
          <div>
            <input
                v-model="signupForm.confirmPassword"
                placeholder="Salasõna uuesti"
                type="password"
                name="confirmPassword"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent"
            />
          </div>
          <button
              type="submit"
              class="w-full bg-emerald-800 text-white py-2 px-4 rounded-md hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2"
          >
            Loo konto
          </button>
        </form>
      </div>

      <div class="flex justify-center gap-6 mb-5">
        <p class="text-white">
          {{ activeTab == 'login' ? "Pole kasutajat?" : 'On juba kasutaja?' }}
        </p>
        <p @click="toggleTab" class="text-emerald-500 font-bold cursor-pointer">
          {{ activeTab == 'login' ? 'Loo konto' : 'Logi sisse' }}
        </p>
      </div>
    </div>
  </div>
</template>
