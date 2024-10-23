<script setup lang="ts">
import {inject, onMounted, Ref, ref} from "vue";
import {CampingRouteDto} from "../types/dto/CampingRouteDto";
import CampingRouteCard from "../components/CampingRouteCard.vue";
import {Axios, HttpStatusCode} from "axios";
import {useRoute, useRouter} from "vue-router";
import {CommentDto} from "../types/dto/CommentDto";
import CommentCard from "../components/CommentCard.vue";

const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected")
}

const campingRoute = ref<CampingRouteDto>();
const comments = ref<CommentDto[]>([]);
const route = useRoute();
const router = useRouter();

const fetchRoute = async () => {
  try {
    const response = await axios.get<CampingRouteDto>(`/api/camping_routes/${route.params.id}`);
    campingRoute.value = response.data;
  } catch (error){
    console.error("Error fetching route: " + error);
  }
}

const fetchComments = async () => {
  try {
    const response = await axios.get<CommentDto[]>(`/api/camping_routes/comments/${route.params.id}`);
    if (Array.isArray(response.data)) {
      comments.value = response.data;
    } else {
      console.error("Expected an array, but got:", response.data);
    }
  } catch (error) {
    console.error("Error fetching comments: " + error);
  }
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
  showCommentForm.value = !showCommentForm.value;
};

const deleteRoute = async () => {
  try {
    const response = await axios.delete<HttpStatusCode>(`/api/camping_routes/${route.params.id}`);
    if (response.status === 204) {
      await router.push("/")
    }
  } catch (error){
    console.error("Error fetching camping route: " + error);
  }
}

const showCommentForm = ref<boolean>(false);
const commentContent = ref<string>('');

onMounted(() => {
  fetchRoute();
  fetchComments();
});
</script>

<template>
  <div v-if="campingRoute">
    <CampingRouteCard :camping-route="campingRoute" />
    <button class="text-red-400" @click="deleteRoute()">Delete</button>
    <button @click="toggleCommentForm">
      {{ showCommentForm ? 'Cancel' : 'Add Comment' }}
    </button>

    <!-- Comment Form -->
    <div v-if="showCommentForm">
      <form @submit.prevent="submitComment">
        <input
            v-model="commentContent"
            type="text"
            placeholder="Enter your comment"
            required
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