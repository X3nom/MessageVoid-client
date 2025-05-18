<template>
    <div v-if="currentMenu == 'select-id'" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <!-- Close Button -->
            <button @click="close"
                class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white">
                ✖
            </button>

            <h2 class="text-xl font-semibold mb-4 text-center">Select your identity</h2>

            
            <div class="card flex justify-center w-full h-fit mb-4 bg-gray-700 rounded-lg hover:bg-gray-600">
            <Select v-model="selectedID" :options="all_ID_list" optionLabel="label" placeholder="Select ID" 
                class="w-full p-2"
                :pt="{
                    listContainer: {
                        class: 'bg-gray-800 rounded-lg shadow-lg border border-gray-600'
                }}">
                <template #value="value">
                    <div v-if="value.value" class="w-full h-full flex rounded-lg p-1 items-center">
                        <div v-html="value.value.identicon"></div>
                        <span class="pl-2">{{ value.value.label }}</span>
                    </div>
                    <span v-else class="text-l pl-2">{{ value.placeholder }}</span>
                </template>
                <template #option="option">
                    <div :class="['w-full flex h-auto rounded-lg p-1 hover:bg-gray-700 items-center', (option.selected) ? 'bg-gray-700' : '']">
                        <div v-html="option.option.identicon"></div>
                        <span class="pl-2">{{option.option.label}}</span>
                    </div>
                </template>
            </Select>
            </div>


            <!-- Input for passphrase -->
            <input v-model="passphrase" type="password" placeholder="Enter passphrase"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />


            <!-- Buttons -->
            <div class="mt-6 flex justify-end gap-2">
                <button @click="generate_new_id()" class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">
                    Generate new ID
                </button>
                <button @click="use_id()"
                    :class="[
                        'px-4 py-2 rounded-lg',
                        (selectedID == undefined) ? 'bg-gray-600 text-gray-400' : 'bg-gray-700 hover:bg-gray-600',
                    ]">
                    Use this ID
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { currentMenu, SelectedIdentity, setMenu } from '../state.ts';
import { import_identity } from '../logic/crypto.ts';
import { IdentitiesDB } from '../logic/local-data.ts';
import { toSvg } from 'jdenticon';

import Select from 'primevue/select';
import { type ExportedIdentity } from '../logic/crypto';


const selectedID = ref();
const all_ID_list = ref();
const passphrase = ref('');


function generate_new_id(){
    setMenu('generate-id');
}

async function use_id(){
    if(selectedID.value == undefined) return;
    
    /* all the needed data is in memory but you still need to `getItem` again because
       selectedID.value.identity is a fucking ref and there's no fucking way around it */
    const identityEntry = await IdentitiesDB.getItem(selectedID.value.id);
    console.log(identityEntry);

    const imported_id = await import_identity(identityEntry.identity, passphrase.value);
    console.log("meow");

    // SelectedIdentity.curent_user_name.value = all_ID_list.value[ix].label;
    SelectedIdentity.current_user_id.value = imported_id;

    console.log(imported_id);
    // SelectedIdentity.current_user_identicon.value = all_ID_list.value[ix].identicon;
}




async function load_ids_from_indexedDB(){
    let all_ids :IdentitiesDB.Entry[] | any[] = await IdentitiesDB.listAllItems();
    console.log(all_ids);

    for(let i=0; i<all_ids.length; i++){
        all_ids[i].identicon = toSvg(JSON.stringify(all_ids[i].identity.pub_keys), 40);
    }
    all_ID_list.value = all_ids;
}
load_ids_from_indexedDB();
watch(currentMenu, load_ids_from_indexedDB); // when jumping to current menu, load the ids again


function close() {
    setMenu('home');
}

</script>