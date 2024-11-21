<script setup lang="ts">
import {ref, reactive, inject} from 'vue';
import {Axios} from "axios";
import {CampingRouteDto} from "../types/dto/CampingRouteDto.ts";

const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected");
}

const emit = defineEmits(['close']);

const routeForm = reactive<CampingRouteDto>({
  name: '',
  description: '',
  location: '',
  thumbnailUrl: '',
});

const images = ref<File[]>([]);
const imagesAsURLs = ref<string[]>([]);
const gpxFile = ref<File | null>(null);
const formError = ref<string | null>(null);

const handleAddImage = (e: Event) => {
  const fileList = (e.target as HTMLInputElement).files;

  if (fileList) {
    for (const element of fileList) {
      const file = element;
      images.value.push(file);
      imagesAsURLs.value.push(URL.createObjectURL(file));
    }
    formError.value = null;
  }
};

const handleAddGpxFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  console.log(file.type)
  if (file && file.name.toLowerCase().endsWith(".gpx")) {
    gpxFile.value = file;
    formError.value = null;
  } else {
    formError.value = "Palun lisa kehtiv GPX-fail.";
  }
};

const submitForm = async () => {
  if (images.value.length === 0) {
    formError.value = "Palun lisa vähemalt 1 pilt.";
    return;
  }
  if (!gpxFile.value) {
    formError.value = "Palun lisa üks GPX-fail.";
    return;
  }


  try {
    // Upload camping route metadata
    const response = await axios.post('/api/camping_routes', routeForm);

    // upload images for the camping route
    const formData = new FormData();
    images.value.forEach(image => formData.append("files", image));
    await axios.post(`/api/camping_routes/images/${response.data.id}`, formData);

    const gpxFormData = new FormData();
    gpxFormData.append("file", gpxFile.value);
    await axios.post(`/api/camping_routes/gpx/${response.data.id}`, gpxFormData);

    emit('close');
    location.reload();
  } catch (error) {
    console.error('Error adding camping route:', error);
  }
};

function deleteImage(imageUrl: string) {
  const index = imagesAsURLs.value.indexOf(imageUrl);
  imagesAsURLs.value.splice(index, 1);
  images.value.splice(index, 1);
}
</script>

<template>
  <div
      class="absolute w-full h-full z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click="emit('close')"
  >
    <div
        class="bg-[#242424] rounded-lg shadow-xl max-w-md w-full relative p-6"
        @click.stop
    >
      <button
          @click="emit('close')"
          class="absolute right-4 top-4 text-white text-lg hover:text-red-300 py-0.5 px-1.5 rounded-full bg-transparent"
          aria-label="Close"
      >
        ✕
      </button>

      <p class="text-center text-white font-bold text-lg mb-5">Lisa uus matkarada</p>

      <form @submit.prevent="submitForm" class="space-y-4">
        <input
            v-model="routeForm.name"
            placeholder="Nimi"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-800 focus:border-transparent"
            required
        />
        <input
            v-model="routeForm.description"
            placeholder="Kirjeldus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-800 focus:border-transparent"
            required
        />
        <input
            v-model="routeForm.location"
            placeholder="Asukoht"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-800 focus:border-transparent"
            required
        />

        <label for="" class="block text-center text-white">Lisa pildid</label>
        <div class="relative border-2 border-dashed rounded-lg p-4 bg-gray-700 cursor-pointer">
          <input
              type="file"
              accept="image/*"
              multiple
              class="absolute inset-0 opacity-0 cursor-pointer"
              @change="handleAddImage"
          />
          <p class="text-gray-400 text-center">Vali või lohista pildid siia (SVG, PNG, JPG, JPEG)</p>
        </div>

        <label for="" class="block text-center text-white mt-4">Lisa GPX-fail</label>
        <div class="relative border-2 border-dashed rounded-lg p-4 bg-gray-700 cursor-pointer">
          <input
              type="file"
              accept=".gpx"
              class="absolute inset-0 opacity-0 cursor-pointer"
              @change="handleAddGpxFile"
          />
          <p class="text-gray-400 text-center">Vali või lohista GPX-fail siia</p>
        </div>

        <p v-if="formError" class="text-red-500 text-sm mt-2 text-center">{{ formError }}</p>

        <div class="grid grid-cols-5 gap-2 mt-4">
          <div v-for="image in imagesAsURLs" :key="image" class="relative">
            <button
                @click="deleteImage(image)"
                class="absolute -left-2 -top-2 p-1 bg-red-600 rounded-full"
            >✕
            </button>
            <img :src="image" alt="Route" class="w-full h-auto rounded-md"/>
          </div>
        </div>

        <button
            type="submit"
            class="w-full bg-emerald-800 text-white py-2 px-4 rounded-md hover:bg-emerald-900"
        >
          Loo uus matkarada
        </button>
      </form>
    </div>
  </div>
</template>
