export type InWhichBookQuestion = {
  type: "in-which-book";
  question: string;
  answerTitle: string;
  answerAuthor: string;
  pages: number[];
};

export type ContentQuestion = {
  type: "content";
  title: string;
  question: string;
  answer: string;
  pages: number[];
};

export type QuestionSet = {
  inWhichBook: InWhichBookQuestion[];
  content: ContentQuestion[];
};
