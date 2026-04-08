type BriefingOutput = {
  summary: string;
  companySnapshot: string[];
  riskSignals: string[];
  growthSignals: string[];
  talkingPoints: string[];
  sources: Array<{ title: string; url: string; sourceType: string }>;
};

function fallbackBriefing(agencyName: string, city: string, state: string): BriefingOutput {
  return {
    summary: `${agencyName} is a ${city}, ${state} insurance prospect. This AI fallback draft highlights likely discovery angles until live web-enriched research is enabled.`,
    companySnapshot: [
      `${agencyName} is being profiled as a regional insurance operation in ${city}, ${state}.`,
      "Current profile relies on user-provided inputs and heuristic synthesis.",
    ],
    riskSignals: [
      "Public-source verification is not enabled yet; assumptions may be incomplete.",
      "Carrier concentration and retention pressure should be validated in discovery.",
    ],
    growthSignals: [
      "Potential expansion opportunities likely tied to local SMB and middle-market demand.",
      "Cross-sell potential across commercial lines and employee benefits may exist.",
    ],
    talkingPoints: [
      "Ask about top-performing verticals and upcoming renewal concentration.",
      "Explore appetite for data-driven producer enablement and pipeline visibility.",
    ],
    sources: [
      {
        title: `${agencyName} profile placeholder`,
        url: "https://example.com/placeholder-source",
        sourceType: "AI_SYNTHESIS",
      },
    ],
  };
}

export async function generateBriefing(agencyName: string, city: string, state: string): Promise<BriefingOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

  if (!apiKey) {
    return fallbackBriefing(agencyName, city, state);
  }

  const prompt = `Create a concise sales prospect briefing for an insurance agency with this input:\nAgency: ${agencyName}\nCity: ${city}\nState: ${state}\n\nReturn strict JSON with keys: summary, companySnapshot (string[]), riskSignals (string[]), growthSignals (string[]), talkingPoints (string[]), sources (array of {title,url,sourceType}). Keep each list 2-4 bullets and keep sources as placeholders if exact links are unknown.`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "briefing",
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["summary", "companySnapshot", "riskSignals", "growthSignals", "talkingPoints", "sources"],
            properties: {
              summary: { type: "string" },
              companySnapshot: { type: "array", items: { type: "string" } },
              riskSignals: { type: "array", items: { type: "string" } },
              growthSignals: { type: "array", items: { type: "string" } },
              talkingPoints: { type: "array", items: { type: "string" } },
              sources: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["title", "url", "sourceType"],
                  properties: {
                    title: { type: "string" },
                    url: { type: "string" },
                    sourceType: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    return fallbackBriefing(agencyName, city, state);
  }

  const data = (await response.json()) as {
    output_text?: string;
  };

  if (!data.output_text) {
    return fallbackBriefing(agencyName, city, state);
  }

  try {
    return JSON.parse(data.output_text) as BriefingOutput;
  } catch {
    return fallbackBriefing(agencyName, city, state);
  }
}
