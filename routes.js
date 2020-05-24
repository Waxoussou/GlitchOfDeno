import { Router } from './deps.js';
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from './controllers/products.js'

const router = new Router();

router.get('/api/v1/products', getProducts)
    .get('/api/v1/products/:id', getProduct)
    .post('/api/v1/products', addProduct)
    .put('/api/v1/products/:id', updateProduct)
    .delete('/api/v1/products/:id', deleteProduct)

    .get("/book/:id", (context) => {
        console.log(context.params, context.params.id)
    });


export default router;