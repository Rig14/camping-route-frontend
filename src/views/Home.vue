<script lang="ts" setup>
import {inject, onMounted, ref} from "vue";
import {CampingRouteDto} from "../types/dto/CampingRouteDto";
import CampingRouteCard from "../components/CampingRouteCard.vue";
import {Axios} from "axios";
import {getImageUrlsForId} from "../util/images.ts";

const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected");
}

const routes = ref<{images: string[], route: CampingRouteDto}[]>([]);

const fetchRoutes = async () => {
  try {
    const response = await axios.get<CampingRouteDto[]>('/api/public/camping_routes');
    for (let i = 0; i < response.data.length; i++) {
      const route = response.data[i];
      if (route.id === undefined) continue;
      const images = await getImageUrlsForId(route.id, axios)
      routes.value.push({
        images: images,
        route: route
      })
    }


  } catch (error){
    console.error("Error fetching camping routes: " + error);
  }
}
onMounted(() => {
  fetchRoutes()
});
</script>

<template>
  <div v-for="item in routes" :key="item.route.id" class="flex flex-col gap-1">
    <RouterLink :to="{name: 'CampingRoute', params: {id: item.route.id}}">
      <CampingRouteCard :camping-route="item.route" :image-urls="item.images" />
    </RouterLink>
  </div>
</template>