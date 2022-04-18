import { Unicov } from "../src";
import { checkSnapshot, checkOutputSnapshot } from "./util";

describe("Instanbul JSON parsing", () => {
  test("JSON parsing (caseInsensitive)", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/istanbul-coverage.json",
      "istanbul",
      { caseInsensitive: true }
    );
    checkSnapshot(unicov, "common-json-coverage-case-insensitive");
  });
  test("JSON parsing (default)", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/istanbul-coverage.json",
      "istanbul"
    );
    checkSnapshot(unicov, "common-json-coverage");
  });
  test("JSON formatting (not implemented)", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/istanbul-coverage.json",
      "istanbul"
    );
    checkOutputSnapshot(unicov, "istanbul", "istanbul-output.json");
  });
  test("Invalid istanbul coverage file.", async () => {
    await expect(
      Unicov.fromCoverage(
        "./test/fixtures/invalid-json-coverage.json",
        "istanbul"
      )
    ).rejects.toThrow("Invalid json coverage reporter");
  });
});
