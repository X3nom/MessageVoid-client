<template>

<TransitionRoot appear :show="is_open" as="template">
    <Dialog as="div" @close="toggleOpen()" class="relative z-10">
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
                    <input v-model="name_res_addr" :placeholder="'foo&bar.com'" class="p-1 mt-4 mb-4 rounded-lg focus:outline-zinc-500 outline-2 outline-zinc-700">
                    <button v-on:click="resolve(name_res_addr);" 
                    :class="['rounded-lg p-1 bg-zinc-900',
                        (name_res_addr.includes('&') && !resolve_running)? 'hover:bg-zinc-700' : 'text-zinc-400',
                        (resolve_running)? 'loading-border' : ''
                    ]">
                        ok
                    </button>
                </div>
            </DialogPanel>
        </TransitionChild>
        </div>
    </div>
    </Dialog>
</TransitionRoot>

</template>
<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue';
import { resolve_by_name } from '../../logic/api/name-resolve-api';
import { current_identity, state } from '../../state';
import { update_user_data } from '../../logic/connectors/local-db';
import { ref } from 'vue';

const props = defineProps<{
  is_open: boolean
}>();
const emit = defineEmits<{
  (e: 'update:is_open', value: boolean): void
}>();

function toggleOpen() {
  emit('update:is_open', !props.is_open);
}


const name_res_addr = ref('');
const resolve_running = ref(false);

async function resolve(address: string){
    console.log(current_identity)
    if(resolve_running.value) return;
    resolve_running.value = true;

    try{
        let [name, server] = address.split('&');
        server = (server.includes('http://') || server.includes('https://'))? server : 'https://' + server
        const userid = await resolve_by_name(server, name);
        
        if(current_identity.user_data?.chats.filter((chat) => {
            return chat.userId == userid;
        }).length != 0){
            // duplicate
            return;
        }

        current_identity.user_data!.chats.push({
            username: name,
            userId: userid,
            messages: []
        });
        
        await update_user_data(current_identity.db_id!, current_identity.user_data!, state.userId!);

        resolve_running.value = false;

        toggleOpen();
    }
    catch{
        resolve_running.value = false;
    }
}



</script>