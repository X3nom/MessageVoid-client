<template>
    <!-- Background -->
    <div class="w-full h-screen flex flex-col bg-zinc-900">
        <MainBar></MainBar>
        
        <main class="w-full h-full flex">
            <MainSideBar></MainSideBar>

            <NewestMessagesPanel></NewestMessagesPanel>
        </main>

    </div>
</template>


<script setup lang='ts'>
import MainBar from '../components/MainBar.vue';
import MainSideBar from '../components/MainSideBar.vue';
import NewestMessagesPanel from '../components/NewestMessagesPanel.vue'

import { current_identity } from '../state.ts';
import { router } from '../main.ts';

// If no identity selected, force the user out
if(current_identity.id == undefined){
    router.replace('/select-id');
}



</script>