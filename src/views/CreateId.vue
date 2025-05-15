<template>
    <div v-if="currentMenu == 'generate-id'" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <!-- Close Button -->
            <button @click="close"
                class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white">
                ✖
            </button>

            <h2 class="text-xl font-semibold mb-4 text-center">Generate New Identity</h2>
            
            <!-- Input for id name -->
            <label class="block mb-2 text-sm font-medium">Username</label>
            <input v-model="username" placeholder="Enter username"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500">

            <!-- Input for passphrase -->
            <label class="block mb-2 text-sm font-medium">Passphrase</label>
            <input v-model="passphrase" type="password" placeholder="Enter passphrase"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />

            <!-- Buttons -->
            <div class="mt-6 flex justify-end gap-2">
                <button @click="close"
                    class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                    Cancel
                </button>
                <button @click="" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    Generate
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, vModelRadio } from 'vue';
import { currentMenu, setMenu } from '../state.ts';

const passphrase = ref('')

function close() {
    setMenu('home');
}

</script>