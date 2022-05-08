import { Unicov } from "../src";

describe("Coverage metrics", () => {
  test("Test getOverallLineCoverage.", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/jacoco-coverage.xml"
    );
    expect(unicov.getOverallLineCoverage()).toEqual({
      branchCoverageRate: 0.25,
      coveredBranches: 1,
      coveredLines: 3,
      uncoveredBranches: 3,
      uncoveredLines: 10,
      lineCoverageRate: 0.23076923076923078,
    });
  });

  test("Test getFileLineCoverage.", async () => {
    const unicov = await Unicov.fromCoverage(
      "./test/fixtures/jacoco-coverage.xml"
    );
    const path = "com/wmbest/myapplicationtest/MainActivity.java";
    expect(unicov.getFileLineCoverage(path, 8)).toEqual(0);
    expect(unicov.getFileLineCoverage(path, 11)).toEqual(1);
    expect(unicov.getFileLineCoverage(path, 6)).toEqual(0);
    expect(unicov.getFileLineCoverage("xxx.ts", 3)).toEqual(0);

    const unicov1 = await Unicov.fromCoverage(
      "./test/fixtures/istanbul-coverage.json",
      "istanbul"
    );
    unicov1.setCoverageData(null as any);
    expect(unicov1.getFileLineCoverage("xxx.ts", 3)).toEqual(0);
  });
});
