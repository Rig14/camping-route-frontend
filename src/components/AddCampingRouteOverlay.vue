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

    if (response.status === 200 && imagesResponse.status === 200) {
      toggleOverlay()
    } else {
      console.error("Something went wrong when uploading new camping route")
    }
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

function deleteImage(image: string) {
  const index = imagesAsURLs.value.findIndex(e => e == image);
  imagesAsURLs.value.splice(index, 1)
  images.value.splice(index, 1)
}
</script>

<template>
  <button @click="toggleOverlay">
    <slot />
  </button>
  <dialog ref="overlay">
    <div class="flex flex-col max-w-96 min-w-80 bg-emerald-800 rounded p-2">
      <div class="flex flex-row">
        <button class="p-1 ml-auto bg-emerald-800 transition hover:bg-emerald-600" @click="toggleOverlay"><img alt="Sulgemise nupu ikoon" src="/x.svg"></button>
      </div>

      <h1 class="text-xl">Lisa uus matkarada</h1>

      <form @submit.prevent="submitForm">
        <div class="flex flex-col gap-5 ml-2 mr-2 mt-2">
          <input v-model="route.name" class="rounded p-2" placeholder="Nimi" required type="text">
          <input v-model="route.description" class="rounded p-2" placeholder="Kirjeldus" required type="text">
          <input v-model="route.location" class="rounded p-2" placeholder="Asukoht" required type="text">
        </div>

        <div class="flex items-center justify-center w-full mt-4 mb-4">
          <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" for="dropzone-file">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg aria-hidden="true" class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Vajuta</span> või lohista</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, JPEG</p>
            </div>
            <input
                id="dropzone-file"
                accept="image/*"
                class="absolute opacity-0"
                style="width: inherit; height: inherit"
                type="file"
                @change="handleAddImage"
            />
          </label>
        </div>


        <button class="mb-4" type="submit">Loo uus matkarada</button>
      </form>

      <div class="grid grid-cols-5 gap-2">
        <div v-for="image in imagesAsURLs" class="relative">
          <button class="absolute -left-2 -top-2 p-0 bg-red-700 rounded-3xl" @click="deleteImage(image)">
            <img alt="eemalda pilt ikoon" class="w-4 h-4" src="/x.svg">
          </button>
          <img :src="image" alt="image">
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>

</style>