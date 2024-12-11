<script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import { CampingRouteDto } from "../types/dto/CampingRouteDto";
import CampingRouteCard from "../components/CampingRouteCard.vue";
import { Axios, HttpStatusCode } from "axios";
import { useRoute, useRouter } from "vue-router";
import { CommentDto } from "../types/dto/CommentDto";
import CommentCard from "../components/CommentCard.vue";
import { getImageUrlsForId } from "../util/images.ts";
import { useAuth } from "../composables/useAuth.ts";
import {ViewsDto} from "../types/dto/ViewsDto.ts";

const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected")
}

const campingRoute = ref<CampingRouteDto>();
const campingRouteImageURLs = ref<string[]>([]);
const comments = ref<CommentDto[]>([]);
const viewsCount = ref<number>(0);
const route = useRoute();
const router = useRouter();
const { isLoggedIn, showAuthOverlay } = useAuth();

const fetchRoute = async () => {
  try {
    const response = await axios.get<CampingRouteDto>(`/api/public/camping_routes/${route.params.id}`);
    campingRoute.value = response.data;
  } catch (error){
    console.error("Error fetching route: " + error);
}
}

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
}

const fetchCampingRouteImages = async () => {
  campingRouteImageURLs.value = await getImageUrlsForId(route.params.id as string, axios)
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
}

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

  await axios.delete<HttpStatusCode>(`/api/camping_routes/views/${route.params.id}`).catch((e) => {console.error(e)});
  await axios.delete<HttpStatusCode>(`/api/camping_routes/images/${route.params.id}`).catch((e) => {console.error(e)});
  await axios.delete<HttpStatusCode>(`/camping_routes/comments/${route.params.id}`).catch((e) => {console.error(e)});
  await axios.delete<HttpStatusCode>(`/api/camping_routes/${route.params.id}`).catch((e) => {console.error(e)});
  await axios.delete<HttpStatusCode>(`/api/camping_routes/gpx/${route.params.id}`).catch((e) => {console.error(e)});
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

const showCommentForm = ref<boolean>(false);
const commentContent = ref<string>('');

onMounted(() => {
  updateViewCount();
  fetchRoute();
  fetchComments();
  fetchCampingRouteImages();
  fetchViewCount();
});
</script>

<template>
  <div v-if="campingRoute">
    <div class="mb-4">
      <CampingRouteCard :camping-route="campingRoute" :image-urls="campingRouteImageURLs" />
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
    </div>
    <button class="text-red-400" @click="deleteRoute">Delete</button>
    <button @click="toggleCommentForm">
      {{ showCommentForm ? 'Cancel' : 'Add Comment' }}
    </button>

    <!-- Comment Form -->
    <div v-if="showCommentForm">
      <form @submit.prevent="submitComment">
        <input
            v-model="commentContent"
            placeholder="Enter your comment"
            required
            type="text"
        />
        <button type="submit">Submit</button>
      </form>
    </div>

    <div v-if="comments.length">
      <h2>Comments:</h2>
      <ul>
        <li v-for="(comment, index) in comments" :key="index">
          <CommentCard :comment="comment" />
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
    <p>Loading route details...</p>
  </div>
</template>