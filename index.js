import express from 'express';
import productRoutes from './src/routes/product.routes.js';
import embedRoutes from './src/routes/rag.routes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/rag', embedRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
