<script setup>
import ChatList from './views/ChatList.vue';
import ChatScreen from './views/ChatScreen.vue';
import SelectId from './views/SelectId.vue';
import CreateId from './views/CreateId.vue';

</script>

<template>
    <div class="flex flex-row w-full h-full">
      <CreateId />
      <SelectId />
      <ChatList />
      <ChatScreen />
    </div>
</template>
