<script setup lang="ts" async>
import { computed } from 'vue'
import { useAppStore } from '@/stores/AppStore.ts'
import type { ContentQuestionType, InWhichBookQuestionType } from '@/types/ObobTypes.ts'
import InWhichBookQuestion from '@/components/InWhichBookQuestion.vue'
import ContentQuestion from '@/components/ContentQuestion.vue'

const store = useAppStore()

const activeQuestion = computed(() => {
  return questionList.value.find(
    (q) => q.number === store.activeQuestionKey.number && q.type === store.activeQuestionKey.type,
  )
})

const canPrev = computed(() => {
  return !(store.activeQuestionKey.type === 'inWhichBook' && store.activeQuestionKey.number === 1)
})

const canNext = computed(() => {
  return !(
    store.activeQuestionKey.type === 'content' &&
    store.activeQuestionKey.number >= store.questionSet!.content.length
  )
})

const goPrev = () => {
  if (store.activeQuestionKey.type === 'content' && store.activeQuestionKey.number === 1) {
    store.activeQuestionKey = {
      type: 'inWhichBook',
      number: store.questionSet!.inWhichBook.length,
    }
  } else if (store.activeQuestionKey.number > 1) {
    store.activeQuestionKey.number--
  }
}

const goNext = () => {
  if (
    store.activeQuestionKey.type === 'inWhichBook' &&
    store.activeQuestionKey.number === store.questionSet!.inWhichBook.length
  ) {
    store.activeQuestionKey = {
      type: 'content',
      number: 1,
    }
  } else if (store.activeQuestionKey.number < store.questionSet!.content.length) {
    store.activeQuestionKey.number++
  }
}

const questionList = computed((): (InWhichBookQuestionType | ContentQuestionType)[] => {
  if (!store.questionSet?.inWhichBook || !store.questionSet?.content) {
    return []
  }
  return [...store.questionSet!.inWhichBook, ...store.questionSet!.content]
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between items-center gap-x-16">
      <div class="tabs tabs-box tabs-sm">
        <div
          class="tab"
          :class="{ 'tab-active': store.activeQuestionKey.type === 'inWhichBook' }"
          @click="store.activeQuestionKey = { type: 'inWhichBook', number: 1 }"
        >
          In Which Book
        </div>
        <div
          class="tab"
          :class="{ 'tab-active': store.activeQuestionKey.type === 'content' }"
          @click="store.activeQuestionKey = { type: 'content', number: 1 }"
        >
          Content
        </div>
      </div>

      <div class="flex gap-x-4 justify-end questions-buttons">
        <button
          class="btn btn-neutral"
          :disabled="!canPrev"
          @click="goPrev"
        >
          Back
        </button>
        <button
          v-if="canNext"
          class="btn btn-neutral"
          @click="goNext"
        >
          Next
        </button>
        <button
          v-if="!canNext"
          class="btn btn-secondary"
          onclick="scoreboard_modal.showModal()"
        >
          Show Scores
        </button>
      </div>
    </div>

    <div class="relative">
      <template
        v-for="question of questionList"
        :key="question.type + question.number"
      >
        <Transition>
          <div
            v-if="
              store.activeQuestionKey.type === question.type &&
              store.activeQuestionKey.number === question.number
            "
            class="relative flex-grow p-8 mt-4 card shadow w-full"
            :class="{
              'bg-team1-50': store.activeTeam.number === 1,
              'bg-team2-50': store.activeTeam.number === 2,
            }"
          >
            <InWhichBookQuestion
              v-if="activeQuestion!.type === 'inWhichBook'"
              :question="activeQuestion as InWhichBookQuestionType"
              :team="store.activeTeam"
            />
            <ContentQuestion
              v-else
              :question="activeQuestion as ContentQuestionType"
              :team="store.activeTeam"
            />
          </div>
        </Transition>
      </template>
    </div>
  </div>
</template>

<style scoped>
.questions-buttons button {
  @apply cursor-pointer;
}
.questions-buttons button[disabled] {
  @apply opacity-50;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
  position: absolute;
}

.v-enter-from {
  opacity: 0;
  transform: translateX(15%);
}
.v-leave-to {
  opacity: 0;
  transform: translateX(15%);
}
</style>
