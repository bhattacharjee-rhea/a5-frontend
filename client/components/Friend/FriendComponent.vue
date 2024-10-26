<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import FriendListComponent from "./FriendListComponent.vue";
import FriendRequestComponent from "./FriendRequestComponent.vue";
import IncomingRequestComponent from "./IncomingRequestComponent.vue";
import OutgoingRequestComponent from "./OutgoingRequestComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
const newRequest = ref(false);
let friends = ref<Array<Record<string, string>>>([]);
let incomingRequests = ref<Array<Record<string, string>>>([]);
let outgoingRequests = ref<Array<Record<string, string>>>([]);

async function getFriends() {
  let friendResults;
  try {
    friendResults = await fetchy("/api/friends", "GET");
  } catch (_) {
    return;
  }
  friends.value = friendResults;
}

async function getRequests() {
  let requestResults;
  try {
    requestResults = await fetchy("/api/friend/requests", "GET");
  } catch (_) {
    return;
  }

  requestResults = requestResults.filter((request: any) => request.status == "pending");
  incomingRequests.value = requestResults.filter((request: any) => request.to == currentUsername.value);
  outgoingRequests.value = requestResults.filter((request: any) => request.from == currentUsername.value);
}

onBeforeMount(async () => {
  await getFriends();
  await getRequests();
  loaded.value = true;
});
</script>

<template>
  <main>
    <button type="button" class="pure-button-primary pure-button" @click="newRequest = true">Send Friend Request</button>
    <FriendRequestComponent v-if="newRequest" @refreshRequests="getRequests" @closeRequest="newRequest = false" />
    <OutgoingRequestComponent v-if="outgoingRequests.length > 0" :requests="outgoingRequests" :loaded="loaded" @refreshRequests="getRequests" />
    <IncomingRequestComponent
      v-if="incomingRequests.length > 0"
      :requests="incomingRequests"
      :loaded="loaded"
      @refreshRequests="
        getRequests();
        getFriends();
      "
    />
    <h2>Friends</h2>
    <FriendListComponent v-if="friends.length > 0" :friends="friends" :loaded="loaded" @refreshFriends="getFriends" />
    <p v-else>No friends found.</p>
  </main>
</template>

<style scoped>
h2 {
  text-align: center;
}
</style>
