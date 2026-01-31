export type Team = {
  number: 1 | 2
  name: string
  color: string
  responses: Map<number, { points: number; wrongAnswer?: string }>
  isConfigured: boolean
}
