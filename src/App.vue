<script setup>
import { ref } from 'vue'
import WebSocketService from './services/ws.js'
import Board from './components/Board.vue'
import Spinner from './components/Spinner.vue'

const ws = new WebSocketService()

const STATE_WAITING = 'waiting'
const STATE_PLAYING = 'playing'
const STATE_GAME_OVER = 'game-over'
const STATE_ERROR = 'error'

const MSG_WAIT = 'waiting'
const MSG_START = 'playing'
const MSG_UPDATE = 'update'
const MSG_MOVE = 'move'
const MSG_FINISH = 'game-over'

const appState = ref(STATE_WAITING)
const board = ref(null)
const activePlayer = ref(null)
const self = ref(null)
const result = ref(null)

function handleWaiting({ type }) {
  if (type === MSG_WAIT) {
    appState.value = STATE_WAITING
  }
}

function handlePlaying({ type, data }) {
  if (type === MSG_START) {
    board.value = data.board
    activePlayer.value = data.activePlayer
    self.value = data.symbol
    appState.value = STATE_PLAYING
  }
}

function handleUpdate({ type, data }) {
  if (type === MSG_UPDATE) {
    board.value = data.board
    activePlayer.value = data.activePlayer
  }
}

function handleMove(data) {
  ws.sendMessage({
    type: MSG_MOVE,
    data
  })
}

function handleGameOver({ type, data }) {
  if (type === MSG_FINISH) {
    board.value = data.board
    result.value = data.result
    activePlayer.value = null
    appState.value = STATE_GAME_OVER
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
      <div v-if="appState === STATE_WAITING" class="App-waiting">
        <Spinner />
      </div>
      <div v-else-if="appState === STATE_ERROR" class="App-error">
        <div>Error</div>
        <button>Try Again</button>
      </div>
      <div v-else class="App-playing">
        <Board :board="board" :self="self" :activePlayer="activePlayer" @move="handleMove" />
      </div>
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

  &-header {
    flex: 0;
  }

  &-main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
