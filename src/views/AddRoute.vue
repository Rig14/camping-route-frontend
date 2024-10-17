<script setup lang="ts">
import {inject, Ref, ref} from "vue";
import {CampingRouteDto} from "../types/dto/CampingRouteDto";
import {Axios} from "axios";

const errorNotification = inject('error') as Ref<string>;
const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected")
}

const route = ref<CampingRouteDto>({
  name: '',
  description: '',
  location: '',
  thumbnailUrl: '',
});

const submitForm = async () => {
  try {
    const response = await axios.post('/api/camping_routes', route.value);
    console.log('Added camping route:', response.data);
    route.value = {
      name: '',
      description: '',
      location: '',
      thumbnailUrl: ''
    };
  } catch (error) {
    errorNotification.value = String(error);
    console.error('Error adding camping route:', error);
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
      </div>
      <button type="submit">Send</button>
    </form>
  </div>
</template>