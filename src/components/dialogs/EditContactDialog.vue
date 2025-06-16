<template>

    <div>
        <TransitionRoot appear :show="is_open" as="template">
            <Dialog as="div" @close="toggleOpen()" class="relative z-10">
                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild as="template">
                            <DialogPanel
                                class="w-full max-w-md transform overflow-hidden rounded-lg p-1
                  bg-zinc-800 backdrop-blur-2xl text-left align-middle shadow-lg shadow-zinc-900 transition-all border border-zinc-700">
                                <DialogTitle as="h3" class="text-lg font-medium leading-6 pl-4 pt-2 mb-1">
                                    Edit Contact
                                </DialogTitle>
                                <div
                                    class="flex flex-col w-full justify-center rounded-lg p-4 backdrop-blur-2xl bg-zinc-800">
                                    <h2>username</h2>
                                    <input v-model="new_name"
                                        placeholder="new name"
                                        class="p-1 mt-2 mb-2 rounded-lg focus:outline-zinc-500 outline-2 outline-zinc-700"
                                    >
                                    <div class="text-right text-zinc-100">
                                        <button class="ms-2 p-2 bg-zinc-900 hover:bg-zinc-700 rounded-lg" v-on:click="toggleOpen()">cancel</button>
                                        <button class="ms-2 p-2 bg-zinc-900 hover:bg-zinc-700 rounded-lg" v-on:click="apply_changes()">apply</button>
                                    </div>

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
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { ref } from 'vue';
import { current_identity, state } from '../../state';
import { update_user_data } from '../../logic/connectors/local-db';

const props = defineProps<{
  is_open: boolean,
  chat_id: number,
}>();
const emit = defineEmits<{
  (e: 'update:is_open', value: boolean): void,
}>();

function toggleOpen() {
  emit('update:is_open', !props.is_open);
  new_name.value = current_identity.user_data!.chats[props.chat_id].username // reset state
}

const new_name = ref(current_identity.user_data!.chats[props.chat_id].username);


function apply_changes(){

    current_identity.user_data!.chats[props.chat_id].username = new_name.value;

    update_user_data(current_identity.db_id!, current_identity.user_data!, state.userId!);
    toggleOpen();
}

</script>