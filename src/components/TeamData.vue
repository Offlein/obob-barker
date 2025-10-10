<script setup lang="ts" async>
defineProps<{
  modelValue: string
  color: string
  score: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleInput = (e: Event) => {
  emit('update:modelValue', e.target.value)
}

</script>

<template>
  <div
    class="card p-8 pb-4 shadow"
    :class="'bg-' + color + '-100'"
  >
    <label>
      Team 1 Name:
      <input
        class="input"
        :value="modelValue"
        @change="handleInput"
      />
    </label>

    <div class="stats">
      <div class="stat">
        <div class="stat-title">Score</div>
        <div class="stat-value">{{ score }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
