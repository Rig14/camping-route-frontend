<script lang="ts" setup>
import { inject, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Axios } from 'axios';
import { CampingRouteDto } from '../types/dto/CampingRouteDto';
import CampingRouteCard from '../components/CampingRouteCard.vue';
import { getImageUrlsForId } from '../util/images.ts';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

const route = useRoute();
const router = useRouter();
const axios = inject<Axios>('axios');
if (!axios) {
  throw new Error('Axios is not injected');
}

const routes = ref<{ images: string[]; route: CampingRouteDto }[]>([]);
const isLoading = ref(false);

const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const totalElements = ref<number>(1);
const pageSize = 6; // Adjust the number of items per page as needed

const fetchCampingRoutes = async (page: number) => {
  isLoading.value = true;

  try {
    console.log('Fetching camping routes for homepage');
    const response = await axios.post<PageResponse<CampingRouteDto>>(
        '/api/public/camping_routes',
        {
          keyword: '',
          pageNumber: page - 1,
          pageSize: pageSize,
        }
    );

    console.log('Response:', response);

    routes.value = [];

    const {
      content = [],
      totalPages: responseTotalPages,
      totalElements: responseTotalElements,
    } = response.data;

    for (let i = 0; i < content.length; i++) {
      const route = content[i];
      if (route.id === undefined) {
        console.error('Route ID is undefined', route);
        continue;
      }
      const images = await getImageUrlsForId(route.id, axios)
      routes.value.push({
        images: images,
        route: route
      })
    }

    totalPages.value = responseTotalPages;
    totalElements.value = responseTotalElements;
    console.log('Total Elements:', totalElements.value);
    console.log('Content:', content);
  } catch (error) {
    console.error('Error fetching camping routes:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const pageParam = parseInt(route.query.page as string) || 1;
  currentPage.value = pageParam;
  fetchCampingRoutes(currentPage.value);
});

watch(
    () => route.query.page,
    (newPage) => {
      const pageParam = parseInt(newPage as string) || 1;
      currentPage.value = pageParam;
      fetchCampingRoutes(currentPage.value);
    }
);

const prevPage = () => {
  if (currentPage.value > 1) {
    const newPage = currentPage.value - 1;
    router.push({
      name: 'Home',
      query: { page: newPage },
    });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    const newPage = currentPage.value + 1;
    router.push({
      name: 'Home',
      query: { page: newPage },
    });
  }
};
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="routes.length === 0">No results found.</div>
    <div v-else>
      <div class="grid grid-cols-2 gap-6">
        <div v-for="item in routes" :key="item.route.id">
          <RouterLink :to=" {name: 'CampingRoute', params: {id: item.route.id}} ">
            <CampingRouteCard :camping-route="item.route" :image-urls="item.images" />
          </RouterLink>
        </div>
      </div>
      <!-- Pagination Controls -->
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
  </div>
</template>
