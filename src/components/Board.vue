<script setup>
import { inject, ref, onUnmounted } from 'vue'

const ws = inject('ws')
const messages = ref([])

function addMessage(message) {
  messages.value.push(message)
}
ws.subscribe(addMessage)

function sendMessage() {
  ws.sendMessage('Hi from client')
}

onUnmounted(() => {
  ws.unsubscribe(addMessage)
})
</script>

<template>
  <div>
    {{ messages }}
  </div>
  <button @click="sendMessage">Hi</button>
</template>
