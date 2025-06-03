<template>
    <div class="w-full h-fit pr-4 pl-4 flex justify-between items-center bg-zinc-950/40 backdrop-blur-sm">

        <div class="p-3 pt-1 pb-1 rounded-lg bg-zinc-800">
            <span>{{current_server.server}}</span>
        </div>

        <!-- <div class="rounded-lg h-fit w-fit">
            <input v-model="prompt" 
            v-on:keydown="handleKey"
            v-on:keyup="manage_suggestions()"
                class="w-[50svw] h-8 rounded-lg pl-2 pr-2 focus:outline-none  bg-zinc-800"
                placeholder="start typing . . ."
            >
            <div v-if="suggestions_open"
                class="absolute w-[70svw] left-[15svw] h-fit h-min-10 h-max-[80svh] rounded-lg flex flex-col border-2 border-zinc-600 bg-zinc-900">
                <span v-for="suggestion in suggestions"
                class="p-1 pl-2 w-full rounded-lg hover:bg-zinc-700">
                    {{ suggestion }}
                </span>
            </div>
        </div> -->

        <div class="flex items-center w-fit rounded-lg p-1 bg-zinc-800 hover:bg-zinc-700">
            <div v-html="current_identity.identicon" class="mr-2 bg-zinc-800 rounded-lg border border-zinc-600"></div>
            <span class="mr-4">{{ current_identity.name }}</span>
        </div>
        
    </div>
</template>

<script setup lang='ts'>
import MessageVoidLogo from './MessageVoidLogo.vue';
import { is_blank } from '../logic/utilities/string';
import { current_identity, current_server } from '../state';
import { ref } from 'vue';
import { ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/vue';


const prompt = ref('');
const suggestions_open = ref(false);
const selection_index = ref(-1);
const suggestions = ref(["hello world", "meow", "nya"]);

function handleKey(event: KeyboardEvent) {
    const key = event.key;
    if (key == 'ArrowUp') {
        selection_index.value--;
    }
    if (key == 'ArrowDown'){
        selection_index.value++;
    }
    else return;

    event.preventDefault()
}


function manage_suggestions(){
    if(is_blank(prompt.value)){
        suggestions_open.value = false;
        return 
    }
    suggestions_open.value = true;

}


</script>