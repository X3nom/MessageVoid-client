<template>

<div>
  <TransitionRoot appear :show="is_open" as="template">
    <Dialog as="div" @close="toggleOpen()" class="relative z-10">
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template">
            <DialogPanel
              class="w-full max-w-xl max-h-[80svh] overflow-scroll transform rounded-lg p-1
              bg-zinc-900 backdrop-blur-2xl text-left align-middle shadow-lg shadow-zinc-900 transition-all border border-zinc-700">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 pl-4 pt-2 mb-1">
                My UserID
              </DialogTitle>
              <div class="flex flex-col space-y-6">
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
                <div class="flex flex-col w-full justify-center space-y-2 rounded-lg p-4 backdrop-blur-2xl bg-zinc-800">
                  <h2>Edit my username</h2>
                  <input v-model="new_username" :placeholder="'new username'"
                    class="p-1 rounded-lg focus:outline-zinc-500 outline-2 outline-zinc-700">
                  <button class="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-600" v-on:click="apply_username_change()">apply</button>


                  <h2 class="mt-2">Set new password</h2>
                  <input v-model="old_password" :placeholder="'old password'" type="password"
                    class="p-1 rounded-lg focus:outline-zinc-500 outline-2 outline-zinc-700">
                  <input v-model="new_password" :placeholder="'new password'" type="password"
                    class="p-1 rounded-lg focus:outline-zinc-500 outline-2 outline-zinc-700">
                  <input v-model="new_password_2" :placeholder="'confirm new password'" type="password"
                  class="p-1 rounded-lg focus:outline-zinc-500 outline-2 outline-zinc-700">
                  <button class="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-600" v-on:click="apply_passwd_change()">apply</button>
                  
                </div>
                <div class="flex flex-col w-full justify-center rounded-lg p-4 backdrop-blur-2xl bg-zinc-800">
                  <h2>Export this UserID <em>(not working)</em></h2>
                  <div class="w-fit p-2 rounded-lg bg-zinc-700">
                    <input type="checkbox" class="w-4 h-4 m-1 rounded-sm appearance-none bg-zinc-900 checked:bg-amber-700 focus:ring-amber-700">
                    <span class="text-zinc-300">full profile</span>
                  </div>
                  <button class="p-1 mt-2 rounded-lg bg-zinc-900 hover:bg-zinc-600" v-on:click="export_id_clicked()">export</button>
                </div>
                <div class="flex flex-col w-full justify-center rounded-lg p-4 backdrop-blur-2xl bg-zinc-800">
                  <h2>Delete this UserID</h2>
                  <button class="p-1 mt-2 rounded-lg bg-red-900 hover:bg-red-500" v-on:click="delete_are_you_sure_open=true">delete id</button>
                </div>
              </div>
              <!-- PUBLISH (you sure?) -->
                <AreYouSure 
                  message="Do you really want to publish the name resolution?"
                  v-model:is_open="publish_are_you_sure_open"
                  v-model:is_sure="publish_is_sure"
                ></AreYouSure>
              <!-- DELETE (you sure?) -->
                <AreYouSure 
                  message="Do you really want to delete this UserID? You will loose your access keys together with all conversations!"
                  :confirm_text="current_identity.name"
                  v-model:is_open="delete_are_you_sure_open"
                  v-model:is_sure="delete_is_sure"
                ></AreYouSure>
              <!-- Dialog windows -->
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  
</div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import AreYouSure from './AreYouSure.vue';
import { publish_name_resolution } from '../../logic/api/name-resolve-api';
import { current_identity, state } from '../../state';
import { export_identity_pub } from '../../logic/crypto/id';
import { db } from '../../logic/connectors/local-db';
import { passwd_decrypt, passwd_encrypt } from '../../logic/crypto/passwd-encrypt';
import type { ExportedPasswdEncryptedData } from '../../schema/export/passwd-encrypt';
import type { ExportedOwnedIdentity } from '../../schema/export/id';
import { router } from '../../main';

const props = defineProps<{
  is_open: boolean
}>();
const emit = defineEmits<{
  (e: 'update:is_open', value: boolean): void
}>();

function toggleOpen() {
  emit('update:is_open', !props.is_open);
}

const publish_are_you_sure_open = ref(false);
const publish_is_sure = ref(false);

const delete_are_you_sure_open = ref(false);
const delete_is_sure = ref(false);


const name_resolution_address = ref('');
const name_publish_running = ref(false);
const address_already_taken = ref(false);


const new_username = ref('');
const old_password = ref('');
const new_password = ref('');
const new_password_2 = ref('');


function publish_name_clicked(){
  publish_are_you_sure_open.value = true;

}
watch(publish_are_you_sure_open, async (val, old_val) => {
  if(val == false && old_val == true){
    if(publish_is_sure){
      if(state.userId?.pub_id == undefined){
        publish_is_sure.value = false;
        return
      }
      name_publish_running.value = true;

      let [name, server] = name_resolution_address.value.split('&');
      
      // add protocol specifier to the server (if does not have already)
      server = (server.includes('http://') || server.includes('https://'))? server : 'https://' + server
      
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

async function apply_username_change(){
  await db.identities.update(current_identity.db_id!, {label: new_username.value})
  current_identity.name = new_username.value;
}

async function apply_passwd_change(){
  if(new_password.value != new_password_2.value) return; // bad
  try{
    const loaded_curr_id = (await db.identities.toArray()).find((entry)=> entry.id==current_identity.db_id! );
    if(!loaded_curr_id) return;
    
    const priv_keys = await passwd_decrypt(loaded_curr_id.identity.priv_keys as ExportedPasswdEncryptedData, old_password.value);

    const newly_encrypted_identity :ExportedOwnedIdentity = {
      priv_keys: await passwd_encrypt(priv_keys, new_password.value),
      pub_keys: loaded_curr_id.identity.pub_keys
    }

    await db.identities.update(current_identity.db_id!, {identity: newly_encrypted_identity});
  }
  catch(e){
    console.log("passwd change failed", e);
  }
}


watch(delete_are_you_sure_open, async (val, old_val) => {
  if(val == false && old_val == true){
    if(delete_is_sure.value){
      // no going back now
      db.identities.delete(current_identity.db_id!);
      db.user_data.delete(current_identity.db_id!);

      router.push('/select-id')
    }
  }
})

function export_id_clicked(){

}

</script>