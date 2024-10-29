<script lang="ts" setup>
import Navbar from "./components/Navbar.vue";
import ErrorNotification from "./components/ErrorNotification.vue";
import {Axios} from "axios";
import {inject, Ref} from "vue";

const errorNotification = inject('error') as Ref<string>;
const axios = inject<Axios>('axios')
if (axios === undefined) {
  throw new Error("Axios is not injected")
}

axios.interceptors.response.use((response) => response,
    (error) => {
      errorNotification.value = String(error.message);
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
