<script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import { Axios, HttpStatusCode } from "axios";
import { useRoute, useRouter } from "vue-router";
import { CampingRouteDto } from "../types/dto/CampingRouteDto";
import { CommentDto } from "../types/dto/CommentDto";
import {getImageUrlsAndDeleteUrlsForCampingRouteId} from "../util/images.ts";
import { useAuth } from "../composables/useAuth.ts";
import {ViewsDto} from "../types/dto/ViewsDto.ts";
import GpxMap from "../components/GpxMap.vue";
import {ImageUrl} from "../types/ImageUrl.ts";
import CommentCard from "../components/CommentCard.vue";

const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected");
}

const campingRoute = ref<CampingRouteDto>();
const campingRouteImageURLs = ref<ImageUrl[]>([]);
const comments = ref<CommentDto[]>([]);
const viewsCount = ref<number>(0);
const route = useRoute();
const router = useRouter();
const { isLoggedIn, showAuthOverlay } = useAuth();

const showCommentForm = ref<boolean>(false);
const commentContent = ref<string>("");

const auth = useAuth();

const hasGpxFile = ref(false);

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
  campingRouteImageURLs.value = await getImageUrlsAndDeleteUrlsForCampingRouteId(route.params.id as string, axios);
}

const submitComment = async () => {
  try {
    await addComment(commentContent.value);
    commentContent.value = '';
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
  if (!hasGpxFile) {
    await axios.delete<HttpStatusCode>(`/api/camping_routes/gpx/${route.params.id}`).catch((e) => {console.error(e)});
  }

  await axios.delete<HttpStatusCode>(`/api/camping_routes/images/${route.params.id}`).catch((e) => {console.error(e)});
  await axios.delete<HttpStatusCode>(`/api/camping_routes/${route.params.id}`).catch((e) => {console.error(e)});
  await router.push("/");
};

const fetchViewCount = async () => {
  try {
    const res = await axios.get<ViewsDto>(`/api/public/camping_routes/views/${route.params.id}`);
    viewsCount.value = res.data.viewsCount;
  } catch (error) {
    console.error("Error updating view count: ", error);
  }
};

const updateViewCount = async () => {
  try {
    await axios.post(`/api/public/camping_routes/views/${route.params.id}`);
  } catch (error) {
    console.error("Error updating view count: ", error);
  }
};

const deleteImage = async (url: string) =>  {
  try {
    await axios.delete(url);
    campingRouteImageURLs.value = campingRouteImageURLs.value.filter((imageUrl) => imageUrl.deleteUrl !== url);
  } catch (error) {
    console.error("Error deleting image: ", error);
  }
}

const removeComment = async (id: number | undefined) => {
  if (id === undefined) {
    console.error("Comment ID is undefined");
    return;
  }

  try {
    await axios.delete(`/api/camping_routes/comments/single/${id}`);

    comments.value = comments.value.filter((comment) => comment.id !== id);
  } catch (error) {
    console.error("Error removing comment: " + error);
  }
};


const shouldShowDelete = () => {
  if (auth.getUserId.value == null) {
    return false;
  }
  if (campingRoute.value == undefined) {
    return false;
  }

  return campingRoute.value.userID == auth.getUserId.value as unknown as number;
}

onMounted(() => {
  updateViewCount();
  fetchRoute();
  fetchComments();
  fetchCampingRouteImages();
  fetchViewCount();
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
            <div v-for="url in campingRouteImageURLs" class="relative">
              <img
                  :key="url.imageUrl"
                  :src="url.imageUrl"
                  alt="Camping route"
                  class="w-full h-64 object-cover"
              />
              <button v-if="shouldShowDelete()" class="absolute cursor-pointer z-40 top-1 right-1 bg-red-600 rounded-full p-2 size-8 flex justify-center items-center" @click="deleteImage(url.deleteUrl)">
                x
              </button>
            </div>
          </div>
        </div>
      </div>
          <span class="flex flex-row w-fit justify-center items-center gap-2">
            <svg id="Capa_1"
                 class="text-white" color="currentColor" fill="currentColor" height="30" version="1.1"
                 viewBox="0 0 442.04 442.04" width="30" xml:space="preserve"
                 xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink">
              <g>
                <g>
                  <path d="M221.02,341.304c-49.708,0-103.206-19.44-154.71-56.22C27.808,257.59,4.044,230.351,3.051,229.203
                    c-4.068-4.697-4.068-11.669,0-16.367c0.993-1.146,24.756-28.387,63.259-55.881c51.505-36.777,105.003-56.219,154.71-56.219
                    c49.708,0,103.207,19.441,154.71,56.219c38.502,27.494,62.266,54.734,63.259,55.881c4.068,4.697,4.068,11.669,0,16.367
                    c-0.993,1.146-24.756,28.387-63.259,55.881C324.227,321.863,270.729,341.304,221.02,341.304z M29.638,221.021
                    c9.61,9.799,27.747,27.03,51.694,44.071c32.83,23.361,83.714,51.212,139.688,51.212s106.859-27.851,139.688-51.212
                    c23.944-17.038,42.082-34.271,51.694-44.071c-9.609-9.799-27.747-27.03-51.694-44.071
                    c-32.829-23.362-83.714-51.212-139.688-51.212s-106.858,27.85-139.688,51.212C57.388,193.988,39.25,211.219,29.638,221.021z"/>
                </g>
                <g>
                  <path d="M221.02,298.521c-42.734,0-77.5-34.767-77.5-77.5c0-42.733,34.766-77.5,77.5-77.5c18.794,0,36.924,6.814,51.048,19.188
                    c5.193,4.549,5.715,12.446,1.166,17.639c-4.549,5.193-12.447,5.714-17.639,1.166c-9.564-8.379-21.844-12.993-34.576-12.993
                    c-28.949,0-52.5,23.552-52.5,52.5s23.551,52.5,52.5,52.5c28.95,0,52.5-23.552,52.5-52.5c0-6.903,5.597-12.5,12.5-12.5
                    s12.5,5.597,12.5,12.5C298.521,263.754,263.754,298.521,221.02,298.521z"/>
                </g>
                <g>
                  <path d="M221.02,246.021c-13.785,0-25-11.215-25-25s11.215-25,25-25c13.786,0,25,11.215,25,25S234.806,246.021,221.02,246.021z"/>
                </g>
              </g>
            </svg>
            {{ viewsCount }}
          </span>

      <div>
        <GpxMap v-model:hasGpxFile="hasGpxFile" :campingRouteId="route.params.id as string" />
      </div>

      <div class="flex space-x-4">
        <button
            v-if="shouldShowDelete()"
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
        <form class="space-y-4" @submit.prevent="submitComment">
          <input
              v-model="commentContent"
              class="w-full p-4 border border-gray-300 rounded-lg"
              placeholder="Sisesta oma sõnum"
              required
              type="text"
          />
          <button
              class="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
              type="submit"
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
              class="p-4 bg-gray-700 rounded-lg flex items-center justify-center"
          >
            <CommentCard :comment="comment" :remove-comment="() => removeComment(comment.id)" :should-show-delete="shouldShowDelete" />
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="text-center">
      <p class="text-gray-400 text-lg">Raja andmete laadimine...</p>
    </div>
  </div>
</template>
