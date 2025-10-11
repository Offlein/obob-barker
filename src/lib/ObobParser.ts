import type { InWhichBookQuestionType, ContentQuestionType, QuestionSet } from '@/types/ObobTypes'

// Thanks ChatGPT for working with me to do most of the bitch-work! //
type InputShape =
  | string
  | {
  pages?: { text: string; [k: string]: any }[]
  text?: string
  [k: string]: any
}
export function parseQuestionSet(
  input:
    | string
    | {
    pages?: { text: string; [k: string]: any }[]
    text?: string
    [k: string]: any
  }
): QuestionSet {
  const fullText =
    typeof input === 'string'
      ? input
      : input.text
        ? input.text
        : Array.isArray(input.pages)
          ? input.pages.map((p) => (p?.text ?? '')).join('\n')
          : ''

  // Normalize some whitespace oddities without destroying punctuation
  const normalize = (s: string) =>
    s.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim()

  const parsePages = (s: string): number[] =>
    s
      .split(/[;,]/)
      .map((t) => parseInt(t.trim(), 10))
      .filter((n) => Number.isFinite(n))

  const inWhichBook: InWhichBookQuestionType[] = []
  const content: ContentQuestionType[] = []

  // Regex for 'In which book' blocks
  // We match loosely around the header line so minor punctuation/emdash variants don’t break parsing.
  const inWhichBookRe =
    /IN[\s\S]*?WHICH[\s\S]*?BOOK[\s\S]*?QUESTION[\s\S]*?QUESTION:\s*([\s\S]*?)\nANSWER\s*\(TITLE\):\s*([\s\S]*?)\nANSWER\s*\(AUTHOR\):\s*([\s\S]*?)\nPAGE(?:S)?:\s*([^\n]+)\n/gi

  // Regex for 'Content question' blocks
  const contentRe =
    /CONTENT[\s\S]*?QUESTION[\s\S]*?TITLE:\s*([\s\S]*?)\nQUESTION:\s*([\s\S]*?)\nANSWER:\s*([\s\S]*?)\nPAGE(?:S)?:\s*([^\n]+)\n/gi

  // Collect 'In which book' entries
  let questionNum = 0
  for (let m; (m = inWhichBookRe.exec(fullText)); ) {
    const [, rawQ, rawTitle, rawAuthor, rawPages] = m
    questionNum++
    inWhichBook.push({
      number: questionNum,
      type: 'inWhichBook',
      question: normalize(rawQ),
      answerTitle: normalize(rawTitle),
      answerAuthor: normalize(rawAuthor),
      pages: parsePages(rawPages),
      points: undefined,
    })
  }

  // Collect 'Content question' entries
  questionNum = 0
  for (let m; (m = contentRe.exec(fullText)); ) {
    const [, rawTitle, rawQ, rawA, rawPages] = m
    questionNum++
    content.push({
      number: questionNum,
      type: 'content',
      title: normalize(rawTitle),
      question: normalize(rawQ),
      answer: normalize(rawA),
      pages: parsePages(rawPages),
      points: undefined,
    })
  }

  return { inWhichBook, content }
}
