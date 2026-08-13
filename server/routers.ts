import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { SECTORS } from "@shared/traceforge";
import { invokeLLM } from "./_core/llm";
import { createInferenceRun, listInferenceRuns, reviewInferenceRun } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const analysisSchema = { type: "object", properties: { signal: { type: "string" }, confidence: { type: "number" }, reasoning: { type: "array", items: { type: "string" } }, recommendedAction: { type: "string" } }, required: ["signal", "confidence", "reasoning", "recommendedAction"], additionalProperties: false };

export const appRouter = router({
  system: systemRouter,
  auth: router({ me: publicProcedure.query(opts => opts.ctx.user), logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }) }),
  traceforge: router({
    listRuns: publicProcedure.query(() => listInferenceRuns()),
    analyzeEvidence: publicProcedure.input(z.object({ input: z.string().min(8).max(2000), sector: z.enum(SECTORS) })).mutation(async ({ input }) => {
      const response = await invokeLLM({ messages: [{ role: "system", content: "You are TraceForge, an auditable industrial AI analyst. Analyze field evidence conservatively. Never invent measurements. Return only JSON matching the schema. Confidence must be between 0 and 1. Reasoning must be a concise, observable evidence chain, not hidden chain-of-thought." }, { role: "user", content: `Sector: ${input.sector}\nField evidence: ${input.input}` }], response_format: { type: "json_schema", json_schema: { name: "traceforge_analysis", strict: true, schema: analysisSchema } } });
      const raw = response.choices?.[0]?.message?.content; const parsed = JSON.parse(typeof raw === "string" ? raw : "{}"); const confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0)); const run = await createInferenceRun({ publicId: `tf-${Date.now().toString(36)}`, sector: input.sector, input: input.input, signal: String(parsed.signal), confidence: confidence.toFixed(4), reasoning: JSON.stringify(parsed.reasoning), recommendedAction: String(parsed.recommendedAction), reviewStatus: confidence < .75 ? "needs-review" : "auto-approved" });
      if (!run) throw new Error("Inference could not be persisted");
      return { id: run.publicId, sector: input.sector, input: input.input, signal: String(parsed.signal), confidence, reasoning: parsed.reasoning as string[], recommendedAction: String(parsed.recommendedAction), reviewStatus: confidence < .75 ? "needs-review" as const : "auto-approved" as const, createdAt: run.createdAt.toISOString() };
    }),
    reviewRun: publicProcedure.input(z.object({ publicId: z.string(), action: z.enum(["approve", "reject", "annotate"]), annotation: z.string().max(2000).optional() })).mutation(({ input, ctx }) => reviewInferenceRun(input.publicId, input.action, input.annotation, ctx.user?.name ?? "Public reviewer")),
  }),
});
export type AppRouter = typeof appRouter;
