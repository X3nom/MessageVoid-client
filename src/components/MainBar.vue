<template>
    <div class="w-full h-fit pr-4 pl-4 flex justify-between items-center bg-zinc-950/40 backdrop-blur-sm">
        <div class="p-3 pb-1 rounded-lg bg-zinc-800">
            <!-- <MessageVoidLogo/> -->
        </div>

        <div class="rounded-lg h-fit w-fit">
            <input v-model="prompt"
                class="w-[50svw] h-8 rounded-lg pl-2 pr-2 focus:outline-none  bg-zinc-700"
                placeholder="start typing . . ."
            >
            <div v-if="prompt.length > 0"
                class="absolute w-[70svw] left-[15svw] h-fit h-min-[40svh] h-max-[80svh] rounded-lg flex flex-col border-2 border-zinc-600 bg-zinc-900">
                <span>abcd</span>
                <span>abcd</span>
                <span>abcd</span>
                <span>abcd</span>
            </div>
        </div>
        
        <div class="flex items-center w-fit rounded-lg p-1 bg-zinc-800 hover:bg-zinc-700">
            <div v-html="current_identity.identicon" class="mr-2 bg-zinc-800 rounded-lg border border-zinc-600"></div>
            <span class="mr-4">{{ current_identity.name }}</span>
        </div>
        
    </div>
</template>

<script setup lang='ts'>
import MessageVoidLogo from './MessageVoidLogo.vue';
import { current_identity } from '../state';
import { ref } from 'vue';

const prompt = ref('');


</script>