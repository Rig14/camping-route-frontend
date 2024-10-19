<script setup lang="ts">
import {inject, ref} from "vue";
import {CampingRouteDto} from "../types/dto/CampingRouteDto";
import {Axios} from "axios";

const axios = inject<Axios>('axios')
if (axios === undefined) {
  throw new Error("Axios is not injected")
}

const route = ref<CampingRouteDto>({
  name: '',
  description: '',
  location: '',
  thumbnailUrl: '',
  gpx: ''
});

const submitForm = async () => {
  try {
    console.log(route.value)
    const response = await axios.post('/api/camping_routes', route.value);
    console.log('Added camping route:', response.data);
    // Reset the form after successful submission
    route.value = {
      name: '',
      description: '',
      location: '',
      thumbnailUrl: '',
      gpx: '',
    };
  } catch (error) {
    console.error('Error adding camping route:', error);
  }
};
const handleFileChange = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const gpxString = e.target.result as string;
      route.value.gpx = gpxString; // Store parsed GPX data
    };
    reader.readAsText(file);
  }
};
</script>

<template>
  <div class="flex flex-col gap-10">
    <h1>Send camping route</h1>
    <form @submit.prevent="submitForm" class="flex flex-col gap-5">
      <div class="flex gap-5">
        <input type="text" placeholder="Name" v-model="route.name" required>
        <input type="text" placeholder="Description" v-model="route.description" required>
        <input type="text" placeholder="Location" v-model="route.location" required>
        <input type="text" placeholder="Thumbnail url" v-model="route.thumbnailUrl" required>
        <input type="file" @change="handleFileChange" accept=".gpx">
      </div>
      <button type="submit">Send</button>
    </form>
  </div>
</template>