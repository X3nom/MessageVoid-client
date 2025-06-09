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
            <div v-for="chat in known_recipients">
                <span class="pl-4">{{ chat }}</span>
            </div>
        </div>



        <TransitionRoot appear :show="add_contact_open" as="template">
        <Dialog as="div" @close="add_contact_open=false" class="relative z-10">
        <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template">
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg p-1
                bg-zinc-800 backdrop-blur-2xl text-left align-middle shadow-lg shadow-zinc-900 transition-all border border-zinc-700">
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 pl-4 pt-2 mb-1">
                        Add chat using:
                    </DialogTitle>
                    <div class="flex flex-col w-full justify-center rounded-lg p-4 backdrop-blur-2xl bg-zinc-800">
                        <h2>name resolution address</h2>
                        <input :placeholder="'foo&bar.com'" class="p-1 mt-4 mb-4 rounded-lg focus:outline-zinc-500 outline-2 outline-zinc-700">
                        <button class="rounded-lg p-1 hover:bg-zinc-700">ok</button>
                    </div>
                </DialogPanel>
            </TransitionChild>
            </div>
        </div>
        </Dialog>
        </TransitionRoot>
    </div>
</template>


<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue';
import { resolve_by_name } from '../logic/api/name-resolve-api';

const known_recipients = ref([]);

const add_contact_open = ref(false);


async function resolve(address: string){
    const [name, server] = address.split('&');
    const userid = await resolve_by_name(server, name);
    console.log(userid);
}


for(let i=0; i<200; i++){
}

</script>