<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getPosts() {
  const author = currentUsername.value;
  let query: Record<string, string> = { author };
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  posts.value = postResults;

  for (const post of posts.value) {
    let info;
    try {
      info = await fetchy(`/api/posts/info/${post._id}`, "GET");
    } catch (_) {
      continue;
    }

    post.likes = info.likes;
    post.viewPermissions = info.viewPermissions;
    post.likePermissions = info.likePermissions;
  }
}

function updateEditing(id: string) {
  editing.value = id;
}

async function getPermissions(id: string) {
  for (const post of posts.value) {
    if (post._id == id) {
      let permissions;
      try {
        permissions = await fetchy(`/api/permissions/${id}`, "GET");
      } catch (_) {
        return;
      }

      post.viewPermissions = permissions.viewPermissions;
      post.likePermissions = permissions.likePermissions;
    }
  }
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <section>
    <h2>Create a post:</h2>
    <CreatePostForm @refreshPosts="getPosts" />
  </section>
  <div class="row">
    <h2>Posts:</h2>
  </div>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <div v-else>
        <EditPostForm :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      </div>
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
