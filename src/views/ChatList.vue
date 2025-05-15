<template>
    <aside>
        <h2>Users</h2>
        <ul>
            <li v-for="user in users" :key="user.pubkey" @click="selectUser(user)">
                {{ user.name }}
            </li>
        </ul>
    </aside>
</template>

<script setup>

</script>