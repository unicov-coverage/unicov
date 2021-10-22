import fs from 'fs';
import path from 'path';
import {CommonCoverageMapData, CoverageReporterType, FileCoverage} from '../../common/interface';
import { CoverageData as CoberturaCoverageData } from './model';
import { xml2json } from '../../util';

export class CoberturaFileCoverage implements FileCoverage {
  async into(coverageFile: string): Promise<CommonCoverageMapData> {
    const content = fs.readFileSync(coverageFile).toString();
    if (!this.check(content)) {
      throw new Error(`Invalid cobertura coverage reporter: ${coverageFile}`);
    }
    const data: CoberturaCoverageData = await xml2json(content);
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

  check(content: string): boolean {
    return content.indexOf('cobertura') !== -1;
  }

  getType(): CoverageReporterType {
    return 'cobertura';
  }
}