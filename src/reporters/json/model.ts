export interface CoverageMapData {
  [key: string]: FileCoverageData;
}

export interface FileCoverageData {
  path: string;
  statementMap: StatementMap;
  fnMap: FnMap;
  branchMap: BranchMap;
  s: StatementCounter;
  f: FnCounter;
  b: BranchCounter;
  inputSourceMap: any;
}

export interface StatementMap {
  [key: string]: Range;
}

export interface FnMap {
  [key: string]: FunctionMapping;
}

export interface BranchMap {
  [key: string]: BranchMapping;
}

export interface StatementCounter {
  [key: string]: number;
}

export interface FnCounter {
  [key: string]: number;
}

export interface BranchCounter {
  [key: string]: number[];
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
