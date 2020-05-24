
import { MongoClient } from '../deps.js'

const client = new MongoClient();
client.connectWithUri("mongodb://localhost:27017");

const db = client.database("denoTesting");
const products = db.collection("products");

// @desc Get all products  
// @route GET/api/v1/products 
const getProducts = async ({ response }) => {
    const productList = await products.find({})
    response.body = {
        success: true,
        data: productList,
    }
}

// @desc Get a product  
// @route GET/api/v1/products/:id 
const getProduct = ({ params, response }) => {
    console.log('HELLO DENO', params)

}

// @desc Add a product
// @route POST/api/v1/products
const addProduct = async ({ request, response, params }) => {
    const body = await request.body();
    const { name, price } = body.value;
    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'no data'
        }
    } else {
        const isExist = await products.find({ name })
        if (isExist) {
            response.status = 401;
            response.body = {
                success: false,
                msg: 'that product already exist',
                data: isExist
            }
        } else {
            await products.insertOne({
                name: name,
                price: price,
                createdAt: new Date()
            })
            response.body = {
                success: true,
                data: { name, price },
                msg: `${name} was added to product list`
            }
        }
    }
}

// @desc    Update product
// @route   PUT /api/v1/products/:id
const updateProduct = async ({ params, request, response }) => { console.log(params, 'hello') }

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
const deleteProduct = async ({ params, response }) => { }


export { getProducts, getProduct, addProduct, updateProduct, deleteProduct }
