<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const props = defineProps(["requests", "loaded"]);
const confirm = ref(false);
const emit = defineEmits(["refreshRequests"]);

const remove = async (to: string) => {
  try {
    await fetchy(`/api/friend/requests/${to}`, "DELETE");
  } catch {
    return;
  }

  confirm.value = false;
  emit("refreshRequests");
};
</script>

<template>
  <main>
    <h2>Your Requests</h2>
    <section class="request-list" v-if="props.loaded">
      <div v-for="request in props.requests" :key="request._id">
        <p>{{ request.to }}</p>
        <button type="button" class="button-small pure-button" @click="confirm = true">Remove</button>

        <div v-if="confirm" class="modal">
          <div class="modal-content">
            <h3>Are you sure you want to remove this request?</h3>
            <button @click="remove(request.to)">Remove</button>
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
