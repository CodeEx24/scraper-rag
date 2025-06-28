import { Router } from 'express';
import { embedText } from '../controllers/rag/embedFile.js';
import { retrieveRagAnswer } from '../controllers/rag/retrieveRag.js';

const router = Router();

router.post('/embed', embedText);
router.post('/retrieve-rag', retrieveRagAnswer);

export default router;
