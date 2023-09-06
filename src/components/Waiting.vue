<script setup>
import Spinner from './Spinner.vue'
</script>

<template>
  <div class="Waiting">
    <Spinner class="Waiting-spinner" />
  </div>
</template>

<style>
.Waiting {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
