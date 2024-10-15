<script setup lang="ts">
import { ref } from 'vue';
import SearchBar from "./SearchBar.vue";

const isMenuOpen = ref(false);
const isSearchOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  isMenuOpen.value = false;
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
      <SearchBar class="w-full max-w-md hidden md:block" />
      <RouterLink to="/add_route" class="hidden md:block px-3 py-2 rounded-md text-nowrap text-sm text-white font-medium hover:bg-green-900">Lisa radasid</RouterLink>
      <div class="md:hidden flex gap-3">
        <button @click="toggleSearch" class="p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
          <span class="sr-only">Toggle search</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
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
        <RouterLink to="/add_route" class="block px-3 py-2 rounded-md text-base text-white font-medium hover:bg-green-900">Lisa radasid</RouterLink>
      </div>
    </div>
    <div v-if="isSearchOpen" class="absolute top-0 left-0 right-0 bg-emerald-800 p-2 flex justify-between items-center gap-5">
      <SearchBar class="w-full" />
      <button @click="toggleSearch" class="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white h-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </nav>
</template>

