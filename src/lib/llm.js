import { ChatOpenAI } from '@langchain/openai';

export const llm = new ChatOpenAI({
  model: 'gpt-4o',
  verbose: false,
});
