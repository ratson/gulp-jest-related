# gulp-jest-related

[Gulp](https://github.com/gulpjs/gulp) plugin for running [Jest](https://github.com/facebook/jest) related tests.

## Installation

```
npm install gulp-jest-related --save-dev
```

## Usage

Run related tests, e.g. `app.test.js`

```js
import gulp from 'gulp'
import jest from 'gulp-jest-related'

gulp.task('jest', () => gulp
  .src('app.js')
  .pipe(jest({
    // CLI options
    coverage: true,
  })))
```
