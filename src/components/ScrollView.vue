<template>
    <div class="overflow-y-scroll border rounded-lg bg-zinc-800">
        <div v-for="(item, index) in items" :key="item.id || index" class="border-b border-zinc-700 last:border-b-0">
            <slot name="item" :item="item" :index="index">
                <!-- Default fallback content -->
                <div class="p-4 text-white">{{ item }}</div>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    items: any[];
}>();

</script>
