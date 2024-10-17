<script setup lang="ts">
import { inject, ref, watch } from 'vue'

const provided = inject('error');
const queue = ref<string[]>([]);
const message = ref("");


watch(provided, (newValue) => {
  provided.value = "";
  if (newValue) {
    queue.value.push(newValue);
  }
  if (message.value === "") {
    showError();
  }
})

function showError() {
  const queueLength = queue.value.length;
  message.value = queue.value.shift() ?? "";
  if (queueLength != 0) {
    setTimeout(showError, 5000)
  }
}
</script>

<template>
  <Transition name="fade">
    <div v-if="message" class="fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
      {{ message }}
    </div>
  </Transition>
</template>
