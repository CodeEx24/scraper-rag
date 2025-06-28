import { z } from 'zod';

export const productOutputParser = z.object({
  trendSummary: z.string().describe('The trend summary of the product.'), // The reviewed text must be a  string
  opportunityScore: z
    .number()
    .describe('The 1-10 opportunity score of the product data'),
});
