<script setup lang="ts" async>
import type { ObobQuestionType } from '@/types/ObobTypes.ts'
import { useAppStore } from '@/stores/AppStore.ts'
import { computed } from 'vue'

const props = defineProps<{
  question: ObobQuestionType
  isSteal: boolean
}>()

const store = useAppStore()

const thisTeamScore = computed(() => {
  if (props.isSteal) {
    return store.stealTeamScore
  } else {
    return store.activeTeamScore
  }
})

const otherTeamScore = computed(() => {
  if (props.isSteal) {
    return store.activeTeamScore
  } else {
    return store.stealTeamScore
  }
})

const assignPoints = (points: number) => {
  if (props.isSteal) {
    store.assignStealTeamPoints(props.question, points)
  } else {
    store.assignActiveTeamPoints(props.question, points)
  }
}

const clearPoints = () => {
  if (props.isSteal) {
    store.clearStealTeamPoints(props.question)
  } else {
    store.clearActiveTeamPoints(props.question)
    store.clearStealTeamPoints(props.question)
  }
}

const thisTeam = computed(() => {
  if (props.isSteal) {
    return store.stealTeam
  } else {
    return store.activeTeam
  }
})
</script>

<template>
  <div
    class="p-4 transition-colors duration-500 rounded-lg"
    :class="{
      'bg-transparent': thisTeamScore?.points === undefined,
      'bg-primary text-primary-content': thisTeamScore?.points === 5,
      'bg-secondary text-secondary-content': thisTeamScore?.points === 3 || thisTeamScore?.points === 2,
      'bg-error text-error-content': thisTeamScore?.points === 0,
    }"
  >
    <div
      v-if="thisTeamScore?.points === undefined"
      class="flex flex-wrap items-center justify-center gap-4"
    >
      <div
        class="btn btn-error py-8 btn-lg gap-y-0 flex w-full md:w-auto flex-col leading-none"
        @click="assignPoints(0)"
      >
        <div class="mb-2">Incorrect</div>
        <div class="text-[0.85rem] text-error-content/50">No points</div>
      </div>
      <div class="hidden md:flex divider divider-horizontal" />

      <div class="flex justify-center gap-4 w-full md:w-auto">
        <div
          v-if="!isSteal || (isSteal && otherTeamScore?.points === 0)"
          class="btn btn-secondary py-8 btn-lg gap-y-0 flex flex-col leading-none"
          @click="assignPoints(3)"
        >
          <div class="mb-2">Partial</div>
          <div class="text-[0.85rem] text-secondary-content/50">+3 Points</div>
        </div>

        <div
          v-if="isSteal && otherTeamScore?.points === 3"
          class="btn btn-secondary py-8 btn-lg gap-y-0 flex flex-col leading-none"
          @click="assignPoints(2)"
        >
          <div class="mb-2">Completion</div>
          <div class="text-[0.85rem] text-secondary-content/50">+2 Points</div>
        </div>

        <div
          v-if="!isSteal || (isSteal && otherTeamScore?.points === 0)"
          class="flex-grow btn btn-primary py-8 btn-lg gap-y-0 flex flex-col leading-none"
          @click="assignPoints(5)"
        >
          <div class="mb-2">Correct!</div>
          <div class="text-[0.85rem] text-success-content/50">+5 Points</div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col justify-center items-center"
    >
      <div class="flex items-center justify-center gap-x-4">
        <div class="flex gap-x-4 items-center">
          <div class="badge badge-neutral">
            <span v-if="thisTeamScore!.points === 0">Incorrect</span>
            <span v-else-if="thisTeamScore!.points > 0 && thisTeamScore!.points < 5">Partial</span>
            <span v-else-if="thisTeamScore!.points >= 5">Correct</span>
          </div>
          <div>
            <span class="font-bold">{{ thisTeamScore?.points }} points</span>
            <span v-if="isSteal"> stolen by</span> <span v-else> for </span>
            <span class="font-bold">{{ thisTeam.name }}</span>
          </div>
        </div>
        <button
          class="btn btn-sm"
          @click="clearPoints"
        >
          undo?
        </button>
      </div>

      <div v-if="thisTeamScore && thisTeamScore.points < 5">
        <div class="flex text-sm mt-2 gap-x-2 items-center">
          <div class="whitespace-nowrap">Answer given:</div>
          <input
            class="input input-sm text-black"
            :value="thisTeamScore!.wrongAnswer"
            @input="store.setWrongAnswer(question, $event?.target?.value as string, isSteal)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
