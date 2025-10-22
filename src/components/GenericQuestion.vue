<script setup lang="ts" async>
import type { ObobQuestionType } from '@/types/ObobTypes.ts'
import { useAppStore } from '@/stores/AppStore.ts'
import type { Team } from '@/types/Team.ts'
import QuestionPointsSection from '@/components/QuestionPointsSection.vue'

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
    :class="{ 'bg-team1-100': team.number === 1, 'bg-team2-100': team.number === 2 }"
  >
    <slot name="answers" />
    <div class="text-right "><span class="text-gray-500">Pages:</span> {{ question.pages.join(', ') }}</div>
  </div>

  <QuestionPointsSection
    :question="question"
    :is-steal="false"
  />

  <div
    v-if="store.allowStealing && store.activeTeamScore && store.activeTeamScore.points < 5"
    class="mt-4"
  >
    <div class="text-center mt-2">
      Chance to steal for <strong>{{ store.getOtherTeamName(team.number) }}</strong>?
    </div>
    <QuestionPointsSection
      :question="question"
      :is-steal="true"
    />
  </div>
</template>

<style scoped>
</style>
