import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Team } from '@/types/Team.ts'
import type { ObobQuestionType, QuestionSet } from '@/types/ObobTypes.ts'

export const useAppStore = defineStore('app', () => {
  const showConfig = ref(true)
  const configScreen = ref<'file' | 'teams'>('file')

  const team1 = ref<Team>({
    number: 1,
    name: '',
    score: 0,
    color: 'purple',
    responses: new Map<number, { points: number, wrongAnswer?: string }>(),
    isConfigured: false,
  })

  const team2 = ref<Team>({
    number: 2,
    name: '',
    score: 0,
    color: 'green',
    responses: new Map<number, { points: number, wrongAnswer?: string }>(),
    isConfigured: false,
  })

  const questionSet = ref<QuestionSet>()

  const updateScores = () => {
    team1.value.score = 0
    team2.value.score = 0
    for (const question of [...questionSet.value!.inWhichBook, ...questionSet.value!.content]) {
      if (question.points) {
        const team = question.points.teamNumber === 1 ? team1.value : team2.value
        team.score += question.points.number
      }
    }
  }

  const getTeam = (teamNumber: 1 | 2) => {
    return teamNumber === 1 ? team1.value : team2.value
  }

  const getTeamName = (teamNumber: 1 | 2) => {
    return getTeam(teamNumber).name
  }

  const activeQuestionKey = ref<{ type: 'inWhichBook' | 'content', number: number }>({
    type: 'inWhichBook',
    number: 1,
  })

  const activeTeam = computed((): Team => {
    return activeQuestionKey.value.number % 2 !== 0 ? team1.value : team2.value
  })

  const assignPoints = (question: ObobQuestionType, points: number, team: Team) => {
    questionSet.value![question.type][question.number - 1]!.points = {
      number: points,
      teamNumber: team.number,
      wrongAnswer: undefined,
    }
    updateScores()
  }

  const clearPoints = (question: ObobQuestionType) => {
    questionSet.value![question.type][question.number - 1]!.points = undefined
    updateScores()
  }

  const setWrongAnswer = (question: ObobQuestionType, wrongAnswer: string) => {
    questionSet.value![question.type][question.number - 1]!.points!.wrongAnswer = wrongAnswer
    updateScores()
  }

  return {
    showConfig,
    configScreen,
    team1,
    team2,
    questionSet,
    getTeamName,
    activeQuestionKey,
    activeTeam,
    assignPoints,
    clearPoints,
    setWrongAnswer,
  }
})
