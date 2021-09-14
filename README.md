# unicov

Transforms coverage into an unify coverage format.

Supported coverage reporters:

* json
* cobertura
* jacoco

## Installation

```shell script
$ npm i @nullcc/unicov
```

## Usage

Parsing coverage in `json` format:

```typescript
import { Unicov } from '@nullcc/unicov';

const unicov = await Unicov.fromCoverage('./coverage.json', 'json');
const commonCoverage = unicov.getCoverageData();

// using commonCoverage...
```

Parsing coverage in `cobertura` format:

```typescript
import { Unicov } from '@nullcc/unicov';

const unicov = await Unicov.fromCoverage('./coverage.xml', 'cobertura');
const commonCoverage = unicov.getCoverageData();

// using commonCoverage...
```

Parsing coverage in `jacoco` format:

```typescript
import { Unicov } from '@nullcc/unicov';

const unicov = await Unicov.fromCoverage('./coverage.xml', 'jacoco');
const commonCoverage = unicov.getCoverageData();

// using commonCoverage...
```

## Publish

```shell script
$ npm publish --access public
```
