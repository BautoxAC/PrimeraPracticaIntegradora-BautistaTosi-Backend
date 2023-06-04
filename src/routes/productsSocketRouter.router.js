import express from "express"
export const productsSocketRouter = express.Router()
import { ProductManager } from "../ProductManager.js"
productsSocketRouter.get('/', function (req, res) {
    const list = new ProductManager("src/public/products.json")
    const products = list.getProducts()
    return res.status(200).render("realTimeProducts", { products })
})

