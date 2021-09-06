import * as fs from 'fs';
import { Unicov } from '../src';

describe('Test Unicov.', () => {
  test('Test fromJson.', async () => {
    const unicov = new Unicov();
    const commonCoverage = await unicov.fromJson('./test/fixtures/json-coverage.json');
    const commonCoverageContent = fs.readFileSync('./test/fixtures/common-coverage.json').toString();
    expect(commonCoverage).toEqual(JSON.parse(commonCoverageContent));
  });

  test('Test fromCobertura.', async () => {
    const unicov = new Unicov();
    const commonCoverage = await unicov.fromCobertura('./test/fixtures/cobertura-coverage.xml');
    const commonCoverageContent = fs.readFileSync('./test/fixtures/common-coverage.json').toString();
    expect(commonCoverage).toEqual(JSON.parse(commonCoverageContent));
  });

  test('Test coverage file not found.', async () => {
    const unicov = new Unicov();
    await expect(unicov.fromJson('./test/fixtures/x.json'))
      .rejects
      .toThrow('Coverage file not found: ./test/fixtures/x.json');
  });

  test('Test invalid json coverage file.', async () => {
    const unicov = new Unicov();
    await expect(unicov.fromJson('./test/fixtures/invalid-json-coverage.json'))
      .rejects
      .toThrow('Invalid json coverage reporter: ./test/fixtures/invalid-json-coverage.json');
  });

  test('Test invalid cobertura coverage file.', async () => {
    const unicov = new Unicov();
    await expect(unicov.fromCobertura('./test/fixtures/invalid-cobertura-coverage.xml'))
      .rejects
      .toThrow('Invalid cobertura coverage reporter: ./test/fixtures/invalid-cobertura-coverage.xml');
  });
});
