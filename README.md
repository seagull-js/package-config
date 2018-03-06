# Seagull Package Config

[![Build Status](https://travis-ci.org/seagull-js/package-config.svg?branch=master)](https://travis-ci.org/seagull-js/package-config)
[![npm version](https://badge.fury.io/js/%40seagull%2Fpackage-config.svg)](https://badge.fury.io/js/%40seagull%2Fpackage-config)
[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](http://www.gnu.org/licenses/lgpl-3.0)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

Seagull leverages the default `package.json` file every node.js has for its own
configurations. All settings reside in the `seagull` property and the access to
these data fields is encapsulated through this module.

## Example Usage

```typescript
import { PackageJson } from '@seagull/package-config'

const pkg = new PackageJson('/path/to/file')
pkg.addDomain('example.com')
pkg.enableAnalytics('UA-XXXXXXX')

pkg.hasAnalytics // => true
```
