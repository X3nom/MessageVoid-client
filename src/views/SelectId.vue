<template>
    <div class="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-zinc-800 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <!-- Close Button -->
            <button @click="router.push('/')"
                class="absolute top-2 right-2 text-zinc-500 hover:text-white">
                ✖
            </button>

            <h2 class="text-xl font-semibold mb-4 text-center">Select your identity</h2>

            
            <div class="card flex justify-center w-full h-fit mb-4 bg-zinc-700 rounded-lg hover:bg-zinc-600">
            <!-- This <Select> stuff took a little bit too long -->
            <Select v-model="selectedID" :options="all_ID_list" optionLabel="label" placeholder="Select ID" 
                class="w-full p-2"
                :pt="{
                    listContainer: {
                        class: 'bg-zinc-800 rounded-lg shadow-lg border border-zinc-600'
                }}">
                <template #value="value">
                    <div v-if="value.value" class="w-full h-full flex rounded-lg p-1 items-center">
                        <div v-html="value.value.identicon" class="bg-zinc-800 rounded-lg border border-zinc-600"></div>
                        <span class="pl-2">{{ value.value.label }}</span>
                    </div>
                    <span v-else class="text-l pl-2">{{ value.placeholder }}</span>
                </template>
                <template #option="option">
                    <div :class="['w-full flex h-auto rounded-lg p-1 hover:bg-zinc-700 items-center', (option.selected) ? 'bg-zinc-700' : '']">
                        <div v-html="option.option.identicon" class="bg-zinc-800 rounded-lg border border-zinc-600"></div>
                        <span class="pl-2">{{option.option.label}}</span>
                    </div>
                </template>
            </Select>
            </div>

            <div class="flex flex-col space-y-2">
                <!-- Input for passphrase -->
                <input v-model="passphrase" type="password" placeholder="Enter password"
                    v-on:keydown.enter="use_id()"
                    class="w-full px-4 py-2 border border-zinc-500 rounded-lg focus:outline-none focus:border-zinc-400" />
                
                <span v-if="wrong_password_shown" class="w-full rounded-lg text-center bg-amber-700">invalid password</span>
    
                <!-- Buttons -->
                <div class="flex justify-end gap-2">
                    <RouterLink to="/create-id">
                        <button class="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600">
                            Generate new ID
                        </button>
                    </RouterLink>
                    <button @click="use_id()"
                        :class="[
                            'px-4 py-2 rounded-lg',
                            (selectedID == undefined) ? 'bg-zinc-600 text-zinc-400' : 'bg-zinc-700 hover:bg-zinc-600',
                        ]">
                        Use this ID
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { current_identity, state } from '../state.ts';
import { BadDecryptionError, import_owned_identity } from '../logic/crypto/id.ts';
import { db, load_user_data, update_user_data } from '../logic/connectors/local-db.ts';
import { toSvg } from 'jdenticon';
import Select from 'primevue/select';
import { router } from '../main.ts';



const selectedID = ref();
const all_ID_list = ref();
const passphrase = ref('');

const wrong_password_shown = ref(false);

watch(selectedID, ()=>wrong_password_shown.value=false);


async function use_id(){
    if(selectedID.value == undefined) return;
    localStorage.setItem("last_selected_identity", selectedID.value.id);

    try{
        const imported_id = await import_owned_identity(selectedID.value.identity, passphrase.value);

        current_identity.db_id = selectedID.value.id;
        current_identity.name = selectedID.value.label;
        current_identity.identicon = selectedID.value.identicon;
        state.userId = imported_id;

        let user_data = await load_user_data(current_identity.db_id!, state.userId);
        if(user_data === null){
            user_data = {
                chats: [],
                settings: {}
            }
            update_user_data(current_identity.db_id!, user_data, state.userId);
        }

        current_identity.user_data = user_data;
    
        router.push('/home')
    }
    catch(e){
        if(e == BadDecryptionError){ // Wrong password
            wrong_password_shown.value = true;
        }
    }

}




async function load_ids_from_indexedDB(){
    let all_ids = (await db.identities.toArray()).map(
        (id) => ({
            ...id,
            identicon: toSvg(JSON.stringify(id.identity.pub_keys), 40)
        })
    );

    all_ID_list.value = all_ids;
}
load_ids_from_indexedDB().finally(()=>{
    const last_selected_id = Number(localStorage.getItem('last_selected_identity'));
    for(const ident of all_ID_list.value){
        if(ident.id == last_selected_id) selectedID.value = ident;
    }
});



</script>