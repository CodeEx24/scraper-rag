export const trendAndOppurtunityScorePrompt = `
    You are an expert product trend analyst. 
    
    Based on the product trend data provided below, do the following:
    1. Write a concise but insightful trend summary of the product. Summarize any notable growth, platform activity, or performance indicators.
    2. Give an "opportunityScore" between 1 and 10 based on the product’s popularity, growth, engagement, and conversion potential.
    
    Output your response in this strict JSON format:
    {{
      "trendSummary": string, // Required. A short 1–2 sentence summary.
      "opportunityScore": number // Required. A number from 1 to 10.
    }}
    Only return the JSON. Do not include any explanations or extra text.
    `;
