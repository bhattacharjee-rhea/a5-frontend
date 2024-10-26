<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const friendList = ref<Array<string>>([]);
const selectedFriends = ref<Array<string>>([]);
const props = defineProps(["group"]);
const emit = defineEmits(["sendGroup", "cancel"]);

const name = ref(props.group ? props.group.name : "");
const addMember = ref(false);
const loaded = ref(false);
const groupMembers = ref(props.group ? [...props.group.members] : []);

async function editMembers() {
  addMember.value = true;
  loaded.value = false;
  let friends;
  try {
    friends = await fetchy("/api/friends", "GET");
  } catch (_) {
    return;
  }

  friendList.value = friends;
  selectedFriends.value = groupMembers.value;
  loaded.value = true;
}

function saveMembers() {
  groupMembers.value = selectedFriends.value;
  addMember.value = false;
}
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <h2 v-if="group !== undefined">Edit "{{ props.group.name }}"</h2>
      <h2 v-else>New group</h2>
      <form @submit.prevent="emit('sendGroup', props.group, name, groupMembers)">
        <label for="groupName">Name: </label>
        <input type="text" id="groupName" v-model="name" required />
        <section v-if="!addMember">
          <p>Members:</p>
          <li v-for="member in groupMembers" :key="member">{{ member }}</li>
          <button v-if="groupMembers.length > 0" type="button" @click="editMembers">edit members</button>
          <button v-else type="button" @click="editMembers">add members</button>
        </section>

        <section v-if="addMember && loaded">
          <p>Edit members</p>
          <div v-for="friend in friendList" :key="friend" class="friend">
            <input type="checkbox" v-model="selectedFriends" :value="friend" />
            <label>{{ friend }}</label>
          </div>
          <button type="button" @click="saveMembers">save</button>
          <button type="button" @click="addMember = false">cancel</button>
        </section>
        <p v-else-if="addMember && !loaded">loading...</p>

        <div class="base" v-if="!addMember">
          <menu>
            <li><button v-if="props.group" class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
            <li><button v-if="props.group == undefined" class="btn-small pure-button-primary pure-button" type="submit">Create</button></li>
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
