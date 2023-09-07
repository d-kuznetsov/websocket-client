<script setup>
import { computed } from 'vue'

const props = defineProps({
  board: Object,
  self: String,
  activePlayer: String
})

const emit = defineEmits(['move'])

const isActive = computed(() => props.self === props.activePlayer)

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
  <div class="Board">
    <div class="Board-row" v-for="(row, rowIdx) in board" :key="rowIdx">
      <div
        class="Board-col"
        v-for="(col, colIdx) in row"
        :key="colIdx"
        :class="{ 'Board-col__isActive': isActive }"
        @click="handleMove(rowIdx, colIdx)"
      >
        {{ board[rowIdx][colIdx] }}
      </div>
    </div>
  </div>
</template>

<style>
.Board {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  width: 300px;
  height: 300px;

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
