<script setup>
import { ref } from 'vue'
import WebSocketService from './services/ws.js'
import Board from './components/Board.vue'
import Waiting from './components/Waiting.vue'

const ws = new WebSocketService()

const STATE_WAITING = 'waiting'
const STATE_PLAYING = 'playing'
const STATE_GAME_OVER = 'game-over'
const STATE_ERROR = 'error'

const appState = ref(STATE_WAITING)
const board = ref(null)
const activePlayer = ref(null)
const self = ref(null)
const result = ref(null)

function handleWaiting({ type }) {
  if (type === 'waiting') {
    appState.value = STATE_WAITING
  }
}

function handlePlaying({ type, data }) {
  if (type === 'playing') {
    board.value = data.board
    activePlayer.value = data.activePlayer
    self.value = data.symbol
    appState.value = STATE_PLAYING
  }
}

function handleUpdate({ type, data }) {
  if (type === 'update') {
    board.value = data.board
    activePlayer.value = data.activePlayer
  }
}

function handleMove(data) {
  ws.sendMessage({
    type: 'move',
    data
  })
}

function handleGameOver({ type, data }) {
  if (type === 'gameOver') {
    board.value = data.board
    appState.value = STATE_GAME_OVER
    result.value = data.result
    activePlayer.value = null
  }
}

function handleError() {
  appState.value = STATE_ERROR
}

ws.addMessageHandlers(handleWaiting, handlePlaying, handleUpdate, handleGameOver)
ws.addCloseHandler(handleError)
ws.addErrorHandler(handleError)

ws.connect()
</script>

<template>
  <div class="App">
    <header class="App-header"></header>
    <div>{{ result }}</div>
    <button>Try Again</button>
    <main class="App-main">
      <Waiting v-if="appState === STATE_WAITING" />
      <Board v-else :board="board" :me="self" :activePlayer="activePlayer" @move="handleMove" />
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
