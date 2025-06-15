<template>
    <div class="w-full m-1 rounded-lg flex flex-col bg-zinc-800">
        <div class="p-1 m rounded-lg bg-zinc-700">
            <h1 class="text-xl">{{ current_identity.user_data!.chats[id].username }}</h1>
        </div>
        
        <div class="h-full">
            <div class="flex flex-col">
            </div>
        </div>
        
        <div class="w-full rounded-lg items-start bg-zinc-700 flex focus-within:outline-2 focus-within:outline-zinc-500">
            <textarea v-model="message" v-on:keydown="(event)=>{if(event.key == 'Enter' && event.ctrlKey) send_message()}"
            type="text" placeholder="message" @input="autoGrow"
            class="w-full p-2 rounded-lg outline-none resize-none"></textarea>
            <button v-on:click="send_message()"
            class="m-2 p-3 w-fit h-fit rounded-lg hover:bg-zinc-600 fa fa-send" style="font-size: x-large;" title="send (ctrl+enter)"></button>
        </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { current_identity } from '../../../state';
import { import_identity } from '../../../logic/crypto/id';
import type { UserID } from '../../../schema/inner/id';

const route = useRoute();
const id = Number(route.params.id);
const message = ref('');

let recipient_uid :UserID|undefined = undefined;
import_identity(current_identity.user_data!.chats[id].userId).then((val)=>{recipient_uid = val})

function autoGrow(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

function send_message(){
    console.log(message.value);
    
}

</script>