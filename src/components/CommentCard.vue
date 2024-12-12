<script lang="ts" setup>
import { CommentDto } from "../types/dto/CommentDto";
import {inject} from "vue";
import {Axios} from "axios";

const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected")
}

defineProps<{ comment: CommentDto, removeComment: (id: (number | undefined)) => Promise<void>, shouldShowDelete: () => boolean}>();

</script>

<template>
  <div class="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-gray-400">
    <div class="px-6 py-4">
      <p class="text-gray-500 text-sm">Anonüümne kasutaja</p>
      <p class="text-gray-200 text-base">
        {{ comment.content }}
      </p>
    </div>
    <button v-if="shouldShowDelete()" class="top-2 right-2 bg-red-600 absolute rounded-full p-2 size-8 flex justify-center items-center transition hover:bg-red-800" @click="removeComment(comment.id)">
      x
    </button>
  </div>
</template>
