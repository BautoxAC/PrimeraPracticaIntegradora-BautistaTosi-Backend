import { newMessage } from "../../utils.js";
import { messageModel } from "../models/messages.model.js";
import { userModel } from "../models/users.model.js";
export class MessageManagerDB {
    async addMessage(message, userName) {
        try {
            const user = await userModel.findOne({ userName: userName }).lean()
            if (user) {
                await messageModel.create({ message: message, user: userName })
                const lastAdded = await messageModel.findOne({}).sort({ _id: -1 }).lean()
                return newMessage("success", "Message added successfully", lastAdded)
            } else {
                throw new Error("the user was not found")
            }
        } catch (e) {
            console.log(e)
            throw new Error("A problem ocurred")
        }
    }
    async getMessages() {
        try {
            const messages = await messageModel.find({}).lean()
            return messages
        } catch (e) {
            console.log(e)
            throw new Error("A problem ocurred")
        }
    }
}
export class UserManagerDB {
    async addUsser(userPassword, userName) {
        try {
            await userModel.create({ userPassword: userPassword, userName: userName })
            const lastAdded = await userModel.findOne({}).sort({ _id: -1 }).lean()
            return newMessage("success", "Message added successfully", lastAdded)
        } catch (e) {
            console.log(e)
            throw new Error("A problem ocurred")
        }
    }
}