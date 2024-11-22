<script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import { Axios, HttpStatusCode } from "axios";
import { useRoute, useRouter } from "vue-router";
import { getImageUrlsForId } from "../util/images";
import { useAuth } from "../composables/useAuth";
import { CampingRouteDto } from "../types/dto/CampingRouteDto";
import { CommentDto } from "../types/dto/CommentDto";
import GpxMap from "../components/GpxMap.vue";

const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected");
}

const campingRoute = ref<CampingRouteDto>();
const campingRouteImageURLs = ref<string[]>([]);
const comments = ref<CommentDto[]>([]);
const route = useRoute();
const router = useRouter();
const { isLoggedIn, showAuthOverlay } = useAuth();

const showCommentForm = ref<boolean>(false);
const commentContent = ref<string>("");

const fetchRoute = async () => {
  try {
    const response = await axios.get<CampingRouteDto>(`/api/public/camping_routes/${route.params.id}`);
    campingRoute.value = response.data;
  } catch (error) {
    console.error("Error fetching route: " + error);
  }
};

const fetchComments = async () => {
  try {
    const response = await axios.get<CommentDto[]>(`/api/public/camping_routes/comments/${route.params.id}`);
    if (Array.isArray(response.data)) {
      comments.value = response.data;
    } else {
      console.error("Expected an array, but got:", response.data);
    }
  } catch (error) {
    console.error("Error fetching comments: " + error);
  }
};

const fetchCampingRouteImages = async () => {
  campingRouteImageURLs.value = await getImageUrlsForId(route.params.id as string, axios);
  console.log(campingRouteImageURLs)
};

const submitComment = async () => {
  try {
    await addComment(commentContent.value);
    commentContent.value = "";
    showCommentForm.value = false;

    await fetchComments();
  } catch (error) {
    console.error("Error posting the comment: ", error);
  }
};

const addComment = async (content: string) => {
  try {
    const response = await axios.post(`/api/camping_routes/comments/${route.params.id}`, { content });
    if (response.status === 201) {
      comments.value.push(response.data);
    }
  } catch (error) {
    console.error("Error posting the comment: " + error);
  }
};

const toggleCommentForm = () => {
  if (!isLoggedIn.value) {
    showAuthOverlay.value = true;
    return;
  }
  showCommentForm.value = !showCommentForm.value;
};

const deleteRoute = async () => {
  if (!isLoggedIn.value) {
    showAuthOverlay.value = true;
    return;
  }

  try {
    await axios.delete<HttpStatusCode>(`/api/camping_routes/gpx/${route.params.id}`);
    await axios.delete<HttpStatusCode>(`/api/camping_routes/images/${route.params.id}`);
    await axios.delete<HttpStatusCode>(`/api/camping_routes/${route.params.id}`);
    router.push("/");
  } catch (error) {
    console.error("Error deleting camping route: ", error);
  }
};

onMounted(() => {
  fetchRoute();
  fetchComments();
  fetchCampingRouteImages();
});
</script>

<template>
  <div class="container mx-auto p-6">
    <div v-if="campingRoute" class="space-y-6">
      <div class="grid lg:grid-cols-2 gap-6">
        <div class="bg-gradient-to-tl from-green-950 to-gray-900 text-white rounded-xl shadow-md p-6">
          <h1 class="font-bold text-3xl mb-4">{{ campingRoute.name }}</h1>
          <p class="text-base mb-4">{{ campingRoute.description }}</p>
          <p class="text-sm text-gray-200">Asukoht: {{ campingRoute.location }}</p>
        </div>

        <div class="bg-gradient-to-tl from-green-950 to-gray-900 rounded-xl shadow-md overflow-hidden">
          <div class="grid grid-cols-1 gap-2">
            <img
                v-for="url in campingRouteImageURLs"
                :src="url"
                :key="url"
                class="w-full h-64 object-cover"
                alt="Camping route image"
            />
          </div>
        </div>
      </div>

      <div>
        <GpxMap :campingRouteId="route.params.id" />
      </div>

      <div class="flex space-x-4">
        <button
            class="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
            @click="deleteRoute"
        >
          Kustuta
        </button>
        <button
            class="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition"
            @click="toggleCommentForm"
        >
          {{ showCommentForm ? 'Tühista' : 'Lisa kommentaar' }}
        </button>
      </div>

      <div v-if="showCommentForm" class="bg-gray-800 p-6 rounded-lg">
        <form @submit.prevent="submitComment" class="space-y-4">
          <input
              v-model="commentContent"
              class="w-full p-4 border border-gray-300 rounded-lg"
              placeholder="Sisesta oma sõnum"
              required
              type="text"
          />
          <button
              type="submit"
              class="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
          >
            Saada sõnum
          </button>
        </form>
      </div>

      <div v-if="comments.length" class="bg-gray-800 text-gray-200 p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Kommentaarid</h2>
        <ul class="space-y-4">
          <li
              v-for="(comment, index) in comments"
              :key="index"
              class="p-4 bg-gray-700 rounded-lg"
          >
            <p class="text-sm text-gray-400 mb-2">Ananüümne kasutaja</p>
            <p class="text-base">{{ comment.content }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="text-center">
      <p class="text-gray-400 text-lg">Raja andmete laadimine...</p>
    </div>
  </div>
</template>
