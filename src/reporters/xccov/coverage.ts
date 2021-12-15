import {
  FileCoverageOptions,
  CommonCoverageMapData,
  CoverageReporterType,
  FileCoverage,
} from '../../common/interface';
import { CoverageData as XccovCoverageData } from './model';
import * as util from '../../util';

export class XccovFileCoverage implements FileCoverage {
  async into(coverageFile: string, options: FileCoverageOptions = {}): Promise<CommonCoverageMapData> {
    const content = util.readFile(coverageFile);
    if (!this.check(content)) {
      throw new Error(`Invalid xccov coverage reporter: ${coverageFile}`);
    }
    const data: XccovCoverageData = await util.xml2json(content);
    const caseInsensitive = !!options.caseInsensitive;
    const commonCoverage = {};
    if (!data.coverage.file) {
      return commonCoverage;
    }
    for (const file of data.coverage.file) {
      const filePath = util.getFilePath(file.$.path, caseInsensitive);
      commonCoverage[filePath] = {
        path: filePath,
        lineMap: {},
      };
      if (!file.lineToCover) {
        continue;
      }
      for (const line of file.lineToCover) {
        const lineNumber = parseInt(line.$.lineNumber);
        const hits = line.$.covered === 'true' ? 1 : 0;
        commonCoverage[filePath].lineMap[lineNumber] = {
          lineNumber,
          hits,
        };
      }
    }
    return commonCoverage
  }

  check(content: string): boolean {
    return content.indexOf('lineToCover') !== -1;
  }

  getType(): CoverageReporterType {
    return 'xccov';
  }
}
