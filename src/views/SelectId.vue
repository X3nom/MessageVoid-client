<template>
    <div v-if="currentMenu == 'select-id'" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <!-- Close Button -->
            <button @click="close"
                class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white">
                ✖
            </button>

            <h2 class="text-xl font-semibold mb-4 text-center">Select your identity</h2>

            <!-- <section></section> -->

            
            

            <!-- Input for passphrase -->
            <input v-model="passphrase" type="password" placeholder="Enter passphrase"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />

            <!-- Buttons -->
            <div class="mt-6 flex justify-end gap-2">
                <button @click="generate_new_id()" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                    Generate new ID
                </button>
                <button @click=""
                    class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                    Use this ID
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { currentMenu, setMenu } from '../state.ts';

const passphrase = ref('');

function generate_new_id(){
    setMenu('generate-id');
}

</script>