import { checkSnapshot, checkOutputSnapshot } from "./util";

import { Unicov } from "../src";
import { CoberturaReporter } from "../src/reporters/cobertura/CoberturaReporter";

describe("CoberturaReporter", () => {
  test("Parsing", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/cobertura-coverage.xml",
      "cobertura"
    );
    checkSnapshot(unicov, "common-cobertura-coverage");
  });

  test("Formatting", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/lcov.info",
      "lcov",
      { caseInsensitive: true }
    );
    checkOutputSnapshot(unicov, "cobertura", "cobertura-output.xml");
  });

  test("Formatting with Project Root", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/lcov.info",
      "lcov"
    );
    unicov.getCoverageData().projectRoot = "/tmp";
    checkOutputSnapshot(unicov, "cobertura", "cobertura-output-projroot.xml");
  });

  test("Test invalid cobertura coverage file.", async () => {
    await expect(
      Unicov.fromCoverage(
        "./test/fixtures/invalid-cobertura-coverage.xml",
        "cobertura"
      )
    ).rejects.toThrow("Invalid cobertura coverage reporter");
  });
});
