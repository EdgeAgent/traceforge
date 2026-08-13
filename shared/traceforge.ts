export const SECTORS = [
  "Mining",
  "Advanced Manufacturing",
  "Construction",
  "Agri-Food",
] as const;

export type Sector = (typeof SECTORS)[number];

export type ReviewStatus = "auto-approved" | "needs-review" | "approved" | "rejected";

export type PipelineAnalysis = {
  id: string;
  sector: Sector;
  input: string;
  signal: string;
  confidence: number;
  reasoning: string[];
  recommendedAction: string;
  reviewStatus: ReviewStatus;
  createdAt: string;
  annotation?: string;
};

export const SECTOR_CONFIG: Record<Sector, { eyebrow: string; description: string; prompt: string; criteria: string[]; accent: string }> = {
  Mining: {
    eyebrow: "Operational integrity",
    description: "Surface safety and equipment signals from shift notes before they become incidents.",
    prompt: "A haul truck operator reports intermittent brake response on a wet ramp after the night shift.",
    criteria: ["Worker safety", "Asset criticality", "Escalation urgency"],
    accent: "amber",
  },
  "Advanced Manufacturing": {
    eyebrow: "Quality intelligence",
    description: "Turn line observations into consistent, reviewable quality and maintenance decisions.",
    prompt: "Press line 04 shows a drift in torque readings during the final 20 minutes of the run.",
    criteria: ["Process deviation", "Product risk", "Containment path"],
    accent: "cyan",
  },
  Construction: {
    eyebrow: "Site awareness",
    description: "Make site observations more actionable with evidence, context, and clear ownership.",
    prompt: "A supervisor observes pooled water beside a temporary electrical distribution box near the north access.",
    criteria: ["Site hazard", "Public exposure", "Corrective action"],
    accent: "violet",
  },
  "Agri-Food": {
    eyebrow: "Cold-chain assurance",
    description: "Connect floor observations to food safety, traceability, and practical next steps.",
    prompt: "Receiving staff record a 3.8°C temperature excursion for a pallet of fresh dairy during unloading.",
    criteria: ["Food safety", "Traceability", "Disposition decision"],
    accent: "emerald",
  },
};

export function analyzeEvidence(input: string, sector: Sector): Omit<PipelineAnalysis, "id" | "createdAt"> {
  const normalized = input.toLowerCase();
  const highRisk = ["brake", "electrical", "fire", "leak", "temperature", "excursion", "injury", "crack", "failure", "spill"].some(term => normalized.includes(term));
  const confidence = highRisk ? 0.86 : input.trim().length > 48 ? 0.74 : 0.58;
  const signal = highRisk ? "Priority condition detected" : "Routine condition with incomplete evidence";
  const recommendedAction = highRisk
    ? "Pause the affected activity, preserve the evidence trail, and route to a qualified human reviewer within the current shift."
    : "Capture one more observation or measurement, then re-run the analysis before taking an operational decision.";
  const reasoning = [
    `Context locked to ${sector}; evaluation criteria: ${SECTOR_CONFIG[sector].criteria.join(", ")}.`,
    highRisk ? "A safety, quality, or compliance-sensitive signal appears in the field evidence." : "The evidence contains a plausible operational signal but lacks enough detail for a high-confidence decision.",
    "The recommendation is intentionally reversible and keeps a human in the loop for consequential action.",
  ];
  return { sector, input, signal, confidence, reasoning, recommendedAction, reviewStatus: confidence < 0.75 ? "needs-review" : "auto-approved" };
}
