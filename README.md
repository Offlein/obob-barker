# OBOB Barker

The "OBOB Barker" app is a proof-of-concept standalone app meant to make moderating rounds within the Oregon Battle of the Books (OBOB) easier.

The app, once hosted on a server, runs entirely in the user's browser. No data is transmitted from the user to any other server, making it as secure as the desktop visiting it.

Users must have a PDF copy of the OBOB questionset _and_ a backup set for the round they are moderating.

Questionsets are expected to be PDFs generated from the official (confidential) OBOB PDFs. They are expected to be exactly 4 pages, each with 4 questions on them. The first
two pages should be "In Which Book" questions, and the latter two should be "Content" questions. It is easy to collate the "one big questionset" using [a simple Python script
like this one](https://gist.github.com/Offlein/6d37a59b6b699a6d96fcbd3e5ab3401b). (But the variables would need to be tweaked depending on the number of question sets and
introduction pages and stuff!)

## Project Setup

The app is simple and requires Node 20+.

Packages can be installed the standard way:

```sh
npm install
```

### Development

A dev server runs through Vite:

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

The app builds the standard way and then can be hosted through any webserver.

```sh
npm run build
```

## Questionset Checker

The app also contains a command line tool used to ensure the validity of the questionsets the main app will read. (We'd hate to have you get into a competition and find the
app can't read your questions!)

It is expected to be run one time on all the OBOB questionset PDFs prior to running a competition.

#### How to run the Questionset Checker:

1. Put PDFs in the src/cli/questionsets folder
2. Change to the root of the project, install the dependencies, and run the script:

```shell
cd /path/to/obob-barker
npm install
npm run check-questionsets
```

The system will read through all files with extension `.pdf` in the above directory and confirm the following:

- The PDF is a valid PDF
- The PDF contains exactly 4 "In Which Book" questions
- The PDF contains exactly 4 "Content" questions.
- The text/answer of each question is valid.

If there are any discrepancies, it will print them out as it's parsing, and then summarize at the end a list of PDFs which had issues. (Hopefully none!)

## Other Notes

This project uses pnpm internally; npm and yarn users can still install and run scripts normally. There's a pnpm-lock.yaml file but no package-lock.json for this reason. It should
not negatively affect you running it with NPM or Yarn.
