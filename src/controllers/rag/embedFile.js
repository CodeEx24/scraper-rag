/*
  This endpoint (embedText) loads a text file, splits it into manageable chunks,
  generates embeddings for each chunk using OpenAI, and stores the embeddings in Pinecone vector database.
  Steps:
    1. Load the text file from the provided filePath.
    2. Split the text into overlapping chunks for better embedding.
    3. Generate embeddings for each chunk using OpenAI's embedding model.
    4. Store the embedded chunks in Pinecone with unique IDs.
    5. Return a success response if all steps succeed.
*/
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { vectorStore } from '../../lib/pinecone.js';

export const embedText = async (req, res) => {
  const body = req.body || {};
  const { filePath = '\n\n' } = body;

  if (!filePath) return res.status(400).json({ error: 'filePath is required' });

  try {
    // 1. Load the data from the file
    const loader = new TextLoader(filePath);
    const docs = await loader.load();

    // 2. Split the data into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splittedDocs = await textSplitter.splitDocuments(docs);

    // 3. Initialize OpenAI embeddings
    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-ada-002',
    });

    // 4. Store data in Pinecone
    const numberIds = generateNumberStrings(splittedDocs.length);
    await vectorStore.addDocuments(splittedDocs, embeddings, {
      ids: numberIds,
    });

    // 5. Return the chunks and their IDs
    res.json({ success: true, message: 'Embedded the products successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Embedding failed' });
  }
};

function generateNumberStrings(arrayLength) {
  return Array.from({ length: arrayLength }, (_, i) => (i + 1).toString());
}
