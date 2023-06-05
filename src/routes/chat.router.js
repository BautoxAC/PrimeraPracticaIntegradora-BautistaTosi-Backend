import express from "express"
import { newMessage } from "../utils.js"
export const chatRouter = express.Router()

chatRouter.get("/",async (req, res) => {
    return res.render("chat")
})
chatRouter.post("/", async (req, res) => {
    return res.render("chat")
})
chatRouter.get("/AuthLogin", (req, res) => {
    return res.render("AuthLogin")
})