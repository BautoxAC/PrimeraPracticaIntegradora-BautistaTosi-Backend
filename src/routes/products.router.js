import express from "express"
import { ProductManagerDB } from "../DAO/DB/ProductManagerDB.js"
import { newMessage, uploader } from "../utils.js"
export const productsRouter = express.Router()
const list = new ProductManagerDB()

productsRouter.get("/", async (req, res) => {
    const products = await list.getProducts()
    const { limit } = req.query
    const productsLimited = products.filter((pro, index) => index < limit)
    const messageProductsLimited = newMessage("success", "listado de productos limitados", productsLimited)
    const messageAllProducts = newMessage("success", "listado de productos", await list.getProducts())
    return res.status(200).json(Number(limit) ? messageProductsLimited : messageAllProducts)
})

productsRouter.get("/:pid", async (req, res) => {
    const Id = req.params.pid
    return res.status(200).json(newMessage("success", "producto por id", await list.getProductById(Id)))
})

productsRouter.post("/", uploader.single("file"), async (req, res) => {
    res.redirect("/realtimeproducts")
})

productsRouter.put("/:pid", async (req, res) => {
    const Id = req.params.pid
    const productPropsToUpdate = req.body
    return res.status(200).json(newMessage(await list.updateProduct(Id, productPropsToUpdate)))
})

productsRouter.delete("/:pid", async (req, res) => {
    const Id = req.params.pid
    return res.status(200).json(await list.deleteProduct(Id))
})