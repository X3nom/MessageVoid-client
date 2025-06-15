<template>

<div class="w-full h-full flex flex-col bg-zinc-900">
    <div class="bg-zinc-800">
        <RouterLink to="/home">
            <div class="fa fa-arrow-left ml-1 p-1 pr-2 pl-2 rounded-lg hover:bg-zinc-600" 
                style="font-size: x-large;">
            </div>
        </RouterLink>
    </div>
</div>


</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { router } from '../../main';



</script>