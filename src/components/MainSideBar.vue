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
                    <div class="w-full rounded-lg hover:bg-zinc-400"><span><b>+</b></span></div>
                </div>
            </div>
        </div>

        <div class="overflow-y-scroll h-full flex flex-col grow">
            <div v-for="chat in known_recipients">
                <span class="pl-4">{{ chat }}</span>
            </div>
        </div>
        
    </div>
</template>


<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

const known_recipients = ref([]);

for(let i=0; i<200; i++){
}

</script>