<script lang="ts" setup>
import {inject, onMounted, ref} from "vue";
import {Axios} from "axios";
import {UserDto} from "../types/dto/UserDto.ts";
import {CampingRouteDto} from "../types/dto/CampingRouteDto.ts";
import CampingRouteCard from "../components/CampingRouteCard.vue";
import {PageResponse} from "../types/dto/PageRespone.ts";
import {getImageUrlsForId} from "../util/images.ts";
import {useRoute} from "vue-router";
import {useAuth} from "../composables/useAuth.ts";

const { logout, getUserId } = useAuth();

const axios = inject<Axios>('axios');
if (!axios) {
  throw new Error('Axios is not injected');
}

const route = useRoute();

const user = ref<UserDto>();
const userCampingRoutes = ref<{ images: string[]; route: CampingRouteDto }[]>([]);

const isLoading = ref(false);

const currentPage = ref<number>(1);
const pageSize = 5;
const totalPages = ref<number>(1);
const totalElements = ref<number>(1);

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
        `/api/public/camping_routes/user/${route.params.id}`,
        {
          keyword: '',
          pageNumber: page - 1,
          pageSize: pageSize,
        }
    );
    console.log("SIIIN: " + response.data)


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

onMounted(() => {
  fetchUser();
  fetchUserCampingRoutes(currentPage.value)
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div v-if="user">
      <div class="bg-emerald-800 shadow rounded-lg max-w-md w-60 sm:w-96 p-6 flex flex-col sm:flex-row items-center sm:gap-5 gap-4">
        <div class="flex justify-center">
          <img
              class="w-24 h-24 rounded-full border-2 border-gray-300"
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.murrayglass.com%2Fwp-content%2Fuploads%2F2020%2F10%2Favatar-1024x1024.jpeg&f=1&nofb=1&ipt=2895779559f3c219d7b09907eff55a6b3f42d271f2548b8ff49e9021dd738d2e&ipo=images"
              alt="User Avatar"
          />
        </div>
        <div class="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left">
          <h2 class="text-lg font-semibold text-white">{{ user.username }}</h2>
          <h2 class="text-sm font-semibold text-gray-400">Matkaradu: {{ userCampingRoutes.length }}</h2>
        </div>
        <div v-if="route.params.id == getUserId" class="flex flex-col gap-3">
          <button class="rounded-lg text-white" @click="logout">
            Logi välja
          </button>
          <button class="rounded-lg bg-red-500 text-white" @click="">
            Kustuta
          </button>
        </div>
      </div>
    </div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="userCampingRoutes.length == 0">No results found.</div>
    <div v-else>
      <div v-for="item in userCampingRoutes" :key="item.route.id" class="flex flex-col gap-1">
        <RouterLink :to=" {name: 'CampingRoute', params: {id: item.route.id}} ">
          <CampingRouteCard :camping-route="item.route" :image-urls="item.images" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>