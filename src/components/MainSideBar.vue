<template>
    <div class="w-[256pt] flex flex-col overflow-hidden m-1 rounded-lg bg-zinc-800">
        <div class="rounded-lg flex-col justify-between">
            <div class="w-full rounded-lg mb-2 bg-zinc-700">
                <RouterLink to="/newest">
                    <div class="w-full rounded-t-lg text-center p-1 flex justify-around hover:bg-zinc-500">
                        <div class="w-full"><span>Inbox</span></div>
                        <div class="w-full text-zinc-400"><span>[0]</span></div>
                    </div>
                </RouterLink>
                <div class="border border-zinc-600"></div>
                <div class="flex justify-around p-1 text-center">
                    <div class="w-full rounded-lg"><span>Chats</span></div>
                    
                    <div class="w-full rounded-lg hover:bg-zinc-500" v-on:click="add_contact_open=true"><b>+</b></div>
                </div>
            </div>
        </div>

        <div class="overflow-y-scroll h-full flex flex-col grow">
            <div v-for="(chat, index) in current_identity.user_data?.chats" :key="index">
                <div v-on:click="router.push(`/chat/${index}`)"
                    :class="['flex items-center rounded-lg rounded-r-none border-b border-zinc-600 hover:bg-zinc-900', (Number(route.params.id)==index)? 'bg-zinc-900' : '']">
                    <div v-html="toSvg(JSON.stringify(chat.userId), 40)" class="rounded-lg border-r border-t border-l border-zinc-600 bg-zinc-800"></div>
                    <span class="pl-4 text-lg overflow-hidden">{{ chat.username }}</span>
                </div>
            </div>
        </div>



        <AddContactDialog
            v-model:is_open="add_contact_open"
        ></AddContactDialog>
    </div>
</template>


<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import AddContactDialog from './dialogs/AddContactDialog.vue';
import { current_identity } from '../state';
import { toSvg } from 'jdenticon/standalone';
import { router } from '../main';

const route = useRoute();

const add_contact_open = ref(false);



</script>