<script setup lang="ts" async>
import type { InWhichBookQuestionType } from '@/types/ObobTypes.ts'
import GenericQuestion from '@/components/GenericQuestion.vue'
import type { Team } from '@/types/Team.ts'

defineProps<{
  question: InWhichBookQuestionType
  team: Team
}>()
</script>

<template>
  <GenericQuestion
    :question="question"
    :team="team"
  >
    <template #question>
      <div class="text-[1.5rem] mt-2 mb-4">
        {{ question.question }}
      </div>
    </template>

    <template #answers>
      <div class="mb-2">
        <div :class="'text-team' + team.number + '-content-light'"><em>Answer (TITLE):</em></div>
        <div :class="'text-team' + team.number + '-content'">{{ question.answerTitle }}</div>
      </div>
      <div class="mb-2">
        <div :class="'text-team' + team.number + '-content-light'"><em>Answer (AUTHOR):</em></div>
        <div :class="'text-team' + team.number + '-content'">{{ question.answerAuthor }}</div>
      </div>
    </template>
  </GenericQuestion>
</template>

<style scoped></style>
