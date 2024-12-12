<script lang="ts" setup>
import {inject, onMounted, ref, watch} from "vue";
import {Axios, HttpStatusCode} from "axios";
import {UserDto} from "../types/dto/UserDto.ts";
import {CampingRouteDto} from "../types/dto/CampingRouteDto.ts";
import CampingRouteCard from "../components/CampingRouteCard.vue";
import {PageResponse} from "../types/dto/PageRespone.ts";
import {getImageUrlsForId} from "../util/images.ts";
import {useRoute, useRouter} from "vue-router";
import {useAuth} from "../composables/useAuth.ts";
import {CommentDto} from "../types/dto/CommentDto.ts";
import CommentCard from "../components/CommentCard.vue";

const { logout, getUserId } = useAuth();

const axios = inject<Axios>('axios');
if (!axios) {
  throw new Error('Axios is not injected');
}

const route = useRoute();
const router = useRouter();

const auth = useAuth();

const user = ref<UserDto>();
const userCampingRoutes = ref<{ images: string[]; route: CampingRouteDto }[]>([]);

const isLoading = ref(false);

const currentPage = ref<number>(1);
const pageSize = 6;
const totalPages = ref<number>(1);
const totalElements = ref<number>(1);

const viewSelection = ref<string>('comments');

const comments = ref<CommentDto[]>([]);

const fetchUser = async () => {
  try {
    const response = await axios.get<UserDto>(`/api/public/user/${route.params.id}`)
    user.value = response.data;
  } catch (error) {
    console.log("Error fetching user: " + error);
  }
}

const fetchUserCampingRoutes = async (page: number) => {
  isLoading.value = true;

  try {
    const response = await axios.post<PageResponse<CampingRouteDto>>(
        `/api/public/camping_routes/user`,
        {
          keyword: route.params.id,
          pageNumber: page - 1,
          pageSize: pageSize,
        }
    );

    userCampingRoutes.value = [];

    const {
      content = [],
      totalPages: responseTotalPages,
      totalElements: responseTotalElements,
    } = response.data;

    for (const element of content) {
      const route = element;
      if (route.id === undefined) {
        console.error('Route ID is undefined', route);
        continue;
      }
      const images = await getImageUrlsForId(route.id, axios)
      userCampingRoutes.value.push({
        images: images,
        route: route
      })
    }

    totalPages.value = responseTotalPages;
    totalElements.value = responseTotalElements;
  } catch (error) {
    console.error('Error fetching camping routes:', error);
  } finally {
    isLoading.value = false;
  }
};

const deleteUser = async () => {
  try {
    const response = await axios.delete<HttpStatusCode>(`/api/user/${route.params.id}`);
    if (response.status == 204) {
      await logout();
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    const newPage = currentPage.value - 1;
    router.push({
      name: 'Profile',
      query: { page: newPage },
    });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    const newPage = currentPage.value + 1;
    router.push({
      name: 'Profile',
      query: { page: newPage },
    });
  }
};

const fetchUserComments = async () => {
  try {
    const response = await axios.get<CommentDto[]>(`/api/public/camping_routes/comments/user/${route.params.id}`);
    comments.value = response.data;
  } catch (error) {
    console.error("Error fetching comments: " + error);
  }
}

const switchView = (viewName: string) => {
  viewSelection.value = viewName;
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

  return auth.getUserId.value == route.params.id;
}

onMounted(() => {
  fetchUser();
  fetchUserComments();
  fetchUserCampingRoutes(currentPage.value)
})


watch(
    () => route.query.page,
    (newPage) => {
      const pageParam = parseInt(newPage as string) || 1;
      currentPage.value = pageParam;
      fetchUserCampingRoutes(currentPage.value);
    }
);
</script>

<template>
  <div class="flex flex-col gap-5">
    <div v-if="user">
      <div class="bg-emerald-800 shadow rounded-lg w-full p-6 flex flex-col sm:flex-row items-center justify-center gap-10">
        <div class="flex items-center justify-center gap-4">
          <div class="flex justify-center">
            <img
                alt="User Avatar"
                class="w-24 h-24 rounded-full border-2 border-gray-300"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.murrayglass.com%2Fwp-content%2Fuploads%2F2020%2F10%2Favatar-1024x1024.jpeg&f=1&nofb=1&ipt=2895779559f3c219d7b09907eff55a6b3f42d271f2548b8ff49e9021dd738d2e&ipo=images"
            />
          </div>
          <div class="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left">
            <h2 class="text-lg font-semibold text-white">{{ user.username }}</h2>
            <h2 class="text-sm font-semibold text-gray-400">Matkaradu: {{ userCampingRoutes.length }}</h2>
          </div>
        </div>
        <div v-if="route.params.id == getUserId" class="flex sm:flex-col gap-3">
          <button class="rounded-lg text-white" @click="logout">
            Logi välja
          </button>
          <button class="rounded-lg bg-red-500 text-white" @click="deleteUser">
            Kustuta
          </button>
        </div>
      </div>
    </div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="userCampingRoutes.length == 0">No results found.</div>
    <div v-else>
      <div class="flex gap-4 justify-center mb-4">
        <button :class="{'bg-emerald-600': viewSelection == 'comments'}" @click="switchView('comments')">Kommentaarid</button>
        <button :class="{'bg-emerald-600': viewSelection == 'routes'}" @click="switchView('routes')">Matkarajad</button>
      </div>
      <div v-if="viewSelection == 'routes'">
        <div
            :class="[
      'grid gap-6',
      userCampingRoutes.length === 1
        ? 'grid-cols-1 place-items-center'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    ]"
        >
          <div v-for="item in userCampingRoutes" :key="item.route.id">
            <RouterLink :to="{ name: 'CampingRoute', params: { id: item.route.id } }">
              <CampingRouteCard :camping-route="item.route" :image-urls="item.images" />
            </RouterLink>
          </div>
        </div>
        <div class="px-6 py-4 flex justify-center items-center">
          <button
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded disabled:opacity-50 mr-2"
              @click="prevPage"
          >
            Previous
          </button>
          <span class="text-gray-300 text-base">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded disabled:opacity-50 ml-2"
              @click="nextPage"
          >
            Next
          </button>
        </div>
      </div>
      <div v-if="viewSelection == 'comments'" class="flex gap-4 flex-col">
        <div v-for="comment in comments" :key="comment.id">
          <CommentCard :comment="comment" :remove-comment="() => removeComment(comment.id)" :should-show-delete="shouldShowDelete" />
        </div>
      </div>
    </div>
  </div>
</template>