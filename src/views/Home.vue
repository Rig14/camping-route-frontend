<script setup lang="ts">
import {inject, onMounted, Ref, ref} from "vue";
import {CampingRouteDto} from "../types/dto/CampingRouteDto";
import CampingRouteCard from "../components/CampingRouteCard.vue";
import {Axios} from "axios";

const errorNotification = inject('error') as Ref<string>;
const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected");
}

const routes = ref<CampingRouteDto[]>([]);

const fetchRoutes = async () => {
  try {
    const response = await axios.get<CampingRouteDto[]>('/api/camping_routes');
    routes.value = response.data;
  } catch (error){
    errorNotification.value = String(error);
    console.error("Error fetching camping routes: " + error);
  }
}
onMounted(() => {
  fetchRoutes()
});
</script>

<template>
  <div v-for="route in routes" :key="route.id" class="flex flex-col gap-1">
    <RouterLink :to="{name: 'CampingRoute', params: {id: route.id}}">
      <CampingRouteCard :camping-route="route" />
    </RouterLink>
  </div>
</template>