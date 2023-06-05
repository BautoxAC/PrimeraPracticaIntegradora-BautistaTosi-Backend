import express from "express"
import { CartManagerDB } from "../DAO/DB/ProductManagerDB.js"
import { newMessage } from "../utils.js"
export const cartsRouter = express.Router()
const list = new CartManagerDB()

cartsRouter.get("/:cid",async (req, res) => {
    const Id = req.params.cid
    return res.status(200).json(newMessage("success", "carrito por id", await list.getCartById(Id)))
})
cartsRouter.post("/", async (req, res) => {
    return res.status(200).json(await list.addCart())
})
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const idCart = req.params.cid
    const idProduct = req.params.pid
    return res.status(200).json(await list.addProduct(idCart, idProduct))
})