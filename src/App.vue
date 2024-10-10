<script setup lang="ts">
import {inject, onMounted, ref} from "vue";

const routes = ref([]);
const axios = inject('axios')
const route = ref({
  id: -1,
  name: '',
  description: '',
  location: '',
  thumbnailUrl: '',
});
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
  } catch (error) {
    console.error('Error adding camping route:', error);
  }
};

const fetchRoutes = async () => {
  try {
    const response = await axios.get('/api/camping_routes');
    routes.value = response.data.map(route =>  ({
      id: route.id,
      name: route.name,
      description: route.description,
      location: route.location,
      thumbnailUrl: route.thumbnailUrl,
    }))
  } catch (err){
    console.error("Error fetching camping routes: " + err.message);
  }
}
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
