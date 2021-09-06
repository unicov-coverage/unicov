import * as fs from 'fs';
import path from 'path';
import { parseString } from 'xml2js';
import * as _ from 'lodash';
import { CommonCoverageMapData } from './interface';
import { CoverageMapData as JsonCoverageMapData } from '../reporters/json/model';
import { CoverageData as CoberturaCoverageData } from '../reporters/cobertura/model';

export class Unicov {
  async fromJson(coverageFile: string): Promise<CommonCoverageMapData> {
    if (!this.checkFileExistence(coverageFile)) {
      throw new Error(`Coverage file not found: ${coverageFile}`);
    }
    const content = fs.readFileSync(coverageFile).toString();
    if (!this.isJsonCoverageReporter(content)) {
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

  async fromCobertura(coverageFile: string): Promise<CommonCoverageMapData> {
    if (!this.checkFileExistence(coverageFile)) {
      throw new Error(`Coverage file not found ${coverageFile}!`);
    }
    const content = fs.readFileSync(coverageFile).toString();
    if (!this.isCoberturaCoverageReporter(content)) {
      throw new Error(`Invalid cobertura coverage reporter: ${coverageFile}`);
    }
    const data: CoberturaCoverageData = await this.xml2json(content);
    const projectRoot = data.coverage.sources[0].source[0];
    const packages = data.coverage.packages;
    const commonCoverage = {};
    for (const pkg_ of packages) {
      for (const pkg of pkg_.package) {
        for (const cls_ of pkg.classes) {
          for (const cls of cls_.class) {
            const filePath = path.join(projectRoot, cls.$.filename);
            commonCoverage[filePath] = {
              path: filePath,
              lineMap: {},
            };
            cls.lines.forEach(line => {
              line.line.forEach(line => {
                const lineNumber = parseInt(line.$.number);
                const hits = parseInt(line.$.hits);
                commonCoverage[filePath].lineMap[lineNumber] = {
                  number: lineNumber,
                  hits,
                };
              });
            });
          }
        }
      }
    }
    return commonCoverage;
  }

  private checkFileExistence(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  private isJsonCoverageReporter(content: string): boolean {
    return content.indexOf('statementMap') !== -1;
  }

  private isCoberturaCoverageReporter(content: string): boolean {
    return content.indexOf('cobertura') !== -1;
  }

  private async xml2json(content: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(content, function (err, result) {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }
}
