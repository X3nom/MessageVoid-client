<template>
    <div class="w-full overflow-hidden m-1 rounded-lg bg-zinc-800">
        <div class="p-1 m rounded-lg bg-zinc-700">
            <h1 class="text-l">Newest messages</h1>
        </div>

        <div class="flex flex-col">
            <div v-for="message in all_messages_by_time()">
                <div v-on:click="router.push(`chat/${message.chat_index}`)"
                    class="rounded-lg flex whitespace-nowrap hover:bg-zinc-700">
                    <div class="p-1" v-html="toSvg(JSON.stringify(current_identity.user_data!.chats[message.chat_index].userId), 30)"></div>
                    <span class="p-1">{{ current_identity.user_data!.chats[message.chat_index].username }}</span>
                    <span class="p-1 text-zinc-400">{{ new Date(message.send_time).toLocaleString() }}</span>
                    <span class="p-1 h-8 mt-1 mb-1 ml-4 mr-4 overflow-hidden text-ellipsis rounded-lg bg-zinc-700 text-zinc-300">{{ message.text }}</span>
                </div>
            </div>
        </div>

  </div>
</template>
<script setup lang="ts">
import { toSvg } from 'jdenticon/standalone';
import { current_identity } from '../../../state';
import { router } from '../../../main';


function all_messages_by_time(){
    const all_msg :{chat_index:number, send_time:number, text:string}[] = []

    for(const [index, chat] of current_identity.user_data!.chats.entries()){
        chat.messages.forEach(async (msg) => {
            if(msg.own) return; // do not add own msgs
            all_msg.push({
                chat_index: index,
                send_time: msg.send_time,
                text: msg.text
            })
        })
    }

    // sort by sent time
    all_msg.sort((a, b) => b.send_time - a.send_time);

    return all_msg;
}



</script>