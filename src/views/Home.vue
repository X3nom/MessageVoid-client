<template>
    <!-- Background -->
    <div class="w-full h-screen flex flex-col bg-zinc-900">
        <MainBar></MainBar>
        
        <main class="w-full h-full overflow-y-hidden flex">
            <MainSideBar></MainSideBar>
            
            <RouterView/>
        </main>

    </div>
</template>


<script setup lang='ts'>
import MainBar from '../components/MainBar.vue';
import MainSideBar from '../components/MainSideBar.vue';
import NewestMessagesPanel from '../components/NewestMessagesPanel.vue'

import { current_identity } from '../state.ts';
import { router } from '../main.ts';
import { RouterView } from 'vue-router';

// If no identity selected, force the user out
if(current_identity.id == undefined){
    router.replace('/select-id');
}
else{
    // Set identicon of current user as favicon :3
    const encoded = encodeURIComponent(current_identity.identicon!)
    const dataUrl = `data:image/svg+xml,${encoded}`;
    document.getElementById('favicon')?.setAttribute("href", dataUrl);
}


</script>