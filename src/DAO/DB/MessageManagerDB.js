import { newMessage } from "../../utils.js";
import { messageModel } from "../models/messages.model.js";
export class MessageManagerDB {
    async addMessage(message, user) {
        try {
            await messageModel.create({ message: message, user: user })
            const lastAdded = await messageModel.findOne({}).sort({ _id: -1 }).lean()
            return newMessage("success", "Message added successfully", lastAdded)
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async getMessages() {
        try {
            const messages = await messageModel.find({}).lean()
            return messages
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
}