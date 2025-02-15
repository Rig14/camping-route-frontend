<script lang="ts" setup>
import { ref } from 'vue';
import SearchBar from "./SearchBar.vue";
import AddCampingRouteOverlay from "./AddCampingRouteOverlay.vue";
import AuthOverlay from "./AuthOverlay.vue";
import {useAuth} from "../composables/useAuth.ts";

const isMenuOpen = ref(false);
const isSearchOpen = ref(false);
const showAddCampingRouteOverlay = ref(false);
const { isLoggedIn, showAuthOverlay, getUserId } = useAuth();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  isMenuOpen.value = false;
};

const handleShowAddCampingRouteOverlay = () => {
  if (isLoggedIn.value) {
    showAddCampingRouteOverlay.value = true;
  } else {
    showAuthOverlay.value = true;
  }
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-emerald-800 text-white shadow-md z-50">
    <div class="flex items-center justify-between h-16 p-2">
      <div class="flex-shrink-0">
        <RouterLink class="flex items-center" to="/">
          <img alt="Logo" class="h-20 w-auto" src="../assets/logo.svg" />
          <h2 class="text-3xl">Matkarajad</h2>
        </RouterLink>
      </div>
      <SearchBar class="w-full max-w-md hidden md:block" />
      <div class="gap-6 hidden md:flex">
        <button class="text-nowrap" @click="handleShowAddCampingRouteOverlay">Lisa rada</button>
        <button class="text-nowrap" v-if="!isLoggedIn" @click="showAuthOverlay = true">Logi sisse</button>
        <RouterLink v-if="isLoggedIn" :to="{name: 'Profile', params: {id: getUserId}}">
          <button v-if="getUserId">Profiil</button>
        </RouterLink>
      </div>
      <div class="md:hidden flex gap-3">
        <button class="p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" @click="toggleSearch">
          <span class="sr-only">Toggle search</span>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </button>
        <button class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" @click="toggleMenu">
          <span class="sr-only">Open main menu</span>
          <svg aria-hidden="true" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </button>
      </div>
    </div>
    <div :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}" class="md:hidden">
      <div class="flex flex-col gap-3 px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <button @click="showAddCampingRouteOverlay = true">Lisa rada</button>
        <button v-if="!isLoggedIn" @click="showAuthOverlay = true">Logi sisse</button>
        <RouterLink v-if="isLoggedIn" :to="{name: 'Profile', params: {id: getUserId}}">
          <button class="w-full" v-if="getUserId">Profiil</button>
        </RouterLink>
      </div>
    </div>
    <div v-if="isSearchOpen" class="absolute top-0 left-0 right-0 bg-emerald-800 p-2 flex justify-between items-center gap-5">
      <SearchBar class="w-full" />
      <button class="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white h-full" @click="toggleSearch">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </button>
    </div>
  </nav>



  <AddCampingRouteOverlay
      v-if="showAddCampingRouteOverlay"
      @close="showAddCampingRouteOverlay = false"
  />
  <AuthOverlay
      v-if="showAuthOverlay"
      @close="showAuthOverlay = false"
  />
</template>

