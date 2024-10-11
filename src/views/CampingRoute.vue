<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import {CampingRouteDto} from "../types/dto/CampingRouteDto";
import CampingRouteCard from "../components/CampingRouteCard.vue";
import {Axios, HttpStatusCode} from "axios";
import {useRoute, useRouter} from "vue-router";

const axios = inject<Axios>('axios')
if (axios === undefined) {
  throw new Error("Axios is not injected")
}

const campingRoute = ref<CampingRouteDto>();
const route = useRoute();
const router = useRouter();

const fetchRoute = async () => {
  try {
    const response = await axios.get<CampingRouteDto>(`/api/camping_routes/${route.params.id}`);
    campingRoute.value = response.data;
  } catch (error){
    console.error("Error fetching camping route: " + error);
  }
}

const failMessage = ref<string>();
const deleteRoute = async () => {
  try {
    const response = await axios.delete<HttpStatusCode>(`/api/camping_routes/${route.params.id}`);
    if (response.status === 204) {
      await router.push("/")
    } else if (response.status == 404) {
      failMessage.value = "Matkarada ei kustutatud."
    }
  } catch (error){
    console.error("Error fetching camping route: " + error);
  }
}

onMounted(() => {
  fetchRoute()
});
</script>

<template>
  <div v-if="campingRoute">
    <CampingRouteCard :camping-route="campingRoute" />
    <button class="text-red-400" @click="deleteRoute()">Delete</button>
    <div v-if="failMessage">
      <p>{{failMessage}}</p>
    </div>
  </div>
  <div v-else>
    <p>Loading route details...</p>
  </div>
</template>