import { computed } from 'vue'
import { defineStore } from 'pinia'
import type { Team } from '@/types/Team.ts'
import type { ObobQuestionType, QuestionSet } from '@/types/ObobTypes.ts'
import { StorageSerializers, useStorage } from '@vueuse/core'

const DEFAULT_ALLOW_STEALING = true
const defaultTeam1: Team = {
  number: 1,
  name: '',
  color: 'team1',
  responses: new Map<number, { points: number, wrongAnswer?: string }>(),
  isConfigured: false,
}

const defaultTeam2: Team = {
  number: 2,
  name: '',
  color: 'team2',
  responses: new Map<number, { points: number, wrongAnswer?: string }>(),
  isConfigured: false,
}

export const useAppStore = defineStore('app', () => {
  const showConfig = useStorage('showConfig', true)
  const configScreen = useStorage<'file' | 'teams'>('configScreen', 'file')
  const allowStealing = useStorage<boolean>('allowStealing', DEFAULT_ALLOW_STEALING)

  const activeQuestionKey = useStorage<{ type: 'inWhichBook' | 'content', number: number }>('activeQuestionKey', {
    type: 'inWhichBook',
    number: 1,
  })

  const team1 = useStorage<Team>('team1', defaultTeam1)
  const team2 = useStorage<Team>('team2', defaultTeam2)

  const filename = useStorage<string | undefined>('questionSetFilename', null, undefined, { serializer: StorageSerializers.object })
  const backupFilename = useStorage<string | undefined>('backupQuestionSetFilename', null, undefined, { serializer: StorageSerializers.object })

  const questionSet = useStorage<QuestionSet | undefined>('questionSet', null, undefined, { serializer: StorageSerializers.object })
  const backupQuestionSet = useStorage<QuestionSet | undefined>('backupQuestionSet', null, undefined, { serializer: StorageSerializers.object })

  const teamScores = computed(() => {
    let score1 = 0
    let score2 = 0

    if (!questionSet.value) {
      return { 1: 0, 2: 0 }
    }

    for (const question of [...questionSet.value.inWhichBook, ...questionSet.value.content]) {
      score1 += question?.score[1].points ?? 0
      score2 += question?.score[2].points ?? 0
    }
    return {
      1: score1,
      2: score2,
    }
  })

  const activeQuestion = computed(() => {
    if (!questionSet.value) {
      return undefined
    }
    return questionSet.value[activeQuestionKey.value.type][activeQuestionKey.value.number - 1]
  })

  const getTeam = (teamNumber: 1 | 2) => {
    return teamNumber === 1 ? team1.value : team2.value
  }
  const getOtherTeam = (teamNumber: 1 | 2) => {
    return teamNumber === 1 ? team2.value : team1.value
  }

  const getTeamName = (teamNumber: 1 | 2) => {
    return getTeam(teamNumber).name
  }
  const getOtherTeamName = (teamNumber: 1 | 2) => {
    return getOtherTeam(teamNumber).name
  }

  const activeTeam = computed((): Team => {
    return activeQuestion.value?.teamNumber === 1 ? team1.value : team2.value
  })

  const stealTeam = computed((): Team => {
    return activeQuestion.value?.teamNumber === 1 ? team2.value : team1.value
  })

  const activeTeamScore = computed(() => {
    return activeQuestion.value?.score[activeTeam.value.number]
  })
  const stealTeamScore = computed(() => {
    return activeQuestion.value?.score[stealTeam.value.number]
  })

  const assignActiveTeamPoints = (question: ObobQuestionType, points: number) => {
    question.score[activeTeam.value.number].points = points
  }

  const assignStealTeamPoints = (question: ObobQuestionType, points: number) => {
    const key = activeTeam.value.number === 1 ? 2 : 1
    question.score[key].points = points
  }

  const clearActiveTeamPoints = (question: ObobQuestionType) => {
    question.score[activeTeam.value.number] = { points: undefined, wrongAnswer: undefined }
  }

  const clearStealTeamPoints = (question: ObobQuestionType) => {
    const key = activeTeam.value.number === 1 ? 2 : 1
    question.score[key] = { points: undefined, wrongAnswer: undefined }
  }

  const setWrongAnswer = (question: ObobQuestionType,  wrongAnswer: string, isSteal: boolean) => {
    const activeTeamKey = question.teamNumber
    const stealTeamKey = question.teamNumber === 1 ? 2 : 1
    const key = isSteal ? stealTeamKey : activeTeamKey
    questionSet.value![question.type][question.number - 1]!.score[key]!.wrongAnswer = wrongAnswer
  }

  const resetApp = () => {
    showConfig.value = true
    configScreen.value = 'file'
    team1.value = defaultTeam1
    team2.value = defaultTeam2
    filename.value = undefined
    backupFilename.value = undefined
    questionSet.value = null
    backupQuestionSet.value = null
    allowStealing.value = DEFAULT_ALLOW_STEALING
    activeQuestionKey.value = {
      type: 'inWhichBook',
      number: 1,
    }
  }

  return {
    showConfig,
    configScreen,
    allowStealing,
    team1,
    team2,
    teamScores,
    filename,
    backupFilename,
    questionSet,
    backupQuestionSet,
    getTeamName,
    getOtherTeam,
    getOtherTeamName,
    activeQuestionKey,
    activeTeam,
    stealTeam,
    activeTeamScore,
    stealTeamScore,
    assignActiveTeamPoints,
    assignStealTeamPoints,
    clearActiveTeamPoints,
    clearStealTeamPoints,
    setWrongAnswer,
    resetApp
  }
})
