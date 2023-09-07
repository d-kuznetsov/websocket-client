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

const RESULT_WIN = 'win'
const RESULT_LOSE = 'lose'
const RESULT_DRAW = 'draw'

const appState = ref(STATE_WAITING)
const board = ref(null)
const activePlayerSymbol = ref('')
const myPlayerSymbol = ref('')
const result = ref('')

ws.addMessageHandler(MSG_WAIT, function handleWaiting() {
  appState.value = STATE_WAITING
})

ws.addMessageHandler(MSG_START, function handlePlaying(data) {
  board.value = data.board
  activePlayerSymbol.value = data.activePlayer
  myPlayerSymbol.value = data.symbol
  appState.value = STATE_PLAYING
})

ws.addMessageHandler(MSG_UPDATE, function handleUpdate(data) {
  board.value = data.board
  activePlayerSymbol.value = data.activePlayer
})

ws.addMessageHandler(MSG_FINISH, function handleGameOver(data) {
  board.value = data.board
  result.value = data.result
  activePlayerSymbol.value = ''
  appState.value = STATE_GAME_OVER
})

ws.addErrorHandler(function handleError() {
  appState.value = STATE_ERROR
})

function handleMove(data) {
  ws.sendMessage({
    type: MSG_MOVE,
    data
  })
}

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
        <Board
          :board="board"
          :myPlayerSymbol="myPlayerSymbol"
          :activePlayerSymbol="activePlayerSymbol"
          @move="handleMove"
        />
      </div>
    </main>
  </div>
</template>

<style>
.App {
  display: flex;
  flex-direction: column;
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
