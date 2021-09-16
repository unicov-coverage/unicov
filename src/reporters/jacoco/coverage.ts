import fs from 'fs';
import path from 'path';
import { CommonCoverageMapData, FileCoverage } from '../../common/interface';
import { CoverageData as JacocoCoverageData } from './model';
import { xml2json } from "../../util";

export class JacocoFileCoverage implements FileCoverage {
  async into(coverageFile: string): Promise<CommonCoverageMapData> {
    const content = fs.readFileSync(coverageFile).toString();
    if (!this._isJacocoCoverageReporter(content)) {
      throw new Error(`Invalid jacoco coverage reporter: ${coverageFile}`);
    }
    const data: JacocoCoverageData = await xml2json(content);
    const commonCoverage = {};
    for (const pkg of data.report.package) {
      const pkgDir = pkg.$.name;
      for (const sourceFile of pkg.sourcefile) {
        const filePath = path.join(pkgDir, sourceFile.$.name);
        commonCoverage[filePath] = {
          path: filePath,
          lineMap: {},
        };
        if (!sourceFile.line) {
          continue;
        }
        for (const line of sourceFile.line) {
          const lineNumber = parseInt(line.$.nr);
          const hits = parseInt(line.$.ci);
          commonCoverage[filePath].lineMap[lineNumber] = {
            lineNumber,
            hits,
          };
        }
      }
    }
    return commonCoverage;
  }

  private _isJacocoCoverageReporter(content: string): boolean {
    return content.indexOf('JACOCO') !== -1;
  }
}
