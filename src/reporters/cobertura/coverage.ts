import fs from 'fs';
import path from 'path';
import { parseString } from 'xml2js';
import { CommonCoverageMapData, FileCoverage } from '../../common/interface';
import { CoverageData as CoberturaCoverageData } from './model';
import { checkFileExistence } from '../../util';

export class CoberturaFileCoverage implements FileCoverage {
  async into(coverageFile: string): Promise<CommonCoverageMapData> {
    if (!checkFileExistence(coverageFile)) {
      throw new Error(`Coverage file not found ${coverageFile}!`);
    }
    const content = fs.readFileSync(coverageFile).toString();
    if (!this._isCoberturaCoverageReporter(content)) {
      throw new Error(`Invalid cobertura coverage reporter: ${coverageFile}`);
    }
    const data: CoberturaCoverageData = await this._xml2json(content);
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

  private _isCoberturaCoverageReporter(content: string): boolean {
    return content.indexOf('cobertura') !== -1;
  }

  private async _xml2json(content: string): Promise<any> {
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