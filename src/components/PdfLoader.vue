<script setup lang="ts" async>
import { parseQuestionSet } from '@/lib/ObobParser.ts'
import type { QuestionSet } from '@/types/ObobTypes.ts'
import type { PDFParse as PDFParseType } from 'pdf-parse'

const { PDFParse } = await import('@/vendor/pdf-parse.es.min') as { PDFParse: typeof PDFParseType }

const emit = defineEmits<{
  (e: 'update', value: QuestionSet): void
}>()

const onLoadedData = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const buffer = await file.arrayBuffer()
  const parser = new PDFParse({ data: buffer })

  // getText / getImage / getTable also work in browser
  const textObj = await parser.getText()
  const questionSet = parseQuestionSet(textObj.text)
  emit('update', questionSet)
}

</script>

<template>
  <div class="hero bg-base-200 py-8">
    <div class="hero-content text-center">
      <div class="max-w-md">
       <h2 class="text-4xl mb-4">Welcome to OBOB Barker!</h2>
        <p>Please select your current question set to begin.</p>
        <input
          class="file-input mx-auto my-4"
          type="file"
          @change="onLoadedData"
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
