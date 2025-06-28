import { Router } from 'express';
import { scrapedProducts } from '../controllers/products/scrapedProduct.js';

const router = Router();

router.get('/scrape', scrapedProducts);

export default router;
