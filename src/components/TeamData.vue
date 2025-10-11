<script setup lang="ts" async>
import { computed, nextTick, ref, watch } from 'vue'
import { useAppStore } from '@/stores/AppStore.ts'

const props = withDefaults(defineProps<{
  teamNumber: 1 | 2
  isGameplay?: boolean
}>(), {
  isGameplay: true
})

const store = useAppStore()

const isEditing = ref<boolean>(false)
const inputRef = ref<HTMLInputElement>()

const thisTeam = computed(() => {
  return props.teamNumber === 1 ? store.team1 : store.team2
})

watch(isEditing, (newVal, oldVal) => {
  if (!oldVal && newVal) {
    nextTick(() => {
      inputRef.value?.focus()
      inputRef.value?.select()
    })
  }
})

</script>

<template>
  <div
    class="card p-8 py-4 shadow something"
    :class="'bg-' + thisTeam.color + '-100'"
  >
    <label
      v-if="!isGameplay || isEditing"
      class="flex items-center gap-x-4"
    >
      Team {{ thisTeam.number }} Name:
      <input
        class="input flex-grow"
        v-model="thisTeam.name"
        :placeholder="thisTeam.number === 1 ? 'Purple Parrots' : 'Green Eagles'"
        @blur="isEditing = false"
        @keyup.enter="isEditing = false"
        ref="inputRef"
      />
    </label>
    <div
      v-else
      class="p-2 transition-all bg-transparent border border-transparent hover:border-gray-500 hover:bg-white cursor-pointer"
      @click="isEditing = true"
    >
     <div class="flex justify-between items-center">
       <div class="text-gray-500 text-sm">Team {{ thisTeam.number }}:</div>
     </div>

      <div class="text-lg">{{ thisTeam.name }}</div>
    </div>

    <div v-if="isGameplay">
      <div class="stats">
        <div class="stat">
          <div class="stat-title">Score</div>
          <div class="stat-value">{{ thisTeam.score }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
