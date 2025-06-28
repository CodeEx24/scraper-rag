import 'dotenv/config';

export const ENV = {
  PORT: process.env.PORT || 3000,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_INDEX: process.env.PINECONE_INDEX,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};
