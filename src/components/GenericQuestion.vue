<script setup lang="ts" async>
import type { ObobQuestionType } from '@/types/ObobTypes.ts'
import { useAppStore } from '@/stores/AppStore.ts'
import type { Team } from '@/types/Team.ts'

defineProps<{
  question: ObobQuestionType
  team: Team
}>()

const store = useAppStore()

</script>

<template>
  <div class="flex justify-between">
    <div>Question #{{ question.number }}</div>
    <div>
      Team: {{ team.name }}
    </div>
  </div>

  <slot name="question" />

  <div
    class="p-4 mb-4 rounded-lg"
    :class="{ 'bg-purple-100': team.number === 1, 'bg-green-100': team.number === 2 }"
  >
    <slot name="answers" />
    <div class="text-right "><span class="text-gray-500">Pages:</span> {{ question.pages.join(', ') }}</div>
  </div>

  <div
    class="py-4 transition-colors duration-500 rounded-lg"
    :class="{
          'bg-transparent': !question.points,
          'bg-primary text-primary-content': question.points?.number === 5,
          'bg-secondary text-secondary-content': question.points?.number === 3,
          'bg-error text-error-content': question.points?.number === 0,
        }"
  >
    <div
      v-if="!question.points"
      class="flex items-center justify-center gap-x-4"
    >
      <div class="btn btn-secondary py-8 btn-lg gap-y-0 flex flex-col leading-none" @click="store.assignPoints(question, 3, team)">
        <div class="mb-2">Partial</div>
        <div class="text-[0.85rem] text-secondary-content/50">+3 Points</div>
      </div>

      <div class="btn btn-primary  py-8  btn-lg gap-y-0 flex flex-col leading-none" @click="store.assignPoints(question, 5, team)">
        <div class="mb-2">Correct!</div>
        <div class="text-[0.85rem] text-success-content/50">+5 Points</div>
      </div>
      <div class="divider divider-horizontal" />
      <button class="btn btn-error py-8 btn-lg gap-y-0 flex flex-col leading-none" @click="store.assignPoints(question, 0, team)">
        <div class="mb-2">Incorrect</div>
        <div class="text-[0.85rem] text-error-content/50">No points</div>
      </button>
    </div>
    <div
      v-else
      class="flex flex-col justify-center items-center"
    >
      <div class="flex items-center justify-center gap-x-4">
        <div class="flex gap-x-4">
          <div class="badge badge-neutral">
            <span v-if="question.points.number === 0">Incorrect</span>
            <span v-else-if="question.points.number > 0 && question.points?.number < 5">Partial</span>
            <span v-else-if="question.points.number >= 5">Correct</span>
          </div>
          <div>
            <span class="font-bold">{{ question.points?.number }} points</span> for <span class="font-bold">{{ store.getTeamName(question.points?.teamNumber) }}</span>
          </div>
        </div>
        <button class="btn" @click="store.clearPoints(question)">undo?</button>
      </div>
      <label
        v-if="question.points.number === 0"
        class="flex text-sm mt-2 gap-x-2 items-center"
      >
        <div class="whitespace-nowrap">Incorrect answer:</div>
        <input
          class="input input-sm"
          :value="question.points.wrongAnswer"
          @input="store.setWrongAnswer(question, $event?.target?.value)"
        />
      </label>
    </div>
  </div>
</template>

<style scoped>

.points-button {
  @apply leading-none;
}
</style>
