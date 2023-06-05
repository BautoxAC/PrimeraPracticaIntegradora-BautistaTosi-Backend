import express from "express"
export const productRouterHtml = express.Router()
import { ProductManager } from "../DAO/FileSystem/ProductManager.js"
productRouterHtml.get('/', function (req, res) {
    const list = new ProductManager("src/public/products.json")
    const products = list.getProducts()
    return res.status(200).render("index", { products })
})