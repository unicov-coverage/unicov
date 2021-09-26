export type CoverageReporterType = 'json' | 'cobertura' | 'jacoco' | 'xccov';

export interface CommonCoverageMapData {
  [key: string]: CommonCoverageData;
}

export interface CommonCoverageData {
  path: string;
  lineMap: Map<string, Line>;
}

interface Line {
  number: number;
  hits: number;
}

export interface FileCoverage {
  into(coverageFile: string): Promise<CommonCoverageMapData>;
}

export interface OverallLineCoverage {
  coveredLines: number;
  uncoveredLines: number;
  overallLineCoverageRate: number;
}
