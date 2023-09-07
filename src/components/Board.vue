<script setup>
import { computed } from 'vue'

const props = defineProps({
  board: Object,
  me: String,
  currentPlayer: String
})

const emit = defineEmits(['move'])

const isActive = computed(() => props.me === props.currentPlayer)

function handleMove(row, col) {
  if (isActive.value) {
    emit('move', {
      row,
      col
    })
  }
}
</script>

<template>
  <div class="Game">
    <div class="Game-board">
      <div class="Game-row" v-for="(row, rowIdx) in board" :key="rowIdx">
        <div
          class="Game-col"
          v-for="(col, colIdx) in row"
          :key="colIdx"
          :class="{ 'Game-col__isActive': isActive }"
          @click="handleMove(rowIdx, colIdx)"
        >
          {{ board[rowIdx][colIdx] }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.Game {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  &-board {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    width: 300px;
    height: 300px;
  }

  &-row {
    display: flex;
    justify-content: stretch;
  }

  &-col {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid;

    &__isActive {
      cursor: pointer;
    }
  }
}
</style>
