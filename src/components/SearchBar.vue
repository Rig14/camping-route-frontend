<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const searchedValue = ref<String>("");

const search = () => {
  try {
    router.push({
      name: "SearchResults",
      query: {
        q: searchedValue.value,
      }
    })
  } catch (error) {
    console.log("Error while searching routes: " + error);
  }
}

</script>

<template>
  <form @submit.prevent="search">
    <div class="bg-green-950 border-2 border-green-900  shadow p-2 relative rounded-xl flex">
      <span class="w-auto flex justify-end  items-center text-gray-500 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </span>
    <input type="text" placeholder="Otsi matkaradu..." v-model="searchedValue" required class="text-white bg-transparent focus:outline-none">
      <button type="submit" class="bg-black hover:bg-gray-700 rounded-xl text-white font-semibold text-xs text-xl p-2 pl-4 pr-4 ml-2">
        Search
      </button>
    </div>
  </form>
</template>