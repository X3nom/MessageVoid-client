<template>
    <div class="w-full m-1 rounded-lg bg-zinc-800">
        <div class="p-1 m rounded-lg bg-zinc-700">
            <h1 class="text-l">Newest messages</h1>
        </div>

        <div class="flex flex-col">
            <div v-for="message in messages">
                <span>{{ message }}</span>
            </div>
        </div>

  </div>
</template>
<script setup lang="ts">
import { get_messages } from '../logic/api/message-api';
import { export_identity_pub } from '../logic/crypto/id';
import { current_identity, current_server } from '../state';


const messages = await get_messages(current_server.server, 
    await export_identity_pub(current_identity.id!.pub_id)
);

</script>