<script setup lang="ts" async>
import type { QuestionSet } from '@/types/ObobTypes.ts'
import { computed, reactive, ref } from 'vue'
import type { Team } from '@/types/Team.ts'

const props = defineProps<{
  questionSet: QuestionSet
  team1: Team
  team2: Team
}>()

const emit = defineEmits<{
  (e: 'scoreChange', value: { teamNumber: 1 | 2, newScore: number }): void
}>()

const score = reactive(new Map<number, { team: Team, points: number, wrongAnswer?: string }>())

const activeQuestion = ref<number>(1)

const activeScore = computed(() => {
  return score.get(activeQuestion.value)
})

const activeTeam = computed((): Team => {
  return activeQuestion.value % 2 !== 0 ? props.team1 : props.team2
})

const canPrev = computed(() => {
  return activeQuestion.value > 1
})

const canNext = computed(() => {
  return activeQuestion.value < props.questionSet.inWhichBook.length
})

const assignPoints = (points: number, team: Team) => {
  score.set(activeQuestion.value, { team: team, points })
  updateScores(team)
}

const clearActiveScore = () => {
  score.delete(activeQuestion.value)
  updateScores(activeTeam.value)
}

const updateScores = (changedTeam: Team) => {
  const teamNum = changedTeam.number
  let newScore = 0
  score.forEach((value) => {
    if (value.team.number === teamNum) {
      newScore += value.points
    }
  });

  emit('scoreChange', { teamNumber: teamNum, newScore: newScore })
}

</script>

<template>
  <div class="flex flex-col">
    <div class="flex gap-x-4 justify-end questions-buttons">
      <button
        class="btn btn-neutral"
        :disabled="!canPrev"
        @click="activeQuestion--"
      >Back</button>
      <button
        class="btn btn-neutral"
        :disabled="!canNext"
        @click="activeQuestion++"
      >Next</button>
    </div>

    <template
      v-for="(question, idx) of questionSet.inWhichBook"
      :key="idx"
    >
      <div
        v-if="activeQuestion === (idx+1)"
        class="flex-grow p-8 mt-4 card shadow"
        :class="{ 'bg-purple-50': activeTeam.number === 1, 'bg-green-50': activeTeam.number === 2 }"
      >
        <div class="flex justify-between">
          <div>
            Question #{{ activeQuestion }}
          </div>
          <div>
            Team: {{ activeTeam.name }}
          </div>
        </div>
        <div class="text-[1.5rem] mt-2 mb-4">
          {{ question.question }}
        </div>

        <div
          class="p-4 mt-2 rounded-lg"
          :class="{ 'bg-purple-100': activeTeam.number === 1, 'bg-green-100': activeTeam.number === 2 }"
        >
          <div class="mb-2">
            <div class="text-gray-500"><em>Answer (TITLE):</em></div>
            <div>{{ question.answerTitle }}</div>
          </div>
          <div class="mb-2">
            <div class="text-gray-500"><em>Answer (AUTHOR):</em></div>
            <div>{{ question.answerAuthor }}</div>
          </div>

          <div class="text-right "><span class="text-gray-500">Pages:</span> {{ question.pages.join(', ') }}</div>
        </div>

        <div
          class="flex items-center justify-end gap-x-4 mt-4"
        >
          <template v-if="!score.has(activeQuestion)">
            <button class="btn btn-secondary" @click="assignPoints(1, activeTeam)">+1 point</button>
            <button class="btn btn-primary" @click="assignPoints(2, activeTeam)">+2 points</button>
            <div class="divider divider-horizontal" />
            <button class="btn btn-warning" @click="assignPoints(0, activeTeam)">No Points</button>
          </template>
          <template v-else>
            <div>
              <div>{{ activeScore?.points }}pt for {{ activeScore?.team.name }}</div>
              <label v-if="activeScore?.points === 0">
                Incorrect answer?
                <input class="input" v-model="activeScore!.wrongAnswer" />
              </label>
            </div>
              <button class="btn" @click="clearActiveScore">undo?</button>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.questions-buttons button {
  @apply cursor-pointer;
}
.questions-buttons button[disabled] {
  @apply opacity-50;
}
</style>
