<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const props = defineProps(["friends", "loaded"]);
const emit = defineEmits(["refreshFriends"]);
const confirm = ref(false);

const unfriend = async (friend: string) => {
  try {
    await fetchy(`/api/friends/${friend}`, "DELETE");
  } catch {
    return;
  }

  confirm.value = false;
  emit("refreshFriends");
};
</script>

<template>
  <main>
    <section class="friend-list" v-if="props.loaded">
      <div v-for="friend in props.friends" :key="friend">
        <p>{{ friend }}</p>
        <button type="button" class="button-small pure-button" @click="confirm = true">Unfriend</button>

        <div v-if="confirm" class="modal">
          <div class="modal-content">
            <h3>Are you sure you want to unfriend {{ friend }}?</h3>
            <button @click="unfriend(friend)">Unfriend</button>
            <button @click="confirm = false">Cancel</button>
          </div>
        </div>
      </div>
    </section>
    <p v-else>Loading...</p>
  </main>
</template>

<style scoped>
h2 {
  text-align: center;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
}
</style>
