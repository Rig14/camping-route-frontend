<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import {CampingRouteDto} from "./types/dto/CampingRouteDto.ts";
import {Axios} from "axios";

const axios = inject<Axios>('axios')
if (axios === undefined) {
  throw new Error("Axios is not injected")
}

const routes = ref<CampingRouteDto[]>([]);
const route = ref<CampingRouteDto>({
  name: '',
  description: '',
  location: '',
  thumbnailUrl: '',
});

const fetchRoutes = async () => {
  try {
    const response = await axios.get<CampingRouteDto[]>('/api/camping_routes');
    routes.value = response.data.map(route =>  ({
      id: route.id,
      name: route.name,
      description: route.description,
      location: route.location,
      thumbnailUrl: route.thumbnailUrl,
    }))
  } catch (error){
    console.error("Error fetching camping routes: " + error);
  }
}

const submitForm = async () => {
  try {
    const response = await axios.post('/api/camping_routes', route.value);
    console.log('Added camping route:', response.data);
    // Reset the form after successful submission
    route.value = {
      name: '',
      description: '',
      location: '',
      thumbnailUrl: ''
    };
    await fetchRoutes()
  } catch (error) {
    console.error('Error adding camping route:', error);
  }
};

onMounted(fetchRoutes())
</script>

<template>
  <div class="add-camping-route">
    <h1>Send camping route</h1>
    <form @submit.prevent="submitForm">
      <div>
        <input type="text" placeholder="Name" v-model="route.name" required>
        <input type="text" placeholder="Description" v-model="route.description" required>
        <input type="text" placeholder="Location" v-model="route.location" required>
        <input type="text" placeholder="Thumbnail url" v-model="route.thumbnailUrl" required>
      </div>
      <button type="submit">Send</button>
    </form>
  </div>
  <table v-if="routes.length">
    <tbody>
    <tr v-for="route in routes" :key="route.id">
      <td> {{ route.name }} </td>
      <td> {{ route.description }} </td>
      <td> {{ route.location }} </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
