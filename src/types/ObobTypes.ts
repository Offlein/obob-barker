export interface ObobScoreType {
  points?: number
  wrongAnswer?: string
}

export interface ObobQuestionType {
  type: 'inWhichBook' | 'content'
  number: number
  question: string
  pages: number[]
  teamNumber: 1 | 2
  score: {
    1: ObobScoreType,
    2: ObobScoreType,
  }
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
  inWhichBook: InWhichBookQuestionType[]
  content: ContentQuestionType[]
};
