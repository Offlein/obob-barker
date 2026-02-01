export type QuestionTypes = 'inWhichBook' | 'content'

export interface ObobScoreType {
  points?: number
  wrongAnswer?: string
}

export interface QuestionKey {
  number: number
  type: QuestionTypes
}

export interface ObobQuestionType {
  type: QuestionTypes
  questionSet: 'main' | 'backup'
  number: number
  question: string
  pages: number[]
  teamNumber: 1 | 2
  score: {
    1: ObobScoreType
    2: ObobScoreType
  }
  backupReplacement?: Exclude<ObobQuestionType, 'backupReplacement'>
}

export interface InWhichBookQuestionType extends ObobQuestionType {
  type: 'inWhichBook'
  question: string
  answerTitle: string
  answerAuthor: string
  pages: number[]
}

export interface ContentQuestionType extends ObobQuestionType {
  type: 'content'
  title: string
  question: string
  answer: string
  pages: number[]
}

export type QuestionSet = {
  number?: string
  inWhichBook: InWhichBookQuestionType[]
  content: ContentQuestionType[]
}
