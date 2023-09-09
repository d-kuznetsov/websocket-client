<script setup>
import { ref, computed } from 'vue'
import WebSocketService from './services/ws.js'
import Board from './components/Board.vue'
import Spinner from './components/Spinner.vue'

const STATE_WAITING = 'waiting'
const STATE_PLAYING = 'playing'
const STATE_GAME_OVER = 'game-over'
const STATE_ERROR = 'error'

const ws = new WebSocketService()

const appState = ref(STATE_WAITING)
const board = ref(null)
const activePlayerSymbol = ref('')
const myPlayerSymbol = ref('')
const result = ref('')
const joke = ref('')

const isWon = computed(() => result.value == 'win')
const isLoss = computed(() => result.value == 'lose')
const isWaiting = computed(() => appState.value == STATE_WAITING)
const isPlaying = computed(() => appState.value == STATE_PLAYING)
const isGameOver = computed(() => appState.value == STATE_GAME_OVER)
const isError = computed(() => appState.value == STATE_ERROR)
const isPlayerActive = computed(() => activePlayerSymbol.value === myPlayerSymbol.value)

ws.addMessageHandler('wait', function handleWaiting() {
  appState.value = STATE_WAITING
})

ws.addMessageHandler('start', function handlePlaying(data) {
  board.value = data.board
  myPlayerSymbol.value = data.symbol
  activePlayerSymbol.value = data.activePlayerSymbol
  appState.value = STATE_PLAYING
})

ws.addMessageHandler('update', function handleUpdate(data) {
  board.value = data.board
  activePlayerSymbol.value = data.activePlayerSymbol
})

ws.addMessageHandler('finish', function handleGameOver(data) {
  console.log(data)
  board.value = data.board
  result.value = data.result
  joke.value = data.joke
  activePlayerSymbol.value = ''
  appState.value = STATE_GAME_OVER
  ws.close()
})

ws.addErrorHandler(function handleError() {
  appState.value = STATE_ERROR
  ws.close()
})

function handleMove(data) {
  ws.sendMessage({
    type: 'move',
    data
  })
}

function reload() {
  location.reload()
}

ws.connect()
</script>

<template>
  <div class="App">
    <header class="App-header">
      <div v-if="isWaiting" class="App-note">Waiting for an opponent . . .</div>

      <div v-else-if="isPlaying" class="App-note">
        <div>You are playing with {{ myPlayerSymbol }}.</div>
        <div>
          {{ isPlayerActive ? 'Your turn' : "Wait for your opponent's move." }}
        </div>
      </div>

      <div
        v-else-if="isGameOver"
        class="App-note"
        :class="{
          'App-note__won': isWon,
          'App-note__lose': isLoss
        }"
      >
        {{ isWon ? 'You won' : isLoss ? 'You lose' : 'Draw' }}
      </div>

      <div v-else-if="isError" class="App-note App-note__error">Something went wrong.</div>
    </header>

    <main class="App-main">
      <div v-if="isWaiting" class="App-waiting">
        <Spinner />
      </div>

      <div v-else-if="isPlaying" class="App-playing">
        <Board
          :board="board"
          :myPlayerSymbol="myPlayerSymbol"
          :activePlayerSymbol="activePlayerSymbol"
          @move="handleMove"
        />
      </div>

      <div v-else-if="isGameOver" class="App-gameOver">
        <div v-if="joke">Your prize is a joke from Chuck Norris.</div>
        <div v-if="joke">{{ joke }}</div>
        <button class="App-reload" @click="reload">Try again</button>
      </div>

      <div v-else-if="isError" class="App-error">
        <button class="App-reload" @click="reload">Try again</button>
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
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-note {
    font-size: 30px;
    font-weight: 700;
    text-align: center;

    &__won {
      color: var(--color-success);
    }

    &__lose {
      color: var(--color-danger);
    }

    &__error {
      color: var(--color-danger);
    }
  }

  &-main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-gameOver {
    display: flex;
    height: calc(100vh - 100px);
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    div {
      text-align: center;
    }
  }

  &-reload {
    height: 100px;
    width: 200px;
    border-radius: 8px;
    font-size: 30px;
    cursor: pointer;
    background-color: var(--color-grey);
    color: var(--color-slate);
    border-color: var(--color-grey);
  }
}
</style>
