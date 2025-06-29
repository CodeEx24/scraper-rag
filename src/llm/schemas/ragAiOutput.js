import { z } from 'zod';

const productSchema = z.object({
  title: z.string().describe('Short title or name of the product'),
  popularityScore: z
    .number()
    .describe('Popularity score as a number (e.g., 6000)'),
  popularityChange: z
    .number()
    .describe('Popularity change in percentage (e.g., 13 for 13%)'),
  ctr: z
    .number()
    .describe('Click Through Rate as a percentage (e.g., 5.39 for 5.39%)'),
  cvr: z
    .number()
    .describe('Conversion Rate as a percentage (e.g., 5.12 for 5.12%)'),
  cpa: z.number().describe('Cost Per Acquisition (e.g., 0.98 for $0.98)'),
  totalCost: z.number().describe('Total cost spent (e.g., 23000 for $23,000)'),
  engagement: z.object({
    likes: z.number().describe('Number of likes'),
    shares: z.number().describe('Number of shares'),
    comments: z.number().describe('Number of comments'),
  }),
  impressions: z.number().describe('Impressions count'),
  viewRate6s: z
    .number()
    .describe('6-second view rate as a percentage (e.g., 16.29 for 16.29%)'),
  category: z.string().describe('Category or taxonomy path'),
  titleGroup: z.string().describe('Title group or keyword grouping'),
  link: z.string().url().describe('Link to the product detail page'),
  trendSummary: z.string().describe('A summary explaining the trend'),
  opportunityScore: z.number().describe('Opportunity score between 1 and 10'),
});

export const ragAiOutputParser = z.object({
  message: z
    .string()
    .describe('The final answer or message in paragraph form.'),
  products: z
    .array(productSchema)
    .describe('List of products with their detailed structured data.'),
});
