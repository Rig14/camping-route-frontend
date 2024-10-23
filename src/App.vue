<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import ErrorNotification from "./components/ErrorNotification.vue";
import {inject, Ref} from "vue";

const errorNotification = inject('error') as Ref<string>;
const axios = inject<Axios>('axios')
if (axios === undefined) {
  throw new Error("Axios is not injected")
}

axios.interceptors.response.use((response) => response,
    (error) => {
      errorNotification.value = String(error);
    }
)
</script>

<template>
  <Navbar />
  <main>
    <ErrorNotification />
    <RouterView />
  </main>
</template>

<style scoped>
</style>
