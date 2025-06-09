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
                Add chat using:
              </DialogTitle>
              <div class="flex flex-col w-full justify-center rounded-lg p-4 backdrop-blur-2xl bg-zinc-800">
                <h2>name resolution address</h2>
                <input :placeholder="'foo&bar.com'"
                  class="p-1 mt-4 mb-4 rounded-lg focus:outline-zinc-500 outline-2 outline-zinc-700">
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
import { type Ref } from 'vue';

const props = defineProps<{
  is_open: boolean
}>();
const emit = defineEmits<{
  (e: 'update:is_open', value: boolean): void
}>();

function toggleOpen() {
  emit('update:is_open', !props.is_open);
}
</script>