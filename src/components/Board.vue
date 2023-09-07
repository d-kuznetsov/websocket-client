<script setup>
import { computed } from 'vue'
import X from './icons/X.vue'
import O from './icons/O.vue'

const props = defineProps({
  board: Object,
  myPlayerSymbol: String,
  activePlayerSymbol: String
})

const emit = defineEmits(['move'])

const isActive = computed(() => props.myPlayerSymbol === props.activePlayerSymbol)

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
        v-for="(_, colIdx) in row"
        :key="colIdx"
        :class="{ 'Board-col__isActive': isActive && !board[rowIdx][colIdx] }"
        @click="handleMove(rowIdx, colIdx)"
      >
        <X v-if="board[rowIdx][colIdx] == 'X'" class="Board-X" />
        <O v-else-if="board[rowIdx][colIdx] == 'O'" class="Board-O" />
      </div>
    </div>
  </div>
</template>

<style>
.Board {
  display: flex;
  flex-direction: column;
  justify-content: stretch;

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
    border: 2px dashed var(--color-grey);

    @media (min-width: 480px) {
      & {
        width: 160px;
        height: 160px;
      }
    }

    &__isActive {
      cursor: pointer;
    }
  }

  &-X {
    path {
      stroke: var(--color-primary);
    }
  }

  &-O {
    path {
      stroke: var(--color-secondary);
    }
  }
}
</style>
