import * as fs from 'fs';
import { Unicov } from '../src';

describe('Test Unicov.', () => {
  test('Test fromJson.', async () => {
    const unicov = new Unicov();
    const commonCoverage = await unicov.fromCoverage('./test/fixtures/json-coverage.json', 'json');
    const commonCoverageContent = fs.readFileSync('./test/fixtures/common-coverage.json').toString();
    expect(commonCoverage).toEqual(JSON.parse(commonCoverageContent));
  });

  test('Test fromCobertura.', async () => {
    const unicov = new Unicov();
    const commonCoverage = await unicov.fromCoverage('./test/fixtures/cobertura-coverage.xml', 'cobertura');
    const commonCoverageContent = fs.readFileSync('./test/fixtures/common-coverage.json').toString();
    expect(commonCoverage).toEqual(JSON.parse(commonCoverageContent));
  });

  test('Test coverage file not found.', async () => {
    const unicov = new Unicov();
    await expect(unicov.fromCoverage('./test/fixtures/x.json', 'json'))
      .rejects
      .toThrow('Coverage file not found: ./test/fixtures/x.json');
  });

  test('Test invalid json coverage file.', async () => {
    const unicov = new Unicov();
    await expect(unicov.fromCoverage('./test/fixtures/invalid-json-coverage.json', 'json'))
      .rejects
      .toThrow('Invalid json coverage reporter: ./test/fixtures/invalid-json-coverage.json');
  });

  test('Test invalid cobertura coverage file.', async () => {
    const unicov = new Unicov();
    await expect(unicov.fromCoverage('./test/fixtures/invalid-cobertura-coverage.xml', 'cobertura'))
      .rejects
      .toThrow('Invalid cobertura coverage reporter: ./test/fixtures/invalid-cobertura-coverage.xml');
  });
});
