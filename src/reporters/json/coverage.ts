import fs from 'fs';
import * as _ from 'lodash';
import { CommonCoverageMapData, FileCoverage } from '../../common/interface';
import { CoverageMapData as JsonCoverageMapData } from "./model";
import { checkFileExistence } from '../../util';

export class JsonFileCoverage implements FileCoverage {
  async into(coverageFile: string): Promise<CommonCoverageMapData> {
    if (!checkFileExistence(coverageFile)) {
      throw new Error(`Coverage file not found: ${coverageFile}`);
    }
    const content = fs.readFileSync(coverageFile).toString();
    if (!this._isJsonCoverageReporter(content)) {
      throw new Error(`Invalid json coverage reporter: ${coverageFile}`);
    }
    const data: JsonCoverageMapData = JSON.parse(content);
    const commonCoverage = {};
    for (const key in data) {
      const filePath = data[key].path;
      const statementMap = data[key].statementMap;
      const s = data[key].s;
      commonCoverage[filePath] = {
        path: filePath,
        lineMap: {},
      };
      for (const statementKey in statementMap) {
        const range = statementMap[statementKey];
        const startLine = range.start.column ? range.start.line : range.start.line + 1;
        const endLine = range.end.column ? range.end.line : range.end.line - 1;
        const hits = s[statementKey];
        _.range(startLine, endLine + 1).forEach(lineNumber => {
          commonCoverage[filePath].lineMap[lineNumber] = {
            number: lineNumber,
            hits,
          };
        });
      }
    }
    return commonCoverage;
  }

  private _isJsonCoverageReporter(content: string): boolean {
    return content.indexOf('statementMap') !== -1;
  }
}