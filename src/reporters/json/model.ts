export interface CoverageMapData {
  [key: string]: FileCoverageData;
}

export interface FileCoverageData {
  path: string;
  statementMap: { [key: string]: Range };
  fnMap: { [key: string]: FunctionMapping };
  branchMap: { [key: string]: BranchMapping };
  s: { [key: string]: number };
  f: { [key: string]: number };
  b: { [key: string]: number[] };
}

interface Location {
  line: number;
  column: number;
}

interface Range {
  start: Location;
  end: Location;
}

interface FunctionMapping {
  name: string;
  decl: Range;
  loc: Range;
  line: number;
}

interface BranchMapping {
  loc: Range;
  type: string;
  locations: Range[];
  line: number;
}
