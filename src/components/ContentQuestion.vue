<script setup lang="ts" async>
import type { ContentQuestionType } from '@/types/ObobTypes.ts'
import GenericQuestion from '@/components/GenericQuestion.vue'
import type { Team } from '@/types/Team.ts'
import { computed } from 'vue'

const props = defineProps<{
  question: ContentQuestionType
  team: Team
}>()

const bookTitle = computed(() => {
  if (props.question.backupReplacement) {
    return (props.question.backupReplacement as ContentQuestionType).title
  }
  return props.question.title
})

const questionText = computed(() => {
  if (props.question.backupReplacement) {
    return (props.question.backupReplacement as ContentQuestionType).question
  }
  return props.question.question
})

const answerText = computed(() => {
  if (props.question.backupReplacement) {
    return (props.question.backupReplacement as ContentQuestionType).answer
  }
  return props.question.answer
})
</script>

<template>
  <GenericQuestion
    :question="question"
    :team="team"
  >
    <template #question>
      <div class="mt-6 mb-1 border-b pb-2">
        <div class="text-[1rem] text-gray-500"><em>From the book:</em></div>
        <div class="text-[1.5rem]">{{ bookTitle }}</div>
      </div>
      <div class="text-[1.5rem] mt-2 mb-6">
        {{ questionText }}
      </div>
    </template>

    <template #answers>
      <div class="mb-2">
        <div class="text-gray-500"><em>Answer:</em></div>
        <div>{{ answerText }}</div>
      </div>
    </template>
  </GenericQuestion>
</template>

<style scoped></style>
