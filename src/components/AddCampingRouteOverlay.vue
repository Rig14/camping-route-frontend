<script lang="ts" setup>
import {inject, ref} from "vue";
import {CampingRouteDto} from "../types/dto/CampingRouteDto.ts";
import {Axios} from "axios";

const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected")
}

const overlay = ref<HTMLDialogElement>()

function toggleOverlay() {
  if (overlay.value === undefined) {
    throw new Error("Overlay value is undefined")
  }

  if (overlay.value.open) {
    overlay.value.close();
  } else {
    overlay.value.showModal();
  }
}

const route = ref<CampingRouteDto>({
  name: '',
  description: '',
  location: '',
  thumbnailUrl: '',
});
const images = ref<File[]>([]);
const imagesAsURLs = ref<string[]>([]);

const submitForm = async () => {
  try {
    // upload data about the camping route
    const response = await axios.post<CampingRouteDto>('/api/camping_routes', route.value);
    console.log('Added camping route:', response.data);
    route.value = {
      name: '',
      description: '',
      location: '',
      thumbnailUrl: ''
    };

    // upload images for the camping route
    const formData = new FormData();
    images.value.forEach(image => {
      formData.append("files", image)
    })
    const imagesResponse = await axios.post(
        "/api/camping_routes/images/" + response.data.id,
        formData
    )
    console.log('Added images for the route. Status: ', imagesResponse.status);

  } catch (error) {
    console.error('Error adding camping route:', error);
  }
}

function handleAddImage(e: Event) {
  const fileList = (e.target as HTMLInputElement).files

  // get all files that user has added
  if (fileList === null) {
    console.log("No files added.")
    return
  }
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]
    images.value.push(file)
    imagesAsURLs.value.push(URL.createObjectURL(file))
  }
}
</script>

<template>
  <button @click="toggleOverlay">
    <slot />
  </button>
  <dialog ref="overlay">
    <div class="max-w-96">
      <button @click="toggleOverlay"><img alt="Sulgemise nupu ikoon" src="/x.svg"></button>

      <form @submit.prevent="submitForm">
        <div class="flex flex-col gap-5">
          <input v-model="route.name" placeholder="Nimi" required type="text">
          <input v-model="route.description" placeholder="Kirjeldus" required type="text">
          <input v-model="route.location" placeholder="Asukoht" required type="text">
        </div>
        <div>
          <input
              accept="image/*"
              type="file"
              @change="handleAddImage"
          />
        </div>
        <button type="submit">Send</button>
      </form>

      <div class="grid grid-cols-5 gap-2">
        <img v-for="image in imagesAsURLs" :src="image" alt="image">
      </div>
    </div>
  </dialog>
</template>

<style scoped>

</style>