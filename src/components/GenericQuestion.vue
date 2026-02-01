<script setup lang="ts" async>
import type { ObobQuestionType } from '@/types/ObobTypes.ts'
import { useAppStore } from '@/stores/AppStore.ts'
import type { Team } from '@/types/Team.ts'
import QuestionPointsSection from '@/components/QuestionPointsSection.vue'

defineProps<{
  question: ObobQuestionType
  team: Team
}>()

const store = useAppStore()
</script>

<template>
  <div class="relative pb-2">
    <div class="flex justify-between">
      <div>
        Question #{{ question.number }}
        <span v-if="question.backupReplacement" class="text-error">
          [BACKUP #{{ question.backupReplacement?.number }}]
        </span>
      </div>
      <div>Team: {{ team.name }}</div>
    </div>

    <slot name="question" />

    <div
      class="p-4 mb-4 rounded-lg"
      :class="{ 'bg-team1-100': team.number === 1, 'bg-team2-100': team.number === 2 }"
    >
      <slot name="answers" />
      <div class="text-right">
        <span class="text-gray-500">Pages:</span> {{ question.pages.join(', ') }}
      </div>
    </div>

    <QuestionPointsSection
      :question="question"
      :is-steal="false"
    />

    <div
      v-if="store.allowStealing && store.activeTeamScore && store.activeTeamScore.points! < 5"
      class="mt-4"
    >
      <div class="text-center mt-2">
        Chance to steal for <strong>{{ store.getOtherTeamName(team.number) }}</strong
        >?
      </div>
      <QuestionPointsSection
        :question="question"
        :is-steal="true"
      />
    </div>

    <div
      v-if="!question.backupReplacement"
      class="text-xs absolute right-4 -bottom-4 cursor-pointer hover:underline"
      onclick="use_backup_modal.showModal()"
    >
      Need a backup question?
    </div>
    <div
      v-else
      class="backup-warning"
    >
      THIS IS BACKUP QUESTION #{{ store.activeQuestionKey.number }}
    </div>
  </div>
</template>

<style scoped>
.backup-warning {
  color: black;
  position: relative;
  top: 2.5rem;
  font-weight: bold;
  margin: 0 -2rem;
  text-align: center;
  background-image: repeating-linear-gradient(
    -55deg,
    var(--color-primary),
    var(--color-primary) 20px,
    var(--color-green-500) 20px,
    var(--color-green-500) 40px
  );
}
</style>
