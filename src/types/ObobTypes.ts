export interface ObobPoints {
  number: number
  teamNumber: 1 | 2
  wrongAnswer?: string
}

export interface ObobQuestionType {
  type: 'inWhichBook' | 'content'
  number: number
  question: string
  pages: number[]
  points?: ObobPoints
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
