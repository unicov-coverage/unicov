# unicov

Transforms coverage into an unify coverage format.

Supported coverage reporter types:

* json
* cobertura
* jacoco

## Installation

```shell script
$ npm i @nullcc/unicov
```

## Usage

Parsing single coverage in `json` format:

```typescript
import { Unicov } from '@nullcc/unicov';

const unicov = await Unicov.fromCoverage('./coverage.json', 'json');
const commonCoverage = unicov.getCoverageData();

// using commonCoverage...
```

Parsing multi coverages in `json` format:

```typescript
import { Unicov } from '@nullcc/unicov';

const unicov = await Unicov.fromCoverages(['./coverage.json'], 'json');
const commonCoverage = unicov.getCoverageData();

// using commonCoverage...
```

## Publish

```shell script
$ npm publish --access public
```
