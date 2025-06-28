import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone';
import { ENV } from '../config/env.js';

const client = new PineconeClient();

export const vectorStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings({
    openAIApiKey: ENV.OPENAI_API_KEY,
    model: 'text-embedding-ada-002',
  }),
  { pineconeIndex: client.Index(ENV.PINECONE_INDEX) }
);
