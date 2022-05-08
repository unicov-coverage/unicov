import { create } from "xmlbuilder2";

import {
  ParseOptions,
  CommonCoverage,
  CoverageReporterType,
  Reporter,
  FileCoverage,
} from '../../common/interface';

import { CoverageData as CloverCoverageData } from './model';
import * as util from '../../util';

export class CloverReporter implements Reporter {
  async parse(content: string, options: ParseOptions = {}): Promise<CommonCoverage> {
    if (!this.check(content)) {
      throw new Error("Invalid clover coverage reporter");
    }
    const data: CloverCoverageData = await util.xml2json(content);
    const caseInsensitive = !!options.caseInsensitive;
    const commonCoverage: CommonCoverage = {files: []};
    for (const project of data.coverage.project) {
      for (const pkg of project.package) {
        for (const file of pkg.file) {
          const filePath = util.getFilePath(file.$.path, caseInsensitive);
          if (!file.line) {
            continue;
          }
          const fileCoverage: FileCoverage = {
            path: filePath,
            lines: []
          }
          commonCoverage.files.push(fileCoverage)
          file.line.forEach(line => {
            const lineNumber = parseInt(line.$.num);
            const hits = parseInt(line.$.count);
            fileCoverage.lines.push({
              number: lineNumber,
              hits,
              branches: []
            });
          });
        }
      }
    }
    return commonCoverage;
  }

  format(coverage: CommonCoverage): string {
    const root = create({ version: "1.0" });
    const cov = root.ele("coverage");
    cov.att(null, "clover", "3.2.0");
    cov.att(null, "generated", String(+ new Date()));
    const project = cov.ele("project");
    const pkg = project.ele("package"); 
    for (const fileCoverage of coverage.files) {
      const file = pkg.ele("file");
      file.att(null, "path", fileCoverage.path);
      for (const lineCoverage of fileCoverage.lines) {
        const line = file.ele("line");
        line.att(null, "num", String(lineCoverage.number));
        line.att(null, "count", String(lineCoverage.hits));
      }
    }
    return root.end({prettyPrint: true});
  }

  check(content: string): boolean {
    return content.indexOf("clover=\"") !== -1;
  }

  type(): CoverageReporterType {
    return "clover";
  }

  extension(): string {
    return "xml";
  }
}
