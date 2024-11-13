<script lang="ts" setup>
import Navbar from "./components/Navbar.vue";
import ErrorNotification from "./components/ErrorNotification.vue";
import {Axios, AxiosError} from "axios";
import {inject, Ref} from "vue";
import {ExceptionResponse} from "./types/ErrorResponse.ts";
import {useAuthStore} from "./stores/authStore.ts";

const errorNotification = inject('error') as Ref<string>;
const axios = inject<Axios>('axios')
if (axios === undefined) {
  throw new Error("Axios is not injected")
}

axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ExceptionResponse>) => {
      const authStore = useAuthStore();

      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          authStore.clearToken();
          window.location.href = '/';
        }

        if (error.response.data) {
          errorNotification.value = error.response.data.message;
        } else {
          errorNotification.value = 'An unexpected error occurred';
        }
      } else if (error.request) {
        errorNotification.value = 'No response received from server';
      } else {
        errorNotification.value = error.message || 'An unexpected error occurred';
      }

      return Promise.reject(error);
    }
);
</script>

<template>
  <Navbar />
  <main>
    <ErrorNotification />
    <RouterView />
  </main>
</template>