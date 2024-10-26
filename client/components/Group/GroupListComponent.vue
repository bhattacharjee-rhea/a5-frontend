<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import GroupComponent from "./GroupComponent.vue";
import GroupForm from "./GroupForm.vue";

const loaded = ref(false);
const editing = ref("");
const creating = ref(false);
const groups = ref<Array<Record<string, string>>>([]);

async function getGroups() {
  let groupResults;
  try {
    groupResults = await fetchy("/api/groups/creator", "GET");
  } catch (_) {
    return;
  }

  groups.value = groupResults;
}

function setEdit(groupId: any) {
  editing.value = groupId;
}

async function createGroup(_: any, name: string, members: string[]) {
  loaded.value = false;
  const group = await fetchy(`/api/groups/${name}`, "POST");

  await fetchy(`/api/groups/includes/${group.group._id}`, "PUT", {
    body: { members },
  });

  await getGroups();
  creating.value = false;
  loaded.value = true;
}

async function editGroup(group: Record<string, any>, name: string, members: string[]) {
  loaded.value = false;
  if (name !== group.name) {
    await fetchy(`/api/groups/name/${group._id}`, "PUT", {
      body: { name },
    });
  }

  const sorted_members = [...members].sort();
  const sorted_groupMembers = [...group.members].sort();

  if (!sorted_members.every((member, index) => member === sorted_groupMembers[index])) {
    await fetchy(`/api/groups/includes/${group._id}`, "PUT", {
      body: { members },
    });
  }

  await getGroups();
  editing.value = "";
  loaded.value = true;
}

onBeforeMount(async () => {
  await getGroups();
  loaded.value = true;
});
</script>

<template>
  <section>
    <button type="button" @click="creating = true">New group</button>
    <GroupForm v-if="creating" :group="undefined" @cancel="creating = false" @sendGroup="createGroup" />
  </section>
  <div class="row">
    <h2>Groups</h2>
  </div>
  <section class="groups" v-if="loaded && groups.length !== 0">
    <article v-for="group in groups" :key="group._id">
      <GroupComponent :group="group" @refreshGroups="getGroups" @editGroup="setEdit" />
      <GroupForm v-if="editing == group._id" :group="group" @cancel="editing = ''" @sendGroup="editGroup" />
    </article>
  </section>
  <p v-else-if="loaded">No groups found.</p>
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
