# Product Scraper & AI Trend Analyzer

This application scrapes trending product data from TikTok Creative Center, processes the data, and uses AI (OpenAI GPT) to generate trend summaries and opportunity scores for each product. The results are stored and can be used for further analysis or displayed in a dashboard.

---

## Features

- **Automated scraping** of trending product data using Puppeteer
- **AI-powered trend summary** and **opportunity score** for each product
- **Data storage** in text files for further use
- **Retrieval-Augmented Generation (RAG)** endpoint for answering questions based on embedded product data
- **Configurable scheduling** via cron jobs

---

## Folder Structure

```
src/
  config/
    cron.js
    env.js
  controllers/
    products/
      scrapedProduct.js
    rag/
      embedFile.js
      retrieveRag.js
  lib/
    utils/
      parsePopularity.js
    llm.js
    pinecone.js
  llm/
    chains/
      trendAndOpportunityChain.js
    prompts/
      ragPrompt.js
    schemas/
      productOutput.js
  routes/
    product.routes.js
    rag.routes.js
  trending/
    products.txt
.env
index.js
package.json
```

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/CodeEx24/scraper-rag
   cd scraper-rag
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following content:

   ```env
   PORT=3000
   PINECONE_API_KEY=your-pinecone-api-key
   PINECONE_INDEX=your-pinecone-index-name
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Run the application:**
   ```bash
   npm start
   # or, for development with auto-reload
   npm run dev
   ```

---

## Usage

- **Scrape Products:**
  - The `/products/scrape` endpoint scrapes trending products and generates AI summaries and scores.
- **Embed Endpoint:**
  - The `/rag/embed` endpoint allows you to embed a text file into the vector store for RAG. Use a POST request with a JSON body containing `filePath` (the path to your text file). Example:
    ```json
    {
      "filePath": "./src/trending/products.txt"
    }
    ```
- **RAG Endpoint:**
  - The `/rag/retrieve` endpoint allows you to ask questions about the embedded product data.
    ```json
    {
      "query": "What are the hign demand products?"
    }
    ```

---

## Notes

- Make sure you have valid API keys for OpenAI and Pinecone.
- The application uses Puppeteer, which may require additional dependencies on some systems (e.g., Chromium libraries).
- All scraped and processed data is saved in `src/trending/products.txt`.

---
