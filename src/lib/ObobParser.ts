import type { InWhichBookQuestionType, ContentQuestionType, QuestionSet } from '@/types/ObobTypes'

// Thanks, ChatGPT, for working with me to do most of the bitch-work! //
export function parseQuestionSet(fullText: string, isBackup = false): QuestionSet {
  const normalize = (s: string) =>
    s
      .replace(/\s*\n\s*/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()

  const parsePages = (s: string): number[] =>
    s
      .split(/[;,]/)
      .map((t) => parseInt(t.trim(), 10))
      .filter((n) => Number.isFinite(n))

  // IMPORTANT: do NOT require the section headers; anchor on the label lines.
  const inWhichBookRe =
    /(?:IN[\s\S]*?WHICH[\s\S]*?BOOK[\s\S]*?QUESTION[\s\S]*?)?QUESTION:\s*([\s\S]*?)\nANSWER\s*\(TITLE\):\s*([\s\S]*?)\nANSWER\s*\(AUTHOR\):\s*([\s\S]*?)\nPAGES?:\s*([^\n]+)\n/gi

  const contentRe =
    /(?:CONTENT[\s\S]*?QUESTION[\s\S]*?)?TITLE:\s*([\s\S]*?)\nQUESTION:\s*([\s\S]*?)\nANSWER:\s*([\s\S]*?)\nPAGES?:\s*([^\n]+)\n/gi

  // Parse in extraction order
  const inWhichRaw: Omit<InWhichBookQuestionType, 'number' | 'teamNumber'>[] = []
  const contentRaw: Omit<ContentQuestionType, 'number' | 'teamNumber'>[] = []

  for (let m; (m = inWhichBookRe.exec(fullText)); ) {
    const [, rawQ, rawTitle, rawAuthor, rawPages] = m
    inWhichRaw.push({
      type: 'inWhichBook',
      questionSet: isBackup ? 'backup' : 'main',
      question: normalize(rawQ!),
      answerTitle: normalize(rawTitle!),
      answerAuthor: normalize(rawAuthor!),
      pages: parsePages(rawPages!),
      score: {
        1: { points: undefined, wrongAnswer: undefined },
        2: { points: undefined, wrongAnswer: undefined },
      },
    })
  }

  for (let m; (m = contentRe.exec(fullText)); ) {
    const [, rawTitle, rawQ, rawA, rawPages] = m
    contentRaw.push({
      type: 'content',
      questionSet: isBackup ? 'backup' : 'main',
      title: normalize(rawTitle!),
      question: normalize(rawQ!),
      answer: normalize(rawA!),
      pages: parsePages(rawPages!),
      score: {
        1: { points: undefined, wrongAnswer: undefined },
        2: { points: undefined, wrongAnswer: undefined },
      },
    })
  }

  // Reorder per physical page: [1,3,2,4] -> [1,2,3,4]
  const inWhichOrdered = reorderQuadrants(inWhichRaw, 4)
  const contentOrdered = reorderQuadrants(contentRaw, 4)

  // Assign numbering + teamNumber after final order
  const inWhichBook: InWhichBookQuestionType[] = inWhichOrdered.map((q, idx) => {
    const number = idx + 1
    return {
      ...q,
      number,
      teamNumber: number % 2 === 0 ? 2 : 1,
    }
  })

  const content: ContentQuestionType[] = contentOrdered.map((q, idx) => {
    const number = idx + 1
    return {
      ...q,
      number,
      teamNumber: number % 2 === 0 ? 2 : 1,
    }
  })

  return { inWhichBook, content }
}

function reorderQuadrants<T>(items: T[], groupSize = 4): T[] {
  // input order per page: 1,3,2,4 (TL, BL, TR, BR)
  // desired:              1,2,3,4 (TL, TR, BL, BR)
  const out: T[] = []
  for (let i = 0; i < items.length; i += groupSize) {
    const chunk = items.slice(i, i + groupSize)
    if (chunk.length < groupSize) {
      // If the last chunk is incomplete, keep it as-is.
      out.push(...chunk)
      continue
    }
    // [0,1,2,3] -> [0,2,1,3]
    out.push(chunk[0], chunk[2], chunk[1], chunk[3])
  }
  return out
}
