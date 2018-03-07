import { readFileSync, writeFileSync } from 'fs'
import { noop } from 'lodash'
import Config from './config'

export interface IPackageJson {
  seagull: Config
}

export class PackageJson {
  config: Config

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
    const pkg = JSON.parse(readFileSync(this.path, 'utf-8'))
    pkg.seagull = this.config
    writeFileSync(this.path, JSON.stringify(pkg, null, 2))
  }

  // dirty trick to load mocked data
  private loadFromMock() {
    const cfg = new Config()
    const { seagull } = JSON.parse(process.env.config_mock)
    this.config = Object.assign(cfg, seagull)
  }

  // load an actual file
  private loadFromFile() {
    !this.path ? (this.path = `${process.cwd()}/package.json`) : noop()
    const cfg = new Config()
    const file = readFileSync(this.path, 'utf-8')
    const { seagull } = JSON.parse(file)
    this.config = Object.assign(cfg, seagull)
  }
}
