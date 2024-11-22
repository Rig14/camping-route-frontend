<script lang="ts" setup>

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

import {inject, onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {Axios} from "axios";
import {CampingRouteDto} from "../types/dto/CampingRouteDto";
import CampingRouteCard from "../components/CampingRouteCard.vue";
import {getImageUrlsForId} from "../util/images.ts";

const route = useRoute();
const router = useRouter();
const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected");
}

const searchResults = ref<{images: string[], route: CampingRouteDto}[]>([]);
const isLoading = ref(false);

const searchKeyword = ref<string | undefined>(undefined); // saving this and using it for pagination
const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const totalElements = ref<number>(1)
const pageSize = 1;

const fetchSearchResults = async (query: string, page: number) => {
  isLoading.value = true;

  try {
    console.log ('initiating search')
    const response = await axios.post<PageResponse<CampingRouteDto>>('/api/public/camping_routes/search', {
      keyword: query,
      pageNumber: page - 1,
      pageSize: pageSize,
    });
    console.log('Response:', response);

    const { content = [],
      totalPages: responseTotalPages,
      totalElements:  responseTotalElements
    } = response.data;

    searchResults.value = content.map((route) => ({
      images: [], // Placeholder for images, if needed later
      route,
    }));

    for (let i = 0; i < content.length; i++) {
      const route = content[i];
      if (route.id === undefined) {
        console.error('Route ID is undefined', route);
        continue;
      }
      const images = await getImageUrlsForId(route.id, axios)
      searchResults.value.push({
        images: images,
        route: route
      })
    }
    totalPages.value = responseTotalPages
    totalElements.value = responseTotalElements
    console.log(totalElements);
    console.log(content);
  } catch (error) {
    console.error('Error fetching camping routes:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const keywordParam = route.query.find as string;
  const pageParam = parseInt(route.query.page as string) || 1;
  currentPage.value = pageParam;
  if (keywordParam) {
    searchKeyword.value = keywordParam;
    console.log('Fetching results for:', { keywordParam, pageParam });
    fetchSearchResults(keywordParam, pageParam);
  }
});

watch(
    () => route.query,
    (newQuery) => {
      console.log(route.query)
      console.log("watch initiated")
      const keywordParam = newQuery.find as string;
      console.log(keywordParam)
      const pageParam = parseInt(newQuery.page as string) || 1;
      console.log(pageParam)
      currentPage.value = pageParam;

      if (keywordParam) {
        searchKeyword.value = keywordParam;
        console.log('Fetching results for:', { keywordParam, pageParam });
        fetchSearchResults(keywordParam, pageParam);
      }
    }
);

const prevPage = () => {
  if (currentPage.value > 1) {
    const keyword = searchKeyword.value;
    const newPage = currentPage.value - 1;
    router.push({
      name: 'SearchResults',
      query: { find: keyword, page: newPage },
    });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    const keyword = searchKeyword.value;
    const newPage = currentPage.value + 1;
    router.push({
      name: 'SearchResults',
      query: { find: keyword, page: newPage },
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
        <RouterLink :to=" {name: 'CampingRoute', params: {id: item.route.id}} ">
          <CampingRouteCard :camping-route="item.route" :image-urls="item.images" />
        </RouterLink>
      </div>
      <!-- Pagination Controls -->
        <div class="px-6 py-4 flex justify-center items-center">
          <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded disabled:opacity-50 mr-2"
          >
            Previous
          </button>
          <span class="text-gray-300 text-base">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
          <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded disabled:opacity-50 ml-2"
          >
            Next
          </button>
        </div>
    </div>
  </div>
</template>
