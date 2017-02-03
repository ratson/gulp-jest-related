import debug from 'debug'
import {getPackageRoot} from 'jest-util'
import getJest from 'jest-cli/build/cli/getJest'

import {PluginError} from 'gulp-util'
import through2 from 'through2'

const log = debug('gulp-jest-related')

export default (opts = {}) => {
  const argv = {
    findRelatedTests: true,
    ...opts,
    _: [],
  }
  return through2.obj((file, enc, cb) => {
    if (file.isNull()) {
      log('file is null')
      cb(null, file)
      return
    }
    if (file.isStream()) {
      cb(new PluginError('gulp-jest-related', 'Streaming not supported'))
      return
    }
    log(`add file ${file.path}`)
    argv._.push(file.path)
    cb(null, file)
  }, (cb) => {
    if (argv._.length === 0) {
      log('skip jest')
      cb()
      return
    }
    const root = getPackageRoot()
    log(`run jest at root ${root} with ${argv._}`)
    getJest(root).runCLI(argv, root, ({numFailedTests, numFailedTestSuites}) => {
      if (numFailedTests || numFailedTestSuites) {
        cb(new PluginError('gulp-jest-related', 'Tests Failed'))
        return
      }
      cb()
    })
  })
}
