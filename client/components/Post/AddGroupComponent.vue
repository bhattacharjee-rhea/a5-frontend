<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const groupList = ref<Array<Record<string, string>>>([]);
const props = defineProps(["permissions", "type"]);
const emit = defineEmits(["update", "cancel"]);

const loaded = ref(false);
const selectedGroups = ref<Array<string>>([]);

async function getGroups() {
  let groups;
  try {
    groups = await fetchy("/api/groups/creator", "GET");
  } catch (_) {
    return;
  }

  groupList.value = groups;
}

function updateGroups() {
  const selected = groupList.value.filter((group) => selectedGroups.value.includes(group._id));
  selectedGroups.value = [];
  emit("update", selected);
}

onBeforeMount(async () => {
  loaded.value = false;
  selectedGroups.value = props.permissions.map((permission: any) => permission.target);
  await getGroups();
  loaded.value = true;
});
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <h2 v-if="props.permissions.length > 0">Edit {{ props.type }} groups</h2>
      <h2 v-else>Add {{ props.type }} groups</h2>
      <form @submit.prevent="updateGroups">
        <section v-if="loaded">
          <div v-for="group in groupList" :key="group._id" class="group">
            <input type="checkbox" v-model="selectedGroups" :value="group._id" />
            <label>{{ group.name }}</label>
          </div>
        </section>
        <p v-else>loading...</p>

        <div class="base">
          <menu>
            <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
            <li><button class="btn-small pure-button" @click="emit('cancel')">Cancel</button></li>
          </menu>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
h1 {
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

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}
</style>
