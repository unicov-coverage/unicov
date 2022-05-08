# unicov

A universal translator for code coverage data, offering a CLI tool (unicov) and a programmatic API for parsing and formatting coverage files.

Supported coverage formats:

* auto<sup>[1]</sup>
* clover
* cobertura
* jacoco
* json
* lcov
* xccov

[1] unicov will detect coverage type automatically

## Installation

```shell script
$ npm i @nullcc/unicov
```

## CLI Usage

```
unicov [-o <format(:path)>] [input_file] ([input file]...)

# Parses XML coverage files and writes unified output to "coverage.lcov"

# Parse files and write Jacoco-formatted output to: `./coverage.xml`
unicov -o jacoco app/_coverage/*.xml

# Parse files and write Cobertura-formatted output to `./app_coverage.xml`
unicov -o cobertura:app_coverage.xml *.lcov
```

## API Usage

Parsing single coverage in a specific type coverage:

```typescript
import { Unicov } from '@nullcc/unicov';

const unicov = await Unicov.fromCoverage('./coverage.json', 'json');
const commonCoverage = unicov.getCoverageData();

// using commonCoverage...
```

Parsing multi coverages in a specific coverage format:

```typescript
import { Unicov } from '@nullcc/unicov';

const coverageFiles = [
  './json-coverage1.json',
  './json-coverage2.json',
  './json-coverage3.json'
];
const unicov = await Unicov.fromCoverages(coverageFiles, 'json');
const commonCoverage = unicov.getCoverageData();

// using commonCoverage...
```

Parsing multi coverages automatically:

```typescript
import { Unicov } from '@nullcc/unicov';

const coverageFiles = [
  './json-coverage.json',
  './jacoco-empty-cobertura-coverage.xml',
  './cobertura-empty-cobertura-coverage.xml',
  './xccov-empty-cobertura-coverage.xml'
];

const unicov = await Unicov.fromCoverages(coverageFiles, 'auto');
const commonCoverage = unicov.getCoverageData();

// using commonCoverage...
```
## Plugin Usage

Installed plugin packages may be specified on the command line:

```
unicov --plugin "@unicov/unicov-html" --output unicov-html:coverage.html coverage/*.xml
```

There is also a programmatic interface for specifying plugins:
```
Unicov.registerPlugin("@unicov/unicov-html")
// ...
unicov.toFile("coverage.html", "unicov-html");
```

## Plugin Development

Third-party plugins can support the addition of one or more reporters.

```
// See: src/common/interface.ts
interface Reporter {
  // ...
}

// lib/MyCustomReporter.js
class MyCustomReporter implements Reporter {
  // ...
}

// lib/index.js
module.exports = {
  reporters: [new MyCustomReporter()]
};
```

## Publish

```shell script
$ npm publish --access public
```

## License

MIT
