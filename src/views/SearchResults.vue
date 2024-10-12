<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Axios } from "axios";
import { inject } from "vue";
import { CampingRouteDto } from "../types/dto/CampingRouteDto";
import CampingRouteCard from "../components/CampingRouteCard.vue";

const route = useRoute();
const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected");
}

const searchResults = ref<CampingRouteDto[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchSearchResults = async (query: string) => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get<CampingRouteDto[]>('/api/camping_routes', {
      params: { name: query, location: query }
    });
    searchResults.value = response.data;
  } catch (err) {
    console.error("Error fetching search results:", err);
    error.value = "An error occurred while fetching search results. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (route.query.q) {
    fetchSearchResults(route.query.q as string);
  }
});

watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    fetchSearchResults(newQuery as string);
  }
});
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="searchResults.length === 0">No results found.</div>
    <div v-else>
      <div v-for="route in searchResults" :key="route.id" class="flex flex-col gap-1">
        <RouterLink :to="{ name: 'CampingRoute', params: { id: route.id } }">
          <CampingRouteCard :camping-route="route" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
