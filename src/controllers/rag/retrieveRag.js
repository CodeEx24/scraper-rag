/*
  This endpoint (retrieveRagAnswer) retrieves relevant context from a vector store using a user query,
  runs a Retrieval-Augmented Generation (RAG) chain with a custom prompt and LLM to generate an answer,
  and returns both the retrieved context and the generated answer.
  Steps:
    1. Retrieve relevant documents from the vector store
    2. Set up the RAG chain with the LLM and prompt
    3. Retrieve context and run the RAG chain
*/
import { PromptTemplate } from '@langchain/core/prompts';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { vectorStore } from '../../lib/pinecone.js';
import { llm } from '../../lib/llm.js';
import { ragPrompt } from '../../llm/prompts/ragPrompt.js';

export const retrieveRagAnswer = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'query is required' });

  try {
    // 1. Retrieve relevant documents from the vector store
    const retriever = vectorStore.asRetriever({
      k: 10,
    });

    // 2. Set up the RAG chain with the LLM and prompt
    const customRagPrompt = PromptTemplate.fromTemplate(ragPrompt);
    const customRagChain = await createStuffDocumentsChain({
      llm: llm,
      prompt: customRagPrompt,
      outputParser: new StringOutputParser(),
    });

    // 3. Retrieve context and run the RAG chain
    const context = await retriever.invoke(query);
    const dataRes = await customRagChain.invoke({
      question: query,
      context,
    });

    res.json({ context, dataRes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
