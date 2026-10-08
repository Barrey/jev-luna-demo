import type { ScenarioQuestion } from "../data/scenarios";

const JEV_MODEL = "typesafe/jev-1.13";
const LUNA_MODEL = "openai/gpt-6-luna-decisions";

// Helper to convert local image asset to base64 Data URL for Vision LLM
async function urlToBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Error converting image to base64:", err);
    return "";
  }
}

export interface LiveDecisionResult {
  decision: string;
  confidence: number;
  reasoning: string;
  typesafeOutput: Record<string, unknown>;
  latencyMs?: number;
  modelUsed: string;
}

export async function askLiveOpenRouter(
  question: ScenarioQuestion,
  modelType: "jev" | "gpt-6-luna-decisions"
): Promise<LiveDecisionResult> {
  const startTime = Date.now();
  const apiKey =
    (import.meta.env.VITE_JEV_API_KEY as string) ||
    (import.meta.env.VITE_GPT6_LUNA_DECISIONS as string) ||
    "";

  if (!apiKey) {
    throw new Error("Missing OpenRouter API Key in environment variables.");
  }

  const isLuna = modelType === "gpt-6-luna-decisions";
  const modelId = isLuna ? LUNA_MODEL : JEV_MODEL;

  // Construct structured criteria dictionary for Decisions API
  const criteria: Record<string, string> = {};
  for (const opt of question.options) {
    let desc = opt.label;
    if (opt.sublabel) desc += ` (${opt.sublabel})`;
    if (opt.price) desc += ` [Price: ${opt.price}]`;
    if (opt.badge) desc += ` [Badge: ${opt.badge}]`;
    criteria[opt.id] = desc;
  }

  // Construct state context (supports multimodal text + images)
  const referenceText = question.reference
    ? (typeof question.reference === "string" ? question.reference : JSON.stringify(question.reference))
    : "";

  const hasImages = question.options.some((o) => Boolean(o.image));
  let statePayload: unknown;

  if (hasImages) {
    const parts: Array<{ type: string; text?: string; image_url?: { url: string; detail?: string } }> = [];
    if (referenceText) {
      parts.push({ type: "text", text: `Reference Context: ${referenceText}` });
    }
    for (let i = 0; i < question.options.length; i++) {
      const opt = question.options[i];
      if (opt.image) {
        const base64Data = await urlToBase64(opt.image);
        if (base64Data) {
          parts.push({
            type: "text",
            text: `[Candidate Option ${opt.id}: ${opt.label}]`
          });
          parts.push({
            type: "image_url",
            image_url: { url: base64Data, detail: "low" }
          });
        }
      }
    }
    statePayload = parts.length > 0 ? parts : (referenceText || question.question);
  } else {
    statePayload = referenceText || question.question;
  }

  // Call the official Native OpenRouter Decisions API
  const response = await fetch("https://openrouter.ai/api/alpha/decisions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "Jev & Luna Decisions Demo"
    },
    body: JSON.stringify({
      model: modelId,
      state: statePayload,
      questions: {
        decision: {
          type: "choice",
          instructions: question.question,
          criteria
        }
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter Decisions API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;

  interface DecisionAnswer {
    type?: string;
    choice?: string;
    confidence?: number;
    probabilities?: Record<string, number>;
  }

  const decisionAnswer: DecisionAnswer | undefined = data.answers?.decision;
  const resolvedOptionId = decisionAnswer?.choice || "";
  const confidence =
    typeof decisionAnswer?.confidence === "number" ? decisionAnswer.confidence : 0.95;
  const probabilities = (decisionAnswer?.probabilities || {}) as Record<string, number>;

  // Build transparent mathematical reasoning based on probabilities
  const probSummary = Object.entries(probabilities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id, p]) => `${id}: ${(p * 100).toFixed(0)}%`)
    .join(", ");

  const reasoning = probSummary
    ? `Engine evaluated '${resolvedOptionId}' with ${(confidence * 100).toFixed(1)}% confidence. Probabilities: ${probSummary}`
    : `Engine evaluated '${resolvedOptionId}' with ${(confidence * 100).toFixed(1)}% confidence.`;

  const matchedOption = question.options.find((o) => o.id === resolvedOptionId);

  return {
    decision: resolvedOptionId,
    confidence,
    reasoning,
    typesafeOutput: {
      selectedTargetId: resolvedOptionId,
      selectedLabel: matchedOption?.label || resolvedOptionId,
      probabilities,
      confidence,
      provider: data.provider || "Direct Engine",
      model: data.model || modelId,
      rawDecision: decisionAnswer,
      _meta: {
        engine: "OpenRouter Decisions API",
        provider: data.provider,
        model: data.model || modelId,
        tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        cost: data.usage?.cost,
        latencyMs
      }
    },
    latencyMs,
    modelUsed: data.model || modelId
  };
}
