<script setup lang="ts" async>
import { parseQuestionSet } from '@/lib/ObobParser.ts'
import type { QuestionSet } from '@/types/ObobTypes.ts'
import type { PDFParse as PDFParseType } from 'pdf-parse'
import { useAppStore } from '@/stores/AppStore.ts'
import { ref } from 'vue'

const store = useAppStore()
const questionSet = ref<QuestionSet>()
const questionSetError = ref<string | undefined>()

const { PDFParse } = await import('@/vendor/pdf-parse.es.min') as { PDFParse: typeof PDFParseType }

const onLoadedData = async (e: Event) => {
  questionSetError.value = undefined

  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) {
    questionSet.value = undefined
    store.questionSet = undefined
    return
  }

  try {
    const buffer = await file.arrayBuffer()
    const parser = new PDFParse({ data: buffer })

    // getText / getImage / getTable also work in browser
    const textObj = await parser.getText()
    questionSet.value = parseQuestionSet(textObj.text)
  } catch (e) {
    console.error(e)
    questionSetError.value = e.message
    store.questionSet = undefined
    return
  }

  if (questionSet.value?.inWhichBook.length === 8 && questionSet.value?.content.length === 8) {
    store.questionSet = questionSet.value
  } else {
    questionSet.value = undefined
    questionSetError.value = 'Could not detect OBOB questions.'
  }
}

</script>

<template>
  <div class="max-w-md">
    <h2 class="text-4xl mb-4">Welcome to OBOB Barker!</h2>
    <p>Please select your current question set to begin.</p>
    <input
      class="file-input  mx-auto my-4"
      type="file"
      :class="{ 'file-input-primary': !questionSet, 'file-input-secondary': questionSet }"
      @change="onLoadedData"
    >

    <div
      v-if="questionSet || questionSetError"
      class="p-4 mt-2 text-left rounded transition-colors"
      :class="{ 'bg-base-300': !questionSetError && !questionSet, 'bg-warning text-warning-content': questionSetError, 'bg-neutral text-neutral-content': questionSet && !questionSetError }"
    >
      <div>Question file loaded...</div>
      <div v-if="store.questionSet">
        <div>
          <ul class="text-left list-disc pl-12">
            <li>Found 8 "In Which Book" questions</li>
            <li>Found 8 "Content" questions</li>
          </ul>
        </div>
      </div>
      <div v-else-if="questionSetError" class="mt-2">
        ...Something went wrong. {{ questionSetError}}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
