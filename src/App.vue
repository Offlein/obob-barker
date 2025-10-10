<script setup lang="ts" async>
import PdfLoader from '@/components/PdfLoader.vue'
import ObobQuestions from '@/components/ObobQuestions.vue'
import { reactive, ref } from 'vue'
import type { QuestionSet } from '@/types/ObobTypes.ts'
import TeamData from '@/components/TeamData.vue'
import type { Team } from '@/types/Team.ts'

const questionSet = ref<QuestionSet>()
const team1 = reactive<Team>({
  number: 1,
  name: '',
  score: 0,
  color: 'purple',
})
const team2 = reactive<Team>({
  number: 2,
  name: '',
  score: 0,
  color: 'green',
})

const handleScoreChange = (e: { teamNumber: 1 | 2, newScore: number }) => {
  if (e.teamNumber === 1) {
    team1.score = e.newScore
  } else {
    team2.score = e.newScore
  }
}

</script>

<template>
  <Suspense>
    <div class="mx-auto max-w-[60rem] w-full">
      <h1 class="text-xl">OBOB Barker</h1>

      <div class="">
        <PdfLoader
          v-if="!questionSet"
          @update="questionSet = $event"
        />
        <div
          v-if="questionSet"
          class="flex w-full gap-x-8"
        >
          <div
            class="fieldset mt-13 flex flex-col w-1/3 gap-x-4"
          >
            <TeamData
              v-model="team1.name"
              :color="team1.color"
              :score="team1.score"
            />
            <div class="divider divider-horizontal" />
            <TeamData
              v-model="team2.name"
              :color="team2.color"
              :score="team2.score"
            />
          </div>
          <ObobQuestions
            class="w-2/3"
            v-if="questionSet"
            :question-set="questionSet"
            :team1="team1"
            :team2="team2"
            @score-change="handleScoreChange"
          />
        </div>
      </div>
    </div>
  </Suspense>
</template>

<style scoped></style>
