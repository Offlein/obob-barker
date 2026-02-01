<script setup lang="ts" async>
import type { InWhichBookQuestionType } from '@/types/ObobTypes.ts'
import GenericQuestion from '@/components/GenericQuestion.vue'
import type { Team } from '@/types/Team.ts'
import { computed } from 'vue'

const props = defineProps<{
  question: InWhichBookQuestionType
  team: Team
}>()

const questionText = computed(() => {
  if (props.question.backupReplacement) {
    return props.question.backupReplacement.question
  }
  return props.question.question
})

const answerTitle = computed(() => {
  if (props.question.backupReplacement) {
    return (props.question.backupReplacement as InWhichBookQuestionType).answerTitle
  }
  return props.question.answerTitle
})

const answerAuthor = computed(() => {
  if (props.question.backupReplacement) {
    return (props.question.backupReplacement as InWhichBookQuestionType).answerAuthor
  }
  return props.question.answerAuthor
})
</script>

<template>
  <GenericQuestion
    :question="question"
    :team="team"
  >
    <template #question>
      <div class="text-[1.5rem] mt-2 mb-4">
        {{ questionText }}
      </div>
    </template>

    <template #answers>
      <div class="mb-2">
        <div :class="'text-team' + team.number + '-content-light'"><em>Answer (TITLE):</em></div>
        <div :class="'text-team' + team.number + '-content'">{{ answerTitle }}</div>
      </div>
      <div class="mb-2">
        <div :class="'text-team' + team.number + '-content-light'"><em>Answer (AUTHOR):</em></div>
        <div :class="'text-team' + team.number + '-content'">{{ answerAuthor }}</div>
      </div>
    </template>
  </GenericQuestion>
</template>

<style scoped></style>
