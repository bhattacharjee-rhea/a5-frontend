<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const props = defineProps(["group"]);
const emit = defineEmits(["editGroup", "refreshGroups"]);
const confirm = ref(false);

const deleteGroup = async () => {
  try {
    await fetchy(`/api/groups/${props.group._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshGroups");
};
</script>

<template>
  <p class="group-name">{{ props.group.name }}</p>
  <section class="group-members" v-for="member in props.group.members" :key="member">
    <p>{{ member }}</p>
  </section>
  <menu>
    <li><button class="btn-small pure-button" @click="emit('editGroup', props.group._id)">Edit</button></li>
    <li><button class="button-error btn-small pure-button" @click="confirm = true">Delete</button></li>

    <div v-if="confirm" class="modal">
      <div class="modal-content">
        <h3>Are you sure you want to delete "{{ props.group.name }}"?</h3>
        <button @click="deleteGroup">Delete</button>
        <button @click="confirm = false">Cancel</button>
      </div>
    </div>
  </menu>
</template>

<style scoped>
p {
  margin: 0em;
}

.group-name {
  font-weight: bold;
  font-size: 1.2em;
}

.group-members {
  margin-left: 1em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
