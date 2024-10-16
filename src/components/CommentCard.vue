<script setup lang="ts">
import { CommentDto } from "../types/dto/CommentDto";

defineProps<{ comment: CommentDto }>();
</script>

<template>
  <div class="mb-5 max-w-sm rounded-2xl overflow-hidden shadow-lg border border-green-500">
    <div class="px-6 py-4">
      <p class="text-gray-500 text-sm">anonymous user</p>
      <p class="text-gray-200 text-base">
        {{ comment.content }}
      </p>
    </div>
  </div>
</template>
