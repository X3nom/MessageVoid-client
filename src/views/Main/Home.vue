<template>

<div class="flex bg-zinc-900 w-full h-full">
    <MainSideBar></MainSideBar>

    <RouterView></RouterView>
</div>

</template>
<script setup lang="ts">
import MainSideBar from '../../components/MainSideBar.vue';
import { RouterView } from 'vue-router';

</script>