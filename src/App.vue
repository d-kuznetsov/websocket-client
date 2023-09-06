<script setup>
import { provide } from 'vue'
import WebSocketService from './services/ws.js'
import Board from './components/Board.vue'

const wsService = new WebSocketService()
wsService.connect()
provide('ws', wsService)
</script>

<template>
  <main>
    <Board />
  </main>
</template>
