<template>
    <div class="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-zinc-800 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <!-- Close Button -->
            <button @click="router.push('/')"
                class="absolute top-2 right-2 text-zinc-500 hover:text-white">
                ✖
            </button>

            <h2 class="text-xl font-semibold mb-4 text-center">Generate New Identity</h2>
            
            <!-- Input for id name -->
            <label class="block mb-2 text-sm font-medium">Username</label>
            <input v-model="username" placeholder="Enter username"
                class="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring focus:border-zinc-600">

            <!-- Input for passphrase -->
            <label class="block mb-2 text-sm font-medium">Passphrase</label>
            <input v-model="passphrase" type="password" placeholder="Enter passphrase"
                class="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring focus:border-zinc-600" />

            <!-- Generating WIP... -->
            <span v-if="generate_running" class="block mt-2 p-1 text-center w-full rounded-lg bg-amber-800">Generating your ID keys...</span>
            
            <!-- Buttons -->
            <div class="mt-6 flex justify-end gap-2">
                <button @click="router.push('/')" 
                    class="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600">
                    Cancel
                </button>

                <button @click="generate()"
                    :class="[ 'px-4 py-2 rounded-lg',
                    !credentials_good() || generate_running ? 'bg-zinc-600 text-zinc-400' : 'bg-amber-600 hover:bg-amber-800' 
                    ]" >
                    Generate
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { router } from '../main';
import { generate_new_identity } from '../logic/crypto/id'
import { db } from '../logic/connectors/local-db';

const passphrase = ref('');
const username = ref('');

const generate_running = ref(false);


function credentials_good() :Boolean{
    return !(username.value == '' || passphrase.value.length < 4)
}

async function generate(){
    if(!credentials_good() || generate_running.value) return;
    generate_running.value = true;

    const encrypted_id = await generate_new_identity(passphrase.value);

    const entry_id = await db.identities.add({label: username.value, identity: encrypted_id});
    await db.user_data.put({
        id: entry_id,
        inner_data: null
    })

    generate_running.value = false;
    
    router.push('/select-id')
}

</script>