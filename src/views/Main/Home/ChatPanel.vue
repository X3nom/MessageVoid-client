<template>
    <div class="w-full m-1 rounded-lg flex flex-col overflow-hidden bg-zinc-800">
        <div class="rounded-lg bg-zinc-700 flex">
            <button v-on:click="edit_contact_open = true"
                class="fa fa-edit pl-1 pr-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-600 rounded-lg" 
                style="font-size: x-large;"
                title="edit contact"
            ></button>
            <h1 class="text-xl ml-1 text-zinc-200">{{ current_chat.username }}</h1>
        </div>
        
        <div ref="chatScrollArea" class="flex-1 overflow-y-auto flex flex-col">
            <div v-for="message in current_chat.messages" class="flex w-full mb-2 rounded-lg hover:bg-zinc-700">
                <div v-html="(message.own)? current_identity.identicon : current_chat_identicon"></div>
                <div class="flex flex-col w-full">
                    <div class="flex justify-between">
                        <!-- username -->
                        <div>
                            <span class="text-lg text-zinc-300">{{ (message.own)? current_identity.name : current_chat.username }}</span>
                            <span v-if="message.own" class="text-sm text-zinc-500"> (you)</span>
                        </div>
                        <span class="mr-4 text-xs text-zinc-400">{{ new Date(message.send_time).toDateString() }} - {{ new Date(message.send_time).toLocaleTimeString() }}</span>
                    </div>
                    <!-- message -->
                    <pre class="pl-2 wrap-anywhere text-wrap">{{ message.text }}</pre>
                </div>
            </div>
        </div>

        <div class="w-full h-fit rounded-lg items-start bg-zinc-700 flex focus-within:outline-2 focus-within:outline-zinc-500">
            <textarea v-model="my_new_message" v-on:keydown="async (event)=>{if(event.key == 'Enter' && event.ctrlKey){await send_message_triggered(); autoGrow(event)}}"
            type="text" placeholder="message" @input="autoGrow"
            class="w-full p-2 rounded-lg outline-none resize-none"
            style="max-height: 35svh;"></textarea>
            <button v-on:click="send_message_triggered()"
            class="m-2 p-3 w-fit h-fit rounded-lg hover:bg-zinc-600 fa fa-send" :style="['font-size: x-large;', (sending)? 'loading-border':'']" title="send (ctrl+enter)"></button>
        </div>
  </div>
  <EditContactDialog 
    v-model:is_open="edit_contact_open"
    :chat_id="id"
    ></EditContactDialog>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { current_identity, reactive_state } from '../../../state';
import { import_identity } from '../../../logic/crypto/id';
import type { UserID } from '../../../schema/inner/id';
import { toSvg } from 'jdenticon/standalone';
import { build_message } from '../../../logic/crypto/message';
import { send_message } from '../../../logic/api/message-api';
import EditContactDialog from '../../../components/dialogs/EditContactDialog.vue';

onMounted(()=>{
    scrollToBottom();
})

const edit_contact_open = ref(false);

const route = useRoute();
const chatScrollArea = ref<HTMLElement | null>(null);
const my_new_message = ref('');
const sending = ref(false);

const id = Number(route.params.id);
const current_chat = current_identity.user_data!.chats[id];
const current_chat_identicon = toSvg(JSON.stringify(current_chat.userId), 40);


let recipient_uid :UserID|undefined = undefined;
recipient_uid // make TS shut up, it might get used in future? Idk why it's here to be honest :)
import_identity(JSON.parse(JSON.stringify(current_identity.user_data!.chats[id].userId)))
    .then((val)=>{recipient_uid = val})


function autoGrow(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}


function scrollToBottom() {
  if (chatScrollArea.value) {
    chatScrollArea.value.scrollTop = chatScrollArea.value.scrollHeight;
  }
}


async function send_message_triggered(){
    if(sending.value) return;

    sending.value = true;
    
    const new_msg = await build_message(my_new_message.value, current_chat.userId);
    
    try{
        const res = send_message(reactive_state.server, new_msg);
        res; // shut up TS
         
        current_chat.messages.push({
            text: my_new_message.value, 
            own: true,
            send_time: Date.now()
        });

        my_new_message.value = '';
        sending.value = false;
        
        nextTick(scrollToBottom);
    }
    catch (e){
        console.log('failed to send', e);
        sending.value = false;
    }
}

</script>