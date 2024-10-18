<script setup lang="ts">
import FeedPostComponent from "@/components/Feed/FeedPostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import SearchPostForm from "./SearchPostForm.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let searchAuthor = ref("");

const visiblePosts = computed(() => {
  return posts.value.filter((post) => post.viewable && post.author !== currentUsername.value);
});

async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults;
}

async function getPermissions() {
  for (const post of posts.value) {
    let permissions;
    try {
      permissions = await fetchy(`/api/permissions/post/${post._id}`, "GET");
    } catch (_) {
      return;
    }
    post.viewable = permissions.view;
    post.likeable = permissions.like;
  }
}

async function getLikes() {
  for (const post of posts.value) {
    let liked;
    try {
      liked = await fetchy(`/api/likes/user/${post._id}`, "GET");
    } catch (_) {
      return;
    }

    post.liked = liked;
  }
}

onBeforeMount(async () => {
  await getPosts();

  if (isLoggedIn.value) {
    await getPermissions();
    await getLikes();
  }

  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <h2 v-if="!searchAuthor">Posts:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
    <SearchPostForm @getPostsByAuthor="getPosts" />
  </div>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in visiblePosts" :key="post._id">
      <FeedPostComponent :post="post" @refreshLikes="getLikes" />
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
