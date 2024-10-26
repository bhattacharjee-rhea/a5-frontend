<script setup lang="ts">
import GroupListComponent from "@/components/Group/GroupListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Groups</h1>
    <GroupListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
