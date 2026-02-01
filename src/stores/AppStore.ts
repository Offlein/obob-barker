import { computed } from 'vue'
import { defineStore } from 'pinia'
import type { Team } from '@/types/Team.ts'
import type {
  ObobQuestionType,
  QuestionKey,
  QuestionSet,
  QuestionTypes,
} from '@/types/ObobTypes.ts'
import { StorageSerializers, useStorage } from '@vueuse/core'

const DEFAULT_ALLOW_STEALING = true
const defaultTeam1: Team = {
  number: 1,
  name: '',
  color: 'team1',
  responses: new Map<number, { points: number; wrongAnswer?: string }>(),
  isConfigured: false,
}

const defaultTeam2: Team = {
  number: 2,
  name: '',
  color: 'team2',
  responses: new Map<number, { points: number; wrongAnswer?: string }>(),
  isConfigured: false,
}

export const calculateDefaultRoundTime = (): string => {
  const now = new Date()
  const minutes = now.getMinutes()
  const roundedMinutes = minutes < 15 ? 0 : minutes < 45 ? 30 : 60
  now.setMinutes(roundedMinutes)
  now.setSeconds(0)
  now.setMilliseconds(0)

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const mins = String(now.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${mins}`
}

export const useAppStore = defineStore('app', () => {
  const roundTime = useStorage<string>('roundTime', calculateDefaultRoundTime())
  const moderatorName = useStorage<string>('moderatorName', '')

  const showConfig = useStorage('showConfig', true)
  const configScreen = useStorage<'intro' | 'file' | 'teams'>('configScreen', 'intro')
  const allowStealing = useStorage<boolean>('allowStealing', DEFAULT_ALLOW_STEALING)
  const backupQuestionsUsedContent = useStorage<number[]>('backupQuestionsUsedContent', [])
  const backupQuestionsUsedInWhichBook = useStorage<number[]>(
    'backupQuestionsUsedInWhichBook',
    [],
  )

  const activeQuestionKey = useStorage<QuestionKey>('activeQuestionKey', {
    type: 'inWhichBook',
    number: 1,
  })

  const team1 = useStorage<Team>('team1', defaultTeam1)
  const team2 = useStorage<Team>('team2', defaultTeam2)

  const filename = useStorage<string | undefined>('questionSetFilename', null, undefined, {
    serializer: StorageSerializers.object,
  })
  const backupFilename = useStorage<string | undefined>(
    'backupQuestionSetFilename',
    null,
    undefined,
    { serializer: StorageSerializers.object },
  )

  const questionSet = useStorage<QuestionSet | undefined>('questionSet', null, undefined, {
    serializer: StorageSerializers.object,
  })
  const backupQuestionSet = useStorage<QuestionSet | undefined>(
    'backupQuestionSet',
    null,
    undefined,
    { serializer: StorageSerializers.object },
  )

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

  const setWrongAnswer = (question: ObobQuestionType, wrongAnswer: string, isSteal: boolean) => {
    const activeTeamKey = question.teamNumber
    const stealTeamKey = question.teamNumber === 1 ? 2 : 1
    const key = isSteal ? stealTeamKey : activeTeamKey
    questionSet.value![question.type][question.number - 1]!.score[key]!.wrongAnswer = wrongAnswer
  }

  const getRelevantBackupQuestionArray = (questionType: QuestionTypes) => {
    return questionType === 'content' ? backupQuestionsUsedContent : backupQuestionsUsedInWhichBook
  }

  const useBackupQuestion = () => {
    const relevantArray = getRelevantBackupQuestionArray(activeQuestionKey.value.type)
    relevantArray.value.push(activeQuestionKey.value.number)
    activeQuestion.value!.backupReplacement = backupQuestionSet.value![activeQuestionKey.value.type][relevantArray.value.length - 1]
  }

  const backupQuestionNumberForActiveQuestion = computed((): number | undefined => {
    const relevantArray = getRelevantBackupQuestionArray(activeQuestionKey.value.type)
    for (let i = 0; i < relevantArray.value.length; i++) {
      const originalQuestionNumber = relevantArray.value[i]
      if (activeQuestionKey.value.number === originalQuestionNumber) {
        // The original question number was at index `i` in tne array. So the backup question number is `i + 1`.
        return i + 1
      }
    }
    return undefined
  })

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
    backupQuestionsUsedInWhichBook.value = []
    backupQuestionsUsedContent.value = []
    roundTime.value = calculateDefaultRoundTime()
    moderatorName.value = ''
  }

  return {
    roundTime,
    moderatorName,
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
    useBackupQuestion,
    backupQuestionNumberForActiveQuestion,
    resetApp,
  }
})
