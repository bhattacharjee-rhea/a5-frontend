<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";
import PermissionsComponent from "./PermissionsComponent.vue";

const props = defineProps(["post"]);
const content = ref(props.post.content);
const viewPermissions = ref(props.post.viewPermissions.map(({ target, groupName }: any) => ({ target, groupName })));
const likePermissions = ref(props.post.likePermissions.map(({ target, groupName }: any) => ({ target, groupName })));

const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async (content: string) => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { content: content } });
    await fetchy(`/api/permission/views`, "PUT", { body: { postId: props.post._id, groupIds: viewPermissions.value.map((permission: any) => permission.target) } });
    await fetchy(`/api/permission/likes`, "PUT", { body: { postId: props.post._id, groupIds: likePermissions.value.map((permission: any) => permission.target) } });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};

const updatePermissions = (type: "view" | "like", permission: any) => {
  if (type === "view") {
    viewPermissions.value = permission;
  } else if (type === "like") {
    likePermissions.value = permission;
  }
};
</script>

<template>
  <form @submit.prevent="editPost(content)">
    <p class="author">{{ props.post.author }}</p>
    <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <PermissionsComponent :post="props.post" @refreshPermissions="updatePermissions" />
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editPost')">Cancel</button></li>
      </menu>
      <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
