<script lang="ts" setup>

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

import {inject, onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {Axios} from "axios";
import {CampingRouteDto} from "../types/dto/CampingRouteDto";
import CampingRouteCard from "../components/CampingRouteCard.vue";
import {getImageUrlsForId} from "../util/images.ts";

const route = useRoute();
const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected");
}

const searchResults = ref<{images: string[], route: CampingRouteDto}[]>([]);
const isLoading = ref(false);

const currentPage = ref<number>(1 );
const totalPages = ref<number>(1);
const totalElements = ref<number>(1)
const pageSize = 3; // 3 entities per page

const fetchSearchResults = async (query: string, page: number) => {
  isLoading.value = true;

  try {
    console.log('initiating search')
    const response = await axios.post<PageResponse<CampingRouteDto>>('/api/public/camping_routes/search', {
      keyword: query,
      pageNumber: page,
      pageSize: pageSize,
    });
    console.log('Response:', response);

    const { content = [], totalPages: responseTotalPages, totalElements:  responseTotalElements } = response.data;

    totalPages.value = responseTotalPages
    console.log(totalPages);
    totalElements.value = responseTotalElements
    console.log(totalElements);
    console.log(content);


    // Fetch images for each route concurrently
    const routesWithImages = await Promise.all(
        content.map(async (route) => {
          const images = route.id ? await getImageUrlsForId(route.id, axios) : [];
          return { images, route };
        })
    );

    searchResults.value = routesWithImages;
  } catch (error) {
    console.error('Error fetching camping routes:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const keywordParam = route.query.find as string | undefined;
  const pageParam = parseInt(route.query.page as string) || 1;
  if (keywordParam) {
    console.log('Fetching results for:', { keywordParam, pageParam });
    fetchSearchResults(keywordParam, pageParam);
  }
});

watch(
    () => route.query,
    (newQuery) => {
      console.log(route.query)
      const keywordParam = newQuery.find as string | undefined;
      const pageParam = parseInt(newQuery.page as string) || 1;
      if (keywordParam) {
        console.log('Fetching results for:', { keywordParam, pageParam });
        fetchSearchResults(keywordParam, pageParam);
      }
    }
);

const prevPage = () => {
  if (currentPage.value > 1) {
    const keyword = route.query.keyword as string;
    const newPage = currentPage.value - 1;
    router.push({
      name: 'Search',
      query: { keyword, page: newPage }
    });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    const keyword = route.query.keyword as string;
    const newPage = currentPage.value + 1;
    router.push({
      name: 'Search',
      query: { keyword, page: newPage }
    });
  }
};
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="searchResults.length === 0">No results found.</div>
    <div v-else>
      <div v-for="item in searchResults" :key="item.route.id" class="flex flex-col gap-1">
        <RouterLink :to="{name: 'CampingRoute', params: {id: item.route.id}}">
          <CampingRouteCard :camping-route="item.route" :image-urls="item.images" />
        </RouterLink>
      </div>
      <!-- Pagination Controls -->
      <div class="pagination-controls flex justify-center items-center mt-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-200 rounded-l disabled:opacity-50"
        >
          Previous
        </button>
        <span class="px-4 py-2 bg-gray-100">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-200 rounded-r disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
