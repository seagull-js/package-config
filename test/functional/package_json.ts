import { PackageJson } from '@lib'
import { expect } from 'chai'
import { writeFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import Test from '../helper/functional_test'

const cwd = process.cwd()

@suite('PackageJsonTest')
class FunctionalTest extends Test {
  after() {
    this.restoreFolder()
    this.restoreLambdaEnv()
    process.chdir(cwd)
  }

  @test
  'can load within lambda execution context'() {
    this.mockLambdaEnv()
    const mock = { seagull: { domains: ['example.com'] } }
    this.mockPackageFile('/var/task/', 'package.json', JSON.stringify(mock))
    process.chdir('/var/task')
    const pkg = new PackageJson()
    pkg.config.should.be.an('object')
    pkg.config.domains.should.be.an('array')
    pkg.config.domains[0].should.be.equal('example.com')
  }

  @test
  'can load specific file'() {
    const mock = { seagull: { domains: ['example.com'] } }
    this.mockPackageFile('/tmp', 'package.json', JSON.stringify(mock))
    const pkg = new PackageJson('/tmp/package.json')
    pkg.config.should.be.an('object')
    pkg.config.domains.should.be.an('array')
    pkg.config.domains[0].should.be.equal('example.com')
  }

  @test
  'can enable analytics and save changes to file'() {
    const mock = { seagull: { domains: ['example.com'] } }
    this.mockPackageFile('/tmp', 'package.json', JSON.stringify(mock))
    new PackageJson('/tmp/package.json').enableAnalytics('UA-XXXXXX')
    const pkg = new PackageJson('/tmp/package.json')
    pkg.config.hasAnalytics().should.be.equal(true)
  }

  @test
  'can add domains and save changes to file'() {
    const mock = { seagull: { domains: ['example.com'] } }
    this.mockPackageFile('/tmp', 'package.json', JSON.stringify(mock))
    new PackageJson('/tmp/package.json').addDomain('example.com')
    const pkg = new PackageJson('/tmp/package.json')
    pkg.config.domains.should.be.an('array')
    pkg.config.domains[0].should.be.equal('example.com')
  }
}
