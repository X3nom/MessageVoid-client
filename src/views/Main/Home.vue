<template>

<div class="flex overflow-hidden bg-zinc-900 w-full h-full">
    <MainSideBar></MainSideBar>

    <RouterView></RouterView>
</div>

</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import MainSideBar from '../../components/MainSideBar.vue';
import { RouterView } from 'vue-router';
// import axios from 'axios';
import { get_and_save_messages } from '../../logic/api/message-api';
import { reactive_state, state } from '../../state';
import { export_identity_pub } from '../../logic/crypto/id';



// polling new messages here
/*======
const message_fetch_interval = setInterval(async ()=>{
    get_and_save_messages()
}, 1000)
onUnmounted(() => {clearInterval(message_fetch_interval)});
======*/


// SSE (little bit more efficient than polling)

// /*======
onMounted(async () => {
    get_and_save_messages(); // initial get messages
    if(state.sse_running) return;
    state.sse_running = true;

    const sse = new EventSource(`${reactive_state.server}/message-notify?recipient=${btoa(JSON.stringify(await export_identity_pub(state.userId!.pub_id)))}`);

    sse.onmessage = (event) => {
        console.log('sse event', event);
        if (event.data === 'new') {
            get_and_save_messages();
        }
    };

    onBeforeUnmount(() => {
        sse.close();
        state.sse_running = false;
    });
});
// ======*/


</script>