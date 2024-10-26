<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const username = ref("");
const emit = defineEmits(["refreshRequests", "closeRequest"]);

const sendRequest = async (to: string) => {
  try {
    await fetchy(`/api/friend/requests/${to}`, "POST");
  } catch (_) {
    return;
  }

  username.value = "";
  emit("refreshRequests");
  emit("closeRequest");
};
</script>

<template>
  <main>
    <div class="modal">
      <div class="modal-content">
        <h2>New Friend Request</h2>
        <form @submit.prevent="sendRequest(username)">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required />
          <button type="submit" class="pure-button-primary pure-button">Send request</button>
          <button type="button" class="pure-button-primary pure-button" @click="emit('closeRequest')">Cancel</button>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
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
