import { Unicov } from "../src";

describe("Error handling", () => {
  test("Test unknown coverage reporter.", async () => {
    await expect(
      Unicov.fromCoverage(
        "./test/fixtures/istanbul-coverage.json",
        "xxx" as any
      )
    ).rejects.toThrow("Unknown coverage reporter 'xxx'");
  });

  test("Test coverage file not found.", async () => {
    await expect(
      Unicov.fromCoverage("./test/fixtures/x.json", "istanbul")
    ).rejects.toThrow("Coverage file not found: ./test/fixtures/x.json!");
  });

  test("Test coverage file not found with detectReporter.", async () => {
    expect(() => Unicov.detectReporter("./test/fixtures/x.json")).toThrow(
      "Coverage file not found: ./test/fixtures/x.json!"
    );
  });

  test("Test undetectable coverage file", () => {
    expect(() => Unicov.detectReporter("./test/fixtures/empty.xml")).toThrow(
      "Can't auto detect coverage reporter type for coverage file: ./test/fixtures/empty.xml!"
    );
  });

  test("Unknown reporter type passed to toFile()", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/istanbul-coverage.json"
    );
    // @ts-expect-error
    expect(() => unicov.toFile("coverage.xml", "foobar")).toThrow(
      "Reporter not found for type 'foobar'"
    );
  });

  test("Error thrown if attempting to get overall coverage without data", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/istanbul-coverage.json"
    );
    // @ts-expect-error
    unicov.setCoverageData(null);
    expect(() => unicov.getOverallLineCoverage()).toThrow(
      "Failed to get overall coverage rate: coverage data is null."
    );
  });
});
