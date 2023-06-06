import express from "express"
import { MessageManagerDB } from "../DAO/DB/MessageManagerDB.js"
export const chatRouter = express.Router()
const MessageManager = new MessageManagerDB()
chatRouter.get("/", async (req, res) => {
    const { logged, user } = req.query
    const messages = await MessageManager.getMessages()
    return res.render("chat", { logged, messages: messages.reverse(), user })
})
chatRouter.get("/AuthLogin", (req, res) => {
    return res.render("AuthLogin")
})