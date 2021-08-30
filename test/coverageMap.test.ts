import * as fs from 'fs';
import { CommonCoverageMap } from '../src/common/coverageMap';

describe('Test CommonCoverageMap.', () => {
  test('Test fromJson.', async () => {
    const commonCoverageMap = new CommonCoverageMap();
    const commonCoverage = commonCoverageMap.fromJson('./test/fixtures/json-coverage.json');
    const commonCoverageContent = fs.readFileSync('./test/fixtures/common-coverage.json').toString();
    expect(commonCoverage).toEqual(JSON.parse(commonCoverageContent));
  });

  test('Test fromCobertura.', async () => {
    const commonCoverageMap = new CommonCoverageMap();
    const commonCoverage = await commonCoverageMap.fromCobertura('./test/fixtures/cobertura-coverage.xml');
    const commonCoverageContent = fs.readFileSync('./test/fixtures/common-coverage.json').toString();
    expect(commonCoverage).toEqual(JSON.parse(commonCoverageContent));
  });
});
