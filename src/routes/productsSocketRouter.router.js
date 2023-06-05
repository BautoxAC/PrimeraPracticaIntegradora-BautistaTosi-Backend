import express from "express"
export const productsSocketRouter = express.Router()
import { ProductManagerDB } from "../DAO/DB/ProductManagerDB.js"
productsSocketRouter.get('/', async function (req, res) {
    const list = new ProductManagerDB()
    let products = await list.getProducts()
    return res.status(200).render("realTimeProducts", { products })
})
