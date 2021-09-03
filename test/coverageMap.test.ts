import * as fs from 'fs';
import { CommonCoverageMap } from '../src';

describe('Test CommonCoverageMap.', () => {
  test('Test fromJson.', async () => {
    const commonCoverageMap = new CommonCoverageMap();
    const commonCoverage = await commonCoverageMap.fromJson('./test/fixtures/json-coverage.json');
    const commonCoverageContent = fs.readFileSync('./test/fixtures/common-coverage.json').toString();
    expect(commonCoverage).toEqual(JSON.parse(commonCoverageContent));
  });

  test('Test fromCobertura.', async () => {
    const commonCoverageMap = new CommonCoverageMap();
    const commonCoverage = await commonCoverageMap.fromCobertura('./test/fixtures/cobertura-coverage.xml');
    const commonCoverageContent = fs.readFileSync('./test/fixtures/common-coverage.json').toString();
    expect(commonCoverage).toEqual(JSON.parse(commonCoverageContent));
  });

  test('Test coverage file not found.', async () => {
    const commonCoverageMap = new CommonCoverageMap();
    await expect(commonCoverageMap.fromJson('./test/fixtures/x.json'))
      .rejects
      .toThrow('Coverage file not found: ./test/fixtures/x.json');
  });

  test('Test invalid json coverage file.', async () => {
    const commonCoverageMap = new CommonCoverageMap();
    await expect(commonCoverageMap.fromJson('./test/fixtures/invalid-json-coverage.json'))
      .rejects
      .toThrow('Invalid json coverage reporter: ./test/fixtures/invalid-json-coverage.json');
  });

  test('Test invalid cobertura coverage file.', async () => {
    const commonCoverageMap = new CommonCoverageMap();
    await expect(commonCoverageMap.fromCobertura('./test/fixtures/invalid-cobertura-coverage.xml'))
      .rejects
      .toThrow('Invalid cobertura coverage reporter: ./test/fixtures/invalid-cobertura-coverage.xml');
  });
});
