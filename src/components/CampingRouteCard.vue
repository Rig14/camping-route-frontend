<script lang="ts" setup>
import {CampingRouteDto} from "../types/dto/CampingRouteDto";

defineProps<{campingRoute: CampingRouteDto, imageUrls: string[]}>();
</script>


<template>
    <div class="h-80 max-w-sm rounded-2xl overflow-hidden shadow-lg border border-green-500">
      <div class="grid grid-cols-2 h-40 justify-center items-center gap-2 pr-2 pl-2">
        <img v-for="url in imageUrls.length >= 2 ? imageUrls.slice(0,2) : imageUrls" :src="url" alt="" class="w-32 h-32">
      </div>
      <div class="border h-px border-green-500"></div>
      <div class="px-6 py-1">
        <h5 class="font-bold text-xl mb-2">{{ campingRoute.name }}</h5>
        <p class="text-left text-gray-200 text-base">
          Kirjeldus: {{ campingRoute.description }}
        </p>
        <p class="text-left text-gray-500 text-sm">
          Asukoht: {{ campingRoute.location }}
        </p>
      </div>
    </div>
</template>