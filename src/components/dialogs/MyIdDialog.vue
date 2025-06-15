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
                My UserID
              </DialogTitle>
              <div class="flex flex-col w-full justify-center rounded-lg p-4 backdrop-blur-2xl bg-zinc-800">
                <h2>Publish name resolution</h2>

                <input v-model="name_resolution_address" :placeholder="'foo&bar.com'"
                  class="p-1 mt-4 mb-4 rounded-lg focus:outline-zinc-500 outline-2 outline-zinc-700">

                <button :class="['rounded-lg p-1 bg-zinc-900',
                    (address_okay(name_resolution_address) || name_publish_running)? 'hover:bg-zinc-700' : 'text-zinc-500', 
                    (name_publish_running)? 'loading-border' : ''
                  ]"
                  v-on:click="()=>{if(address_okay(name_resolution_address)) publish_name_clicked()}">
                  publish
                </button>
                <span v-if="address_already_taken"
                  class="text-center mt-2 rounded-lg bg-amber-700">
                  This address is already taken!
                </span>

              </div>
              <!-- You sure? dialog window -->
                <AreYouSure 
                  message="Do you really want to publish the name resolution?"
                  v-model:is_open="are_you_sure_open"
                  v-model:is_sure="is_sure"
                ></AreYouSure>
              <!-- Dialog window -->
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  
</div>

</template>

<script setup lang="ts">
import { type Ref, ref, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import AreYouSure from './AreYouSure.vue';
import type { RefSymbol } from '@vue/reactivity';
import { publish_name_resolution } from '../../logic/api/name-resolve-api';
import { current_identity, state } from '../../state';
import { export_identity_pub } from '../../logic/crypto/id';

const props = defineProps<{
  is_open: boolean
}>();
const emit = defineEmits<{
  (e: 'update:is_open', value: boolean): void
}>();

function toggleOpen() {
  emit('update:is_open', !props.is_open);
}

const are_you_sure_open = ref(false);
const is_sure = ref(false);
const name_resolution_address = ref('');
const name_publish_running = ref(false);
const address_already_taken = ref(false);


function publish_name_clicked(){
  are_you_sure_open.value = true;

}
watch(are_you_sure_open, async (val, old_val) => {
  if(val == false && old_val == true){
    if(is_sure){
      if(state.userId?.pub_id == undefined){
        is_sure.value = false;
        return
      }
      name_publish_running.value = true;

      let [name, server] = name_resolution_address.value.split('&');
      
      // add protocol specifier to the server (if does not have already)
      server = (server.includes('http://') || server.includes('https://'))? server : 'http://' + server
      
      const res = await publish_name_resolution(server, name, 
        await export_identity_pub(state.userId.pub_id)
      )
      
      name_publish_running.value = false;

      address_already_taken.value = false;
      if(res.status == 409) 
        address_already_taken.value = true;

      else if(res.status == 200)
        toggleOpen();
    }
  }
})

function address_okay(addr: string){
  return addr.split('&').length == 2
}


</script>