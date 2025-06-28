// src/llm/chains/trendAndOpportunityChain.js
import { PromptTemplate } from '@langchain/core/prompts';
import { llm } from '../../lib/llm.js';
import { productOutputParser } from '../schemas/productOutput.js';
import { trendAndOppurtunityScorePrompt } from '../prompts/trendAndOpportunityScorePrompt.js';

const prompt = PromptTemplate.fromTemplate(
  `${trendAndOppurtunityScorePrompt}
  ===
  Product Data: {question}`
);

const llmTrendAndScoreOutput = llm.withStructuredOutput(productOutputParser, {
  method: 'functionCalling',
  name: 'withStructuredOutput',
});

export const trendAndOpportunityChain = prompt.pipe(llmTrendAndScoreOutput);
