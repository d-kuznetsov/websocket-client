<script setup>
import { provide, ref } from 'vue'
import WebSocketService from './services/ws.js'
import Board from './components/Board.vue'
import Waiting from './components/Waiting.vue'

const wsService = new WebSocketService()
provide('ws', wsService)

const appState = ref('waiting')
const board = ref(null)
const currentPlayer = ref(null)
const me = ref(null)

function handleWaiting({ type }) {
  if (type === 'waiting') {
    appState.value = 'waiting'
  }
}

function handlePlaying({ type, data }) {
  if (type === 'playing') {
    board.value = data.board
    currentPlayer.value = data.currentPlayer
    me.value = data.symbol
    appState.value = 'playing'
  }
}

function handleUpdate({ type, data }) {
  if (type === 'update') {
    board.value = data.board
    currentPlayer.value = data.currentPlayer
    // me.value = data.symbol
    // appState.value = 'playing'
  }
}

function handleMove(data) {
  wsService.sendMessage({
    type: 'move',
    data
  })
}

wsService.subscribe(handleWaiting, handlePlaying, handleUpdate)

wsService.connect()
</script>

<template>
  <div class="App">
    <header class="App-header"></header>
    <main class="App-main">
      <Board
        v-if="appState === 'playing'"
        :board="board"
        :me="me"
        :currentPlayer="currentPlayer"
        @move="handleMove"
      />
      <Waiting v-else />
    </main>
  </div>
</template>

<style>
.App {
  display: flex;
  flex-direction: column;
  background-color: #eee;
  min-height: 100vh;
  max-width: 640px;
  margin: 0 auto;
}
</style>
