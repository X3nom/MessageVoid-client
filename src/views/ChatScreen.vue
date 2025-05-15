<template>
    <main class="chat-main">
        <div class="chat-header">
            <h2>Chat with: {{ selectedUser?.name || '...' }}</h2>
        </div>

        <div class="chat-messages">
            <div v-for="(msg, index) in messages" :key="index" class="chat-message">
            <b>{{ msg.sender }}:</b> {{ msg.text }}
            </div>
        </div>

        <div class="chat-input">
            <input
                v-model="newMessage"
                placeholder="message"
                @keyup.enter="sendMessage"
            />
            <button @click="sendMessage">Send</button>
        </div>
    </main>
</template>

<script setup>
import { generate_new_identity } from '../logic/crypto.ts'


function sendMessage(){

}


const tst = await generate_new_identity();
window.crypto.subtle.exportKey("pkcs8", tst.encryption_key.publicKey).then((key) => {})

</script>

<style>



</style>