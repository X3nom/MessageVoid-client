<template>
    <!-- Background -->
    <div class="w-full h-screen flex flex-col bg-zinc-900">
        <MainBar></MainBar>
        
        <RouterView/>
    </div>
</template>


<script setup lang='ts'>
import MainBar from '../components/MainBar.vue';
import { current_identity } from '../state.ts';
import { router } from '../main.ts';
import { RouterView } from 'vue-router';

// If no identity selected, force the user out
if(current_identity.userId == undefined){
    router.replace('/select-id');
}
else{
    // Set identicon of current user as favicon :3
    const encoded = encodeURIComponent(current_identity.identicon!)
    const dataUrl = `data:image/svg+xml,${encoded}`;
    document.getElementById('favicon')?.setAttribute("href", dataUrl);
}


</script>