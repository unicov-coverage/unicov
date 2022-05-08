import { checkSnapshot, checkOutputSnapshot } from "./util";

import { Unicov } from "../src";

describe("Xccov parsing and formatting", () => {
  test("Xccov parsing", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/xccov-coverage.xml",
      "xccov"
    );
    checkSnapshot(unicov, "xccov-coverage");
  });

  test("Xccov parsing with case insensitivity", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/xccov-coverage.xml",
      "xccov",
      { caseInsensitive: true }
    );
    checkSnapshot(unicov, "xccov-coverage");
  });

  test("Xccov invalid file", async () => {
    await expect(
      Unicov.fromCoverage("./test/fixtures/jacoco-coverage.xml", "xccov")
    ).rejects.toThrow("Invalid xccov coverage reporter");
  });

  test("Xccov empty file", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/xccov-empty.xml",
      "xccov"
    );
    expect(unicov.getCoverageData()).toEqual({
      files: [],
    });
  });

  test("Xccov formatting", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/lcov.info",
      "lcov"
    );
    checkOutputSnapshot(unicov, "xccov", "xml");
  });
});
