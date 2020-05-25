
import { MongoClient } from '../deps.js'
import { green, yellow } from "https://deno.land/std/fmt/colors.ts";

const client = new MongoClient();
client.connectWithUri("mongodb://localhost:27017");

const db = client.database("denoTesting");
const products = db.collection("products");

// @desc Get all products  
// @route GET/api/v1/products 
const getProducts = async ({ response }) => {
    const productList = await products.find({ price: { $lt: 3 } })
    response.body = {
        success: true,
        data: productList,
    }
}

// @desc Get a product  
// @route GET/api/v1/products/:id
const getProduct = async ({ params, response }) => {
    console.log(yellow(params.id));
    const product = await products.findOne({ _id: { "$oid": params.id } });
    if (!product) {
        response.status = 401;
        response.body = {
            success: false,
            msg: 'no product found'
        }
    } else {
        response.status = 200;
        response.body = {
            success: true,
            data: product
        }
    }
}

// @desc Add a product
// @route POST/api/v1/products
const addProduct = async ({ request, response, params }) => {
    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'no data'
        }
    } else {
        const body = await request.body({
            // contentTypes: {
            //     json: ['application/json'],
            //     form: ['json', 'multipart', 'urlencoded'],
            //     text: ['text']
            // }
        });
        const { URLSearchParamsImpl } = body.value;
        const { name, price } = body.value;
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
const updateProduct = async ({ params, request, response }) => {
    const body = await request.body({
        contentTypes: {
            form: ['json', 'application/json', 'text']
        }
    })
    const { name, price } = body.value;
    const { id } = params;
    // const product = await products.find({ _id: id });
    const updatedProduct = await products.updateOne({ _id: { "$oid": id } }, { $set: { name, price } })
    if (!updateProduct.matchCount) {
        response.body = {
            success: false,
            msg: 'error occured while updating product ' + id
        }
    } else {
        response.status = 204;
        response.body = {
            success: true,
            msg: 'product modified successfully',
            data: updatedProduct
        }
    }
}


// @desc    Delete product
// @route   DELETE /api/v1/products/:id
const deleteProduct = async ({ params, response }) => {
    const deletedProduct = await products.deleteOne({ _id: { "$oid": params.id } })
    if (deletedProduct !== 1) {
        response.body = {
            success: false,
            msg: 'something went wrong '
        }
    } else {
        response.status = 200;
        response.body = {
            success: true,
            msg: 'product was succesfully deleted'
        }
    }
}


export { getProducts, getProduct, addProduct, updateProduct, deleteProduct }
