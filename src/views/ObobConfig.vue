<script setup lang="ts" async>
import { useAppStore } from '@/stores/AppStore.ts'
import PdfLoader from '@/components/PdfLoader.vue'
import TeamData from '@/components/TeamData.vue'
import type { QuestionSet } from '@/types/ObobTypes.ts'

const store = useAppStore()

const updateFilename = (newFileName: string | undefined, isBackup?: boolean) => {
  if (isBackup) {
    store.backupFilename = newFileName
  } else {
    store.filename = newFileName
  }
}

const updateQuestionSet = (newQuestionSet: QuestionSet | undefined, isBackup?: boolean) => {
  console.log(newQuestionSet)
  if (isBackup) {
    store.backupQuestionSet = newQuestionSet
  } else {
    store.questionSet = newQuestionSet
  }
}

const handleTeamsClick = () => {
  if (store.questionSet && store.backupQuestionSet) {
    store.configScreen = 'teams'
  }
}

</script>

<template>
  <div class="card shadow">
      <div class="hero bg-base-200 py-8 w-full" v-if="store.configScreen === 'file'">
        <div class="hero-content text-center flex-col items-center justify-center w-full">
          <h2 class="text-4xl mb-4">Welcome to OBOB Barker!</h2>

          <div class="w-full text-center mx-auto">
            <p>Please select your <strong>question set</strong> to begin.</p>
            <PdfLoader
              :filename="store.filename"
              @update:filename="updateFilename($event, false)"
              @update:questions="updateQuestionSet($event, false)"
            />
          </div>

          <Transition>
            <div v-show="store.questionSet" class="w-full text-center mx-auto my-2">
              <p>Great! Now choose which questions are the <strong>backup</strong> set.</p>
              <PdfLoader
                class="my-1"
                :filename="store.backupFilename"
                @update:filename="updateFilename($event, true)"
                @update:questions="updateQuestionSet($event, true)"
              />
            </div>
          </Transition>

          <Transition>
            <div
              class="mx-auto text-center mt-2"
              v-if="store.questionSet && store.backupQuestionSet"
            >
              <button
                class="btn btn-primary btn-lg"
                @click="store.configScreen = 'teams'"
              >OK! Let's add the teams
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <div
        class="card shadow bg-base-200 p-16"
        v-if="store.configScreen === 'teams'"
      >
        <div class="flex flex-col gap-y-4 w-3/4 justify-center items-center mx-auto">
          <TeamData
            :team-number="1"
            :is-gameplay="false"
            class="w-full"
          />
          <TeamData
            :team-number="2"
            :is-gameplay="false"
            class="w-full"
          />
        </div>

        <div class="mx-auto text-center mt-6">
          <button
            class="btn btn-primary btn-lg"
            @click="store.showConfig = false"
            :disabled="!store.team1.name || !store.team2.name"
          >Start
          </button>
        </div>
      </div>


    <div class="bg-neutral p-8 text-white mx-auto w-full flex justify-center">
      <ul class="steps w-3/4 mx-auto text-center">
        <li class="step step-accent cursor-pointer" @click="store.configScreen = 'file'">
          Set up questions
        </li>
        <li class="step"
            @click="handleTeamsClick"
            :class="{ 'step-accent' : store.configScreen === 'teams', 'cursor-pointer': store.questionSet && store.backupQuestionSet }">Set up
          Teams
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
