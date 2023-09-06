<script setup>
import { provide, ref } from 'vue'
import WebSocketService from './services/ws.js'
import Board from './components/Board.vue'
import Waiting from './components/Waiting.vue'

const wsService = new WebSocketService()
provide('ws', wsService)

const APP_STATE = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  ERROR: 'error'
}

const appState = ref(APP_STATE.WAITING)

const handleStateChange = ({ type }) => {
  if (type === APP_STATE.WAITING) {
    appState.value = APP_STATE.WAITING
  } else if (type === APP_STATE.PLAYING) {
    appState.value = APP_STATE.PLAYING
  }
}

wsService.subscribe(handleStateChange)

wsService.connect()
</script>

<template>
  <div class="App">
    <header class="App-header"></header>
    <main class="App-main">
      <Board v-if="appState === 'playing'" />
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
