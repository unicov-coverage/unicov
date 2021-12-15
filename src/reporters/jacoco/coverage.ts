import path from 'path';
import {
  FileCoverageOptions,
  CommonCoverageMapData,
  CoverageReporterType,
  FileCoverage,
} from '../../common/interface';
import { CoverageData as JacocoCoverageData } from './model';
import * as util from '../../util';

export class JacocoFileCoverage implements FileCoverage {
  async into(coverageFile: string, options: FileCoverageOptions = {}): Promise<CommonCoverageMapData> {
    const content = util.readFile(coverageFile);
    if (!this.check(content)) {
      throw new Error(`Invalid jacoco coverage reporter: ${coverageFile}`);
    }
    const data: JacocoCoverageData = await util.xml2json(content);
    const caseInsensitive = !!options.caseInsensitive;
    const commonCoverage = {};
    for (const pkg of data.report.package) {
      const pkgDir = pkg.$.name;
      for (const sourceFile of pkg.sourcefile) {
        const filePath = util.getFilePath(path.join(pkgDir, sourceFile.$.name), caseInsensitive);
        commonCoverage[filePath] = {
          path: filePath,
          lineMap: {},
        };
        if (!sourceFile.line) {
          continue;
        }
        for (const line of sourceFile.line) {
          const lineNumber = parseInt(line.$.nr, 10);
          const missedInstructions = parseInt(line.$.mi, 10);
          const coveredInstructions = parseInt(line.$.ci, 10);
          const missedBranches = parseInt(line.$.mb, 10);
          const coveredBranches = parseInt(line.$.cb, 10);
          const isBranch = missedBranches > 0 || coveredBranches > 0;
          let hits = 0;
          if (isBranch) {
            hits = coveredBranches > 0 ? 1 : 0;
          } else {
            hits = coveredInstructions > 0 ? 1 : 0;
          }
          commonCoverage[filePath].lineMap[lineNumber] = {
            lineNumber,
            hits,
          };
        }
      }
    }
    return commonCoverage;
  }

  check(content: string): boolean {
    return content.indexOf('JACOCO') !== -1;
  }

  getType(): CoverageReporterType {
    return 'jacoco';
  }
}
