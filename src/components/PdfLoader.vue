<script setup lang="ts" async>
import { parseQuestionSet } from '@/lib/ObobParser.ts'
import type { QuestionSet } from '@/types/ObobTypes.ts'
import { ref } from 'vue'

const props = defineProps<{
  filename?: string
  isBackup: boolean
}>()

const emit = defineEmits<{
  (e: 'update:filename', value: string | undefined): void
  (e: 'update:questions', value: QuestionSet | undefined): void
}>()

const fileInput = ref<HTMLInputElement>()
const questionSet = ref<QuestionSet>()
const questionSetError = ref<string | undefined>()
const isParsing = ref<boolean>(false)
const identifiedQuestionSet = ref<string | undefined>()

const { PDFParse } = await import('@/vendor/pdf-parse.es.min.js')

const parseFilenameForQuestionSetNumber = (filename: string) => {
  const matches = filename.match(/(?<!\d)\d{2}(?!\d)/g)
  if (matches) {
    return matches[matches.length - 1]
  }
  return undefined
}

const onLoadedData = async (e: Event) => {
  questionSetError.value = undefined

  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) {
    questionSet.value = undefined
    emit('update:filename', undefined)
    emit('update:questions', undefined)
    return
  } else {
    emit('update:filename', file.name)
  }

  isParsing.value = true

  try {
    const buffer = await file.arrayBuffer()
    const parser = new PDFParse({ data: buffer })
    const textObj = await parser.getText()
    identifiedQuestionSet.value = parseFilenameForQuestionSetNumber(file.name)
    questionSet.value = parseQuestionSet(textObj.text, props.isBackup)
    if (questionSet.value) {
      questionSet.value.number = identifiedQuestionSet.value
    }
  } catch (e) {
    console.error(e)
    questionSetError.value = e instanceof Error ? e.message : String(e)
    emit('update:questions', undefined)
    emit('update:filename', undefined)
    isParsing.value = false
    return
  }

  if (questionSet.value?.inWhichBook.length === 8 && questionSet.value?.content.length === 8) {
    emit('update:questions', questionSet.value)
  } else {
    questionSet.value = undefined
    questionSetError.value = 'could not detect OBOB questions.'
  }
  isParsing.value = false
}

const clearFile = () => {
  questionSet.value = undefined
  emit('update:filename', undefined)
  emit('update:questions', undefined)
}
</script>

<template>
  <div class="w-1/2 max-w-[28rem] mb-6 mx-auto relative">
    <div v-if="!filename">
      <input
        ref="fileInput"
        class="file-input mx-auto w-full"
        type="file"
        :class="{ 'file-input-primary': !questionSet, 'file-input-secondary': questionSet }"
        @change="onLoadedData"
      />
    </div>
    <div
      v-else
      class="flex input gap-x-4 items-center py-4 px-4 w-full"
    >
      <div
        class="btn btn-secondary btn-xs"
        @click="clearFile"
      >
        Remove
      </div>
      <div class="overflow-hidden overflow-ellipsis">{{ filename }}</div>
    </div>

    <Transition name="fade">
      <div
        v-if="isParsing"
        class="mt-2 absolute w-full opacity-100 text-center rounded transition-colors text-xs"
      >
        <div class="text-secondary">Parsing file...</div>
      </div>
    </Transition>
    <div
      v-if="questionSet || questionSetError"
      class="absolute opacity-0 w-full mt-2 blink text-center rounded transition-colors text-xs blink"
      :class="{ 'text-error': questionSetError, 'text-success': questionSet && !questionSetError }"
    >
      <div v-if="questionSet">
        <div>Looks good! Found all 16 questions.</div>
      </div>
      <div
        v-else-if="questionSetError"
        class="error"
      >
        Uh oh, {{ questionSetError }}
      </div>
      <div v-if="identifiedQuestionSet">
        We've detected this question set is #{{ identifiedQuestionSet }}.
      </div>
      <div
        v-else
        class="error"
      >
        We could not parse the number of the question set. Please re-upload the file with a
        two-digit number somewhere in the name, such as "obob-2027-04.pdf".
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
  position: absolute;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.blink {
  transition: opacity 0.5s ease;
  animation:
    1s forwards,
    blink 0.5s forwards 1s;
  animation-delay: 0.5s;
  animation-iteration-count: 2;
}
</style>
