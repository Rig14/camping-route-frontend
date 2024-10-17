<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import ErrorNotification from "./components/ErrorNotification.vue";
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
