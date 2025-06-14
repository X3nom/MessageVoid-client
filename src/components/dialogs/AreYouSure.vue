<template>

<TransitionRoot appear :show="is_open" as="template">
    <Dialog as="div" @close="toggleOpen()" class="relative z-20">
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template">
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-lg p-1
              bg-zinc-800 backdrop-blur-2xl backdrop-opacity-85 text-left align-middle shadow-lg shadow-zinc-900 transition-all border border-zinc-700">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 pl-4 pt-2 mb-1">
                Are you sure?
              </DialogTitle>
              <p class="pl-4 mt-2">{{ message }}</p>
              <div class="flex justify-end mt-2">
                <button class="rounded-lg p-2 mr-2 min-w-[60pt] bg-zinc-700 hover:bg-zinc-600" 
                v-on:click="sure(false); toggleOpen()">
                    cancel
                </button>
                <button class="rounded-lg p-2 min-w-[60pt] bg-amber-800 hover:bg-amber-500" 
                v-on:click="sure(true); toggleOpen()">
                    yes
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
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';

const props = defineProps<{
  is_open: boolean,
  is_sure: boolean,
  message: string
}>();
const emit = defineEmits<{
  (e: 'update:is_open', value: boolean): void,
  (e: 'update:is_sure', value: boolean): void
}>();

function toggleOpen() {
  emit('update:is_open', !props.is_open);
}
function sure(val :boolean){
    emit('update:is_sure', val);
}

</script>