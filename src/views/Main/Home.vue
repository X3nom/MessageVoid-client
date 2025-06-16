<template>

<div class="flex overflow-hidden bg-zinc-900 w-full h-full">
    <MainSideBar></MainSideBar>

    <RouterView></RouterView>
</div>

</template>
<script setup lang="ts">
import { onUnmounted } from 'vue';
import MainSideBar from '../../components/MainSideBar.vue';
import { RouterView } from 'vue-router';
import { get_messages } from '../../logic/api/message-api';
import { current_identity, reactive_state, state } from '../../state';
import { export_identity_pub } from '../../logic/crypto/id';
import { unwrap_message } from '../../logic/crypto/message';
import { update_user_data } from '../../logic/connectors/local-db';



// fetching new messages here
const message_fetch_interval = setInterval(async ()=>{
    
    // very fucking efficient code (export RSA keys every 1000ms) :)
    const messages = await get_messages(reactive_state.server, await export_identity_pub(state.userId!.pub_id));
    if(messages == null) return;

    for(const message of messages){

        const decrypted_msg = await unwrap_message(message);

        // find the corresponding chat
        let chat_index = current_identity.user_data!.chats.findIndex((chat) => 
            JSON.stringify(chat.userId) == JSON.stringify(decrypted_msg.sender)
        );

        if(chat_index == -1){
            // chat does not exist yet, append
            current_identity.user_data!.chats.push({
                username: `new unknown sender`,
                userId: decrypted_msg.sender,
                messages: []
            })

            chat_index = current_identity.user_data!.chats.length -1; // update teh index
        }

        // check if same message does not exist
        const collisions = current_identity.user_data!.chats[chat_index].messages.findIndex((msg) => 
            msg.send_time == decrypted_msg.send_time && msg.text == decrypted_msg.message
        )

        if(collisions == -1){
            // no collision, append the message
            current_identity.user_data!.chats[chat_index].messages.push({
                own: false,
                send_time: decrypted_msg.send_time,
                text: decrypted_msg.message
            })
        }
    }
    update_user_data(current_identity.db_id!, current_identity.user_data!, state.userId!);

}, 1000)

onUnmounted(() => {clearInterval(message_fetch_interval)});


</script>