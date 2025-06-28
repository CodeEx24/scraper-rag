/*
  This endpoint (scrapedProducts) scrapes trending product data from a web page using Puppeteer,
  generates a trend summary and opportunity score for each product using an LLM chain,
  saves the results to a file, and returns the enhanced product data in the response.
  Steps:
    1. Scrape trending products from the provided or default URL.
    2. For each product, generate a trend summary and opportunity score using the LLM chain.
    3. Save the enhanced product data to a file.
    4. Return the product data output in the API response.
*/
import puppeteer from 'puppeteer';
import { setTimeout } from 'node:timers/promises';
import fs from 'fs/promises';
import { trendAndOpportunityChain } from '../../llm/chains/trendAndOpportunityChain.js';

async function scrapeTrendingProducts(url, maxPages) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--window-size=1920,1080',
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    defaultViewport: null,
  });
  const page = await browser.newPage();
  let allProducts = [];

  try {
    // 1. Scrape the web page for trending products
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
    await page.setViewport({ width: 1920, height: 1080 });
    await setTimeout(5000);
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    let shouldContinue = true;
    for (
      let pageCount = 1;
      pageCount <= maxPages && shouldContinue;
      pageCount++
    ) {
      await page.waitForSelector(
        '.byted-Table-Implement tbody .byted-Table-Row',
        { timeout: 60000 }
      );
      const products = await page.evaluate(() => {
        const rows = document.querySelectorAll(
          '.byted-Table-Implement tbody .byted-Table-Row'
        );
        const data = [];

        rows.forEach((row) => {
          const cols = row.querySelectorAll('.byted-Table-Cell');
          if (cols.length >= 13) {
            const titleEl = cols[0].querySelector(
              '.CategoryTrendListTable_categoryName__UZkSM'
            );
            const categoryEl = cols[0].querySelector(
              '.CategoryTrendListTable_categoryLevel__tnnmA'
            );

            const name = titleEl?.textContent?.trim() || '';
            const category = categoryEl?.textContent?.trim() || '';

            const popularity = cols[1]?.textContent?.trim() || '';
            const popularityChange = cols[2]?.textContent?.trim() || '';

            const ctr = cols[3]?.textContent?.trim() || '';
            const cvr = cols[4]?.textContent?.trim() || '';
            const cpa = cols[5]?.textContent?.trim() || '';
            const cost = cols[6]?.textContent?.trim() || '';
            const likes = cols[7]?.textContent?.trim() || '';
            const shares = cols[8]?.textContent?.trim() || '';
            const comments = cols[9]?.textContent?.trim() || '';
            const impressions = cols[10]?.textContent?.trim() || '';
            const sixSecViewRate = cols[11]?.textContent?.trim() || '';
            const detailsUrlLink = cols[12]?.querySelector('a')?.href || '';

            const description = `🛍️ ${name}
- Popularity Score: ${popularity}
- Popularity Change: ${popularityChange}
- Click Through Rate (CTR): ${ctr}
- Conversion Rate (CVR): ${cvr}
- Cost Per Acquisition (CPA): ${cpa}
- Total Cost: ${cost}
- Engagement:
  • Likes: ${likes}
  • Shares: ${shares}
  • Comments: ${comments}
- Impressions: ${impressions}
- 6s View Rate: ${sixSecViewRate}

🔗 More Info: ${detailsUrlLink}
📦 Category: ${category}
🏷️ Title Group: ${name}`;

            data.push({
              name,
              category,
              popularity,
              ctr,
              cvr,
              cpa,
              cost,
              likes,
              shares,
              comments,
              impressions,
              sixSecViewRate,
              popularityChange,
              detailsUrlLink,
              description,
            });
          }
        });

        return data;
      });

      const isDuplicate = products.some((product) =>
        allProducts.some(
          (existing) =>
            existing.name === product.name &&
            existing.detailsUrlLink === product.detailsUrlLink
        )
      );
      if (isDuplicate) {
        shouldContinue = false;
        break;
      }

      const newProducts = products.filter(
        (product) =>
          !allProducts.some(
            (existing) =>
              existing.name === product.name &&
              existing.detailsUrlLink === product.detailsUrlLink
          )
      );
      allProducts = allProducts.concat(newProducts);

      const nextButton = await page.$('button.PaginationButton_right__ryHTY');
      if (!nextButton) break;
      const isDisabled = await page.evaluate(
        (btn) => btn.disabled || btn.getAttribute('aria-disabled') === 'true',
        nextButton
      );
      if (isDisabled) break;
      await nextButton.click();
      await setTimeout(5000);
    }
    await browser.close();
    return allProducts;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

async function generateTrendSummaryAndOpportunityScore(description) {
  // 2. Generate trend summary and opportunity score using the LLM chain
  const response = await trendAndOpportunityChain.invoke({
    question: description,
  });
  return {
    trendSummary: response.trendSummary,
    opportunityScore: response.opportunityScore,
  };
}

export const scrapedProducts = async (req, res) => {
  const url =
    req.query.url ||
    'https://ads.tiktok.com/business/creativecenter/top-products/pc/en';
  const maxPages = parseInt(req.query.pageCount, 10) || 1;
  try {
    // 1. Scrape trending products
    const products = await scrapeTrendingProducts(url, maxPages);

    // 2. For each product, generate summaries and scores
    const productsWithAI = [];
    for (const product of products) {
      const description = product.description;
      const { trendSummary, opportunityScore } =
        await generateTrendSummaryAndOpportunityScore(description);
      productsWithAI.push({
        ...product,
        trendSummary,
        opportunityScore,
      });
    }

    // 3. Save the enhanced product data to a file
    await fs.writeFile(
      './src/trending/products.txt',
      productsWithAI
        .map(
          (p) =>
            `${p.description}\nTrend Summary: ${p.trendSummary}\nOpportunity Score: ${p.opportunityScore}`
        )
        .join('\n\n'),
      'utf-8'
    );

    // 4. Return the enhanced product data in the API response
    res.status(200).json({ products: productsWithAI });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Scraping failed', error: err.message });
  }
};
