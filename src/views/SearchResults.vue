<script lang="ts" setup>
import {inject, onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {Axios} from "axios";
import {CampingRouteDto} from "../types/dto/CampingRouteDto";
import CampingRouteCard from "../components/CampingRouteCard.vue";
import {getImageUrlsForId} from "../util/images.ts";

const route = useRoute();
const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected");
}

const searchResults = ref<{images: string[], route: CampingRouteDto}[]>([]);
const isLoading = ref(false);

const fetchSearchResults = async (query: string) => {
  isLoading.value = true;
  try {
    const response = await axios.get<CampingRouteDto[]>('/api/camping_routes', {
      params: { name: query, location: query }
    });
    for (let i = 0; i < response.data.length; i++) {
      const route = response.data[i];
      if (route.id === undefined) continue;
      const images = await getImageUrlsForId(route.id, axios)
      searchResults.value.push({
        images: images,
        route: route
      })
    }


  } catch (error){
    console.error("Error fetching camping routes: " + error);
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (route.query.find) {
    fetchSearchResults(route.query.find as string);
  }
});

watch(() => route.query.find, (newQuery) => {
  if (newQuery) {
    fetchSearchResults(newQuery as string);
  }
});
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="searchResults.length === 0">No results found.</div>
    <div v-else>
      <div v-for="item in searchResults" :key="item.route.id" class="flex flex-col gap-1">
        <RouterLink :to="{name: 'CampingRoute', params: {id: item.route.id}}">
          <CampingRouteCard :camping-route="item.route" :image-urls="item.images" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
