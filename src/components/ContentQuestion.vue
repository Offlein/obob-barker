<script setup lang="ts" async>
import type { ContentQuestionType } from '@/types/ObobTypes.ts'
import GenericQuestion from '@/components/GenericQuestion.vue'

defineProps<{
  question: ContentQuestionType
}>()

</script>

<template>
  <GenericQuestion :question="question">
    <template #question>
      <div class="mt-6 mb-1 border-b pb-2 ">
        <div class="text-[1rem] text-gray-500"><em>From the book:</em></div>
        <div class="text-[1.5rem]">{{ question.title }}</div>
      </div>
      <div class="text-[1.5rem] mt-2 mb-6">
        {{ question.question }}
      </div>
    </template>

    <template #answers>
      <div class="mb-2">
        <div class="text-gray-500"><em>Answer:</em></div>
        <div>{{ question.answer }}</div>
      </div>
    </template>
  </GenericQuestion>
</template>

<style scoped>
</style>
