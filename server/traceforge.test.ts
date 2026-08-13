import { describe, expect, it } from "vitest";
import { analyzeEvidence } from "../shared/traceforge";

describe("TraceForge evidence analysis", () => {
  it("routes consequential evidence to human review when confidence is low", () => {
    const result = analyzeEvidence("A short note mentions a small issue.", "Construction");
    expect(result.sector).toBe("Construction");
    expect(result.confidence).toBeLessThan(0.75);
    expect(result.reviewStatus).toBe("needs-review");
    expect(result.reasoning.length).toBe(3);
  });

  it("produces a high-confidence, bounded action for a safety-sensitive signal", () => {
    const result = analyzeEvidence("Standing water beside a temporary electrical box near the access route.", "Construction");
    expect(result.confidence).toBeGreaterThanOrEqual(0.75);
    expect(result.recommendedAction).toContain("qualified human reviewer");
    expect(result.signal).toBe("Priority condition detected");
  });
});
