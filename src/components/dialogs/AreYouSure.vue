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
              <span class="pl-4 mt-2 block font-bold">{{ message }}</span>

              <div v-if="confirm_text" class="flex flex-col mt-3 pl-4">
                <span class="text-zinc-400">In order to confirm, please type in this text:</span>
                <span class="font-bold text-center text-lg text-red-500">{{ confirm_text }}</span>
                <input v-model="confirmed_text" class="p-1 rounded-lg bg-zinc-700 outline-0 focus:outline-2 focus:outline-red-500">
              </div>
              <div class="flex justify-end mt-2">
                <button class="rounded-lg p-2 mr-2 min-w-[60pt] bg-zinc-700 hover:bg-zinc-600" 
                v-on:click="sure(false)">
                    cancel
                </button>
                <button :class="[
                    'rounded-lg p-2 min-w-[60pt] bg-amber-800', 
                    (confirm_text && confirm_text != confirmed_text)? 'text-zinc-300 bg-zinc-900' : 'hover:bg-amber-500'
                  ]"
                v-on:click="sure(true)">
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
import { ref } from 'vue';

const props = withDefaults(defineProps<{
  is_open: boolean,
  is_sure: boolean,
  message: string,
  confirm_text?: string | undefined,
}>(),
{
  confirm_text: undefined
});

const emit = defineEmits<{
  (e: 'update:is_open', value: boolean): void,
  (e: 'update:is_sure', value: boolean): void
}>();

function toggleOpen() {
  emit('update:is_open', !props.is_open);
}
function sure(val :boolean){
  if(val && props.confirm_text && props.confirm_text != confirmed_text.value) return; // text-confirm required but not confirmed, return

  emit('update:is_sure', val);

  toggleOpen();
}

const confirmed_text = ref('');

</script>