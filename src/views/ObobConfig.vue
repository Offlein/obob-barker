<script setup lang="ts" async>
import { calculateDefaultRoundTime, useAppStore } from '@/stores/AppStore.ts'
import PdfLoader from '@/components/PdfLoader.vue'
import TeamData from '@/components/TeamData.vue'
import type { QuestionSet } from '@/types/ObobTypes.ts'

const store = useAppStore()

const setTimeToNow = () => {
  store.roundTime = calculateDefaultRoundTime()
}

const updateFilename = (newFileName: string | undefined, isBackup?: boolean) => {
  if (isBackup) {
    store.backupFilename = newFileName
  } else {
    store.filename = newFileName
  }
}

const updateQuestionSet = (newQuestionSet: QuestionSet | undefined, isBackup?: boolean) => {
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

const handleTimeBlur = () => {
  const date = new Date(store.roundTime)
  if (isNaN(date.getTime())) return

  const minutes = date.getMinutes()

  if (minutes !== 0 && minutes !== 30) {
    const roundedMinutes = minutes < 15 ? 0 : minutes < 45 ? 30 : 0
    if (minutes >= 45) {
      date.setHours(date.getHours() + 1)
    }
    date.setMinutes(roundedMinutes)
    date.setSeconds(0)
    date.setMilliseconds(0)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const mins = String(date.getMinutes()).padStart(2, '0')

    store.roundTime = `${year}-${month}-${day}T${hours}:${mins}`
  }
}
</script>

<template>
  <div class="card shadow">
    <div
      v-if="store.configScreen === 'intro'"
      class="hero bg-base-200 py-8 w-full"
    >
      <div class="hero-content text-center flex-col w-full">
        <h2 class="text-4xl mb-4">Welcome to OBOB Barker!</h2>
        <div class="w-1/2 min-w-[5rem] text-left mx-auto flex flex-col gap-y-4">
          <label class="flex items-center text-black">
            <div class="w-[10rem]">Round date/time:</div>
            <div class="flex items-center flex-grow">
              <input
                v-model="store.roundTime"
                type="datetime-local"
                class="input"
                step="1800"
                @blur="handleTimeBlur"
              />
              <button
                type="button"
                class="btn btn-link btn-xs"
                @click="setTimeToNow"
              >
                set to now
              </button>
            </div>
          </label>
          <label class="flex items-center text-black">
            <div class="w-[10rem]">Moderator name</div>
            <input
              class="input w-[12rem] flex-grow"
              v-model="store.moderatorName"
            />
          </label>
          <label class="flex items-center text-black">
            <div class="w-[10rem]">Stealing points</div>
            <select
              class="input w-[12rem] flex-grow"
              v-model="store.allowStealing"
            >
              <option :value="true">Stealing Allowed</option>
              <option :value="false">No Stealing</option>
            </select>
          </label>
        </div>
        <Transition>
          <div
            class="mx-auto text-center mt-2"
            v-if="store.roundTime && store.moderatorName"
          >
            <button
              class="btn btn-primary btn-lg"
              @click="store.configScreen = 'file'"
            >
              Looks good! Let's upload your question sets.
            </button>
          </div>
        </Transition>
      </div>
    </div>
    <div
      class="hero bg-base-200 py-8 w-full"
      v-else-if="store.configScreen === 'file'"
    >
      <div class="hero-content text-center flex-col items-center justify-center w-full">
        <h2 class="text-4xl mb-4">Import your Question Sets</h2>
        <div class="w-full text-center mx-auto">
          <p>Please select your <strong>question set</strong> to begin.</p>
          <PdfLoader
            :filename="store.filename"
            :is-backup="false"
            @update:filename="updateFilename($event, false)"
            @update:questions="updateQuestionSet($event, false)"
          />
        </div>

        <Transition>
          <div
            v-show="store.questionSet"
            class="w-full text-center mx-auto my-2"
          >
            <p>Great! Now choose which questions are the <strong>backup</strong> set.</p>
            <PdfLoader
              class="my-1"
              :filename="store.backupFilename"
              :is-backup="true"
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
            >
              OK! Let's add the teams
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
        >
          Start
        </button>
      </div>
    </div>

    <div class="bg-neutral p-8 text-white mx-auto w-full flex justify-center">
      <ul class="steps w-3/4 mx-auto text-center">
        <li
          class="step step-accent cursor-pointer"
          @click="store.configScreen = 'intro'"
        >
          Round info
        </li>
        <li
          class="step cursor-pointer"
          @click="store.configScreen = 'file'"
          :class="{
            'step-accent': store.configScreen === 'file' || store.configScreen === 'teams',
            'cursor-pointer': store.roundTime && store.moderatorName,
          }"
        >
          Import Questions
        </li>
        <li
          class="step"
          @click="handleTeamsClick"
          :class="{
            'step-accent': store.configScreen === 'teams',
            'cursor-pointer': store.questionSet && store.backupQuestionSet,
          }"
        >
          Set up Teams
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
