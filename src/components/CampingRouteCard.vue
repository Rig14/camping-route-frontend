<script setup lang="ts">
import {CampingRouteDto} from "../types/dto/CampingRouteDto";

defineProps<{campingRoute: CampingRouteDto}>();
</script>


<template>
    <div class="mb-5 max-w-sm rounded-2xl overflow-hidden shadow-lg border border-green-500">
      <img class="w-full" :src="campingRoute.thumbnailUrl" alt="" />
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">{{ campingRoute.name }}</div>
        <p class="text-gray-200 text-base">
          {{ campingRoute.description }}
        </p>
        <p class="text-gray-400 text-sm">
          Asukoht: {{ campingRoute.location }}
        </p>
      </div>
    </div>
</template>