<script setup lang="ts">
import { ref } from 'vue';
import SearchBar from "./SearchBar.vue";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-emerald-800 text-white shadow-md z-50">
      <div class="flex items-center justify-between h-16 p-2">
        <div class="flex-shrink-0">
          <RouterLink to="/" class="flex items-center">
            <img class="h-20 w-auto" src="../assets/logo.svg" alt="Logo" />
            <h2 class="text-3xl">Matkarajad</h2>
          </RouterLink>
        </div>
        <SearchBar />
        <div class="hidden md:block">
            <RouterLink to="/add_route" class="px-3 py-2 rounded-md text-sm text-white font-medium hover:bg-green-900">Lisa radasid</RouterLink>
        </div>
        <div class="md:hidden">
          <button @click="toggleMenu" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="sr-only">Open main menu</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
      </div>
    </div>
    <div :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <RouterLink to="/add_route" class="px-3 py-2 rounded-md text-sm text-white font-medium hover:bg-green-900">Lisa radasid</RouterLink>
      </div>
    </div>
  </nav>
</template>
