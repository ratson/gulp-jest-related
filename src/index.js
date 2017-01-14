import {getPackageRoot} from 'jest-util'
import getJest from 'jest-cli/build/cli/getJest'

import {PluginError} from 'gulp-util'
import through2 from 'through2'

export default (opts = {}) => {
  const argv = {
    findRelatedTests: true,
    ...opts,
    _: [],
  }
  return through2.obj((file, enc, cb) => {
    if (file.isNull()) {
      cb(null, file)
      return
    }
    if (file.isStream()) {
      cb(new PluginError('gulp-jest-related', 'Streaming not supported'))
      return
    }
    argv._.push(file.path)
    cb(null, file)
  }, (cb) => {
    const root = getPackageRoot()
    getJest(root).runCLI(argv, root, ({numFailedTests, numFailedTestSuites}) => {
      if (numFailedTests || numFailedTestSuites) {
        cb(new PluginError('gulp-jest-related', 'Tests Failed'))
        return
      }
      cb()
    })
  })
}
