<script setup>
import { inject, ref } from 'vue'

const ws = inject('ws')
const messages = ref([])

function addMessage(message) {
  messages.value.push(message)
}
ws.addMessageListener(addMessage)

function sendMessage() {
  ws.sendMessage('Hi from client')
}
</script>

<template>
  <div>
    {{ messages }}
  </div>
  <button @click="sendMessage">Hi</button>
</template>
