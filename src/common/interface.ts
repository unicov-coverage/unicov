export type CoverageReporterType = 'json' | 'cobertura';

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
