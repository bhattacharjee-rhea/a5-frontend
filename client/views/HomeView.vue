<script setup lang="ts">
import FeedComponent from "@/components/Feed/FeedComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <FeedComponent v-if="isLoggedIn" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
