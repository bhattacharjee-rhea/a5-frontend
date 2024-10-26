<script setup lang="ts">
import { ref } from "vue";
import AddGroupComponent from "./AddGroupComponent.vue";

const props = defineProps(["post"]);
const emit = defineEmits(["refreshPermissions"]);

const viewPermissions = ref(props.post ? props.post.viewPermissions.map(({ target, groupName }) => ({ target, groupName })) : []);
const likePermissions = ref(props.post ? props.post.likePermissions.map(({ target, groupName }) => ({ target, groupName })) : []);
const editing = ref("");

function updatePermissions(groups: any[], type: "view" | "like") {
  const permission = type == "view" ? viewPermissions : likePermissions;
  permission.value = groups.map(({ _id, name }) => ({ target: _id, groupName: name }));
  emit("refreshPermissions", type, permission.value);
  editing.value = "";
}
</script>

<template>
  <p>View permissions:</p>
  <section>
    <p v-for="permission of viewPermissions" :key="permission">{{ permission.groupName }}</p>
  </section>
  <button v-if="viewPermissions.length == 0" type="button" class="btn-small pure-button" @click="editing = 'view'">+ add groups</button>
  <button v-else type="button" class="btn-small pure-button" @click="editing = 'view'">+ edit groups</button>
  <AddGroupComponent v-if="editing == 'view'" :type="'view'" :permissions="viewPermissions" @cancel="editing = ''" @update="updatePermissions($event, 'view')" />
  <p>Like permissions:</p>
  <section>
    <p v-for="permission of likePermissions" :key="permission._id">{{ permission.groupName }}</p>
  </section>
  <button v-if="likePermissions.length == 0" type="button" class="btn-small pure-button" @click="editing = 'like'">+ add groups</button>
  <button v-else type="button" class="btn-small pure-button" @click="editing = 'like'">+ edit groups</button>
  <AddGroupComponent v-if="editing == 'like'" :type="'like'" :permissions="likePermissions" @cancel="editing = ''" @update="updatePermissions($event, 'like')" />
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
