<script setup lang="ts">
import { formatDate } from "@/utils/formatDate";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["refreshLikes"]);

const likePost = async () => {
  try {
    await fetchy(`/api/likes/${props.post._id}`, "PUT");
  } catch {
    return;
  }
  emit("refreshLikes");
};

const unlikePost = async () => {
  try {
    await fetchy(`/api/likes/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshLikes");
};
</script>

<template>
  <menu>
    <p class="author">{{ props.post.author }}</p>
    <div v-if="props.post.likeable" class="likes">
      <button v-if="!props.post.liked" class="btn-small pure-button" @click="likePost">Like</button>
      <button v-else class="btn-small pure-button" @click="unlikePost">Unlike</button>
    </div>
  </menu>
  <p>{{ props.post.content }}</p>
  <div class="base">
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

.likes {
  margin-left: auto;
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
