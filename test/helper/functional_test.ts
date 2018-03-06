import * as mockFS from 'mock-fs'

export default class UnitTest {
  // file system mocks
  mockFolder = path => mockFS({ [path]: {} })
  mockPackageFile = (path, file, txt) => mockFS({ [path]: { [file]: txt } })
  restoreFolder = () => mockFS.restore()

  // lambda env mocks
  mockLambdaEnv = () => {
    process.env.LAMBDA_TASK_ROOT = true
    process.env.AWS_EXECUTION_ENV = true
  }
  restoreLambdaEnv = () => {
    delete process.env.LAMBDA_TASK_ROOT
    delete process.env.AWS_EXECUTION_ENV
  }
}
