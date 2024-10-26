<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import PermissionsComponent from "./PermissionsComponent.vue";

const content = ref("");
const emit = defineEmits(["refreshPosts"]);
const viewPermissions = ref<Array<string>>([]);
const likePermissions = ref<Array<string>>([]);

const createPost = async (content: string) => {
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "POST", {
      body: { content },
    });
  } catch (_) {
    return;
  }

  const post = postResults.post;

  try {
    await fetchy(`/api/posts/${post._id}`, "PATCH", { body: { content: content } });
    await fetchy(`/api/permission/views`, "PUT", { body: { postId: post._id, groupIds: viewPermissions.value } });
    await fetchy(`/api/permission/likes`, "PUT", { body: { postId: post._id, groupIds: likePermissions.value } });
  } catch (e) {
    return;
  }

  emit("refreshPosts");
  emptyForm();
};

const createPermissions = (type: "view" | "like", permission: any) => {
  if (type === "view") {
    viewPermissions.value = permission.map((permission: any) => permission.target);
  } else if (type === "like") {
    likePermissions.value = permission.map((permission: any) => permission.target);
  }
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(content)">
    <label for="content">Post Contents:</label>
    <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <PermissionsComponent :post="undefined" @refreshPermissions="createPermissions" />
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
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
