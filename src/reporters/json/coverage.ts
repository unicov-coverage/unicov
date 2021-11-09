import * as _ from 'lodash';
import { createCoverageMap } from 'istanbul-lib-coverage';
import { SourceMapConsumer } from 'source-map';
import {
  FileCoverageOptions,
  CommonCoverageMapData,
  CoverageReporterType,
  FileCoverage,
} from '../../common/interface';
import {
  CoverageMapData as JsonCoverageMapData,
  StatementMap,
  StatementCounter,
} from './model';
import * as util from '../../util';

const transformer = require('istanbul-lib-source-maps/lib/transformer');

export class JsonFileCoverage implements FileCoverage {
  async into(coverageFile: string, options: FileCoverageOptions = {}): Promise<CommonCoverageMapData> {
    const content = util.readFile(coverageFile);
    if (!this.check(content)) {
      throw new Error(`Invalid json coverage reporter: ${coverageFile}`);
    }
    const data = await this.getSourceCodeCoverage(JSON.parse(content));
    const caseInsensitive = !!options.caseInsensitive;
    const commonCoverage = {};
    for (const key in data) {
      const filePath = util.getFilePath(data[key].path, caseInsensitive);
      commonCoverage[filePath] = {
        path: filePath,
        lineMap: {},
      };
      const statementMap = data[key].statementMap;
      const statementCounter = data[key].s;
      this.processStatementMap(filePath, commonCoverage, statementMap, statementCounter);
    }
    return commonCoverage;
  }

  check(content: string): boolean {
    return content.indexOf('statementMap') !== -1;
  }

  getType(): CoverageReporterType {
    return 'json';
  }

  private getRandomProperty(coverageMapData: JsonCoverageMapData) {
    const keys = Object.keys(coverageMapData);
    if (keys.length === 0) {
      return undefined;
    }
    return coverageMapData[keys[(keys.length * Math.random()) << 0]];
  }

  private async getSourceCodeCoverage(coverageMapData: JsonCoverageMapData): Promise<JsonCoverageMapData> {
    const data = {};
    const randomFileCov = this.getRandomProperty(coverageMapData);
    if (randomFileCov === undefined) {
      return coverageMapData;
    }
    if (!randomFileCov.inputSourceMap) { // it's source code coverage data already, just return
      return coverageMapData;
    }
    for (const key in coverageMapData) {
      const fileCov = coverageMapData[key];
      const coverageMap = createCoverageMap({});
      coverageMap.addFileCoverage(fileCov);
      const finder = await new SourceMapConsumer(fileCov.inputSourceMap);
      const mapped = transformer.create(() => finder).transform(coverageMap);
      Object.assign(data, mapped.data);
    }
    return data;
  };

  private processStatementMap(filePath: string, commonCoverage: any, statementMap: StatementMap, statementCounter: StatementCounter) {
    for (const key in statementMap) {
      const range = statementMap[key];
      const startLine = range.start.line;
      const endLine = range.end.column === null ? range.start.line : range.end.line;
      const hits = statementCounter[key];
      _.range(startLine, endLine + 1).forEach(lineNumber => {
        commonCoverage[filePath].lineMap[lineNumber] = {
          number: lineNumber,
          hits,
        };
      });
    }
  }
}