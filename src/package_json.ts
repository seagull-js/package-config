import { noop } from 'lodash'
import Config from './config'

export interface IPackageJson {
  seagull: Config
}

export class PackageJson {
  /**
   * Seagull-specific configuration
   */
  config: Config

  /**
   * Your app name
   */
  name: string

  constructor(private path?: string) {
    process.env.config_mock ? this.loadFromMock() : this.loadFromFile()
  }

  /**
   * Add a domain to your app, will be integrated into cloudfront
   *
   * @param domain your domain name, like 'example.com
   */
  addDomain(domain: string): void {
    this.config.addDomain(domain)
    this.save()
  }

  /**
   * enable google analytics tracking and save setting to package.json
   *
   * @param gaCode ID of your google analytics property, like: 'UA-XXXXXX'
   */
  enableAnalytics(gaCode: string): void {
    this.config.enableAnalytics(gaCode)
    this.save()
  }

  /**
   * save all changes from this.config to package file
   */
  private save(): void {
    const pkg = JSON.parse(require('fs').readFileSync(this.path, 'utf-8'))
    pkg.seagull = this.config
    require('fs').writeFileSync(this.path, JSON.stringify(pkg, null, 2))
  }

  // dirty trick to load mocked data
  private loadFromMock() {
    const cfg = new Config()
    const { name, seagull } = JSON.parse(process.env.config_mock)
    this.name = name
    this.config = Object.assign(cfg, seagull)
  }

  // load an actual file
  private loadFromFile() {
    !this.path ? (this.path = `${process.cwd()}/package.json`) : noop()
    const cfg = new Config()
    const file = require('fs').readFileSync(this.path, 'utf-8')
    const { name, seagull } = JSON.parse(file)
    this.name = name
    this.config = Object.assign(cfg, seagull)
  }

  private guessFilePath() {
    const { AWS_EXECUTION_ENV, LAMBDA_TASK_ROOT, NODE_ENV } = process.env
    // most common case: used within a lambda function
    const isLambda = LAMBDA_TASK_ROOT && AWS_EXECUTION_ENV
    const lambdaPath = '/var/task/package.json'
    !this.path && isLambda ? (this.path = lambdaPath) : noop()
    // special usecase: load in functional tests
    const isTest = NODE_ENV === 'test'
    const testPath = '../../../../../__tmp__/.seagull/package.json'
    !this.path && isTest ? (this.path = testPath) : noop()
    // special usecase: load in devserver
    const appPath = '../../../../../.seagull/package.json'
    !this.path ? (this.path = appPath) : noop()
  }
}
