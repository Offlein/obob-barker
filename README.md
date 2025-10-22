# OBOB Barker

The "OBOB Barker" app is a proof-of-concept standalone app meant to make moderating rounds within the Oregon Battle of the Books (OBOB) easier.

The app, once hosted on a server, runs entirely in the user's browser. No data is transmitted from the user to any other server, making it as secure as the desktop visiting it.

Users must have a PDF copy of the OBOB question set _and_ a backup set for the round they are moderating.

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