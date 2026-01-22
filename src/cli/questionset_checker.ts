/// <reference types="node" />
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import { parseQuestionSet } from '../lib/ObobParser.ts'
import { PDFParse, type TextResult } from 'pdf-parse'
import type { QuestionSet } from '@/types/ObobTypes.ts'

const issuesSet = new Set()

const start = async () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const questionsDir = path.join(__dirname, 'questionsets')

  const pdfs = fs
    .readdirSync(questionsDir, { withFileTypes: true })
    .filter(entry =>
      entry.isFile() &&
      entry.name.toLowerCase().endsWith('.pdf')
    )
    .map(entry => path.join(questionsDir, entry.name))

  console.log(`Found ${pdfs.length} PDFs.`)

  for (const pdf of pdfs) {
    console.log(`\nChecking ${pdf}...`)
    await checkPdf(pdf)
  }

  if (issuesSet.size > 0) {
    console.log(`Found ${issuesSet.size} issues. Here are the PDFs with issues:`)
    for (const pdf of issuesSet) {
      console.log(` - ${pdf}`)
    }
  } else {
    console.log(`\nDone. Everything looks good!`)
  }
}

const checkPdf = async (pdf: string) => {
  const buffer = fs.readFileSync(pdf)
  const parser = new PDFParse({ data: buffer })
  const textObj = await parser.getText()

  console.log(` | PDF Parser detected ${textObj.pages.length} pages.`)
  checkPageValidity(textObj, pdf)

  const parsed = parseQuestionSet(textObj.text)
  checkQuestionCountValidity(parsed, pdf)
  checkQuestionDataValidity(parsed, pdf)
}

const checkPageValidity = (textObj: TextResult, pdf: string) => {
  if (textObj.pages.length !== 4) {
    console.error(` * Unexpected number of pages detected!`)
    issuesSet.add(pdf)
  }
}

const checkQuestionCountValidity = (parsed: QuestionSet, pdf: string) => {
  const countInWhichBook = parsed.inWhichBook.length
  const countContent = parsed.content.length
  console.log(` | Found ${countInWhichBook} "In Which Book" Questions and ${countContent} "Content" questions.`)
  if (countInWhichBook !== 8 || countContent !== 8) {
    console.error(` * PDF ${ pdf } does not contain exactly 16 questions. Something is wrong!`)
    issuesSet.add(pdf)
  }
}

const checkQuestionDataValidity = (parsed: QuestionSet, pdf: string) => {
  checkInWhichBookQuestionDataValidity(parsed, pdf)
  checkContentQuestionDataValidity(parsed, pdf)
}

// Ensure no missing data in "In Which Book" questions.
const checkInWhichBookQuestionDataValidity = (parsed: QuestionSet, pdf: string) => {
  for (const [,question] of parsed.inWhichBook.entries()) {
    if (question.question.length < 3 || question.answerTitle.length < 3 || question.answerAuthor.length < 2) {
      console.error(` * Some data was parsed incorrectly in this question!`)
      issuesSet.add(pdf)
    }
  }
}

// Ensure no missing data in "Content" questions.
const checkContentQuestionDataValidity = (parsed: QuestionSet, pdf: string) => {
  for (const [,question] of parsed.content.entries()) {
    if (question.question.length < 3 || question.title.length < 3 || question.answer.length < 1) {
      console.error(` * Some data was parsed incorrectly in this question!`)
      issuesSet.add(pdf)
    }
  }
}

start()
