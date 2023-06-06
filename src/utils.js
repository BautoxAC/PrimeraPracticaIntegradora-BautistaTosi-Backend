import multer from "multer"
import { Server } from "socket.io"
import { MessageManagerDB, UserManagerDB } from "./DAO/DB/MessageManagerDB.js"
import { ProductManagerDB } from "./DAO/DB/ProductManagerDB.js"
//------------MULTER------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/assets")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

export const uploader = multer({ storage })

//----------------DIRNAME------------
import path from "path"
import { fileURLToPath } from "url"
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

//-------------Mensaje de status---------------------------
export function newMessage(status, message, data) {
  return { status: status, message: message, data: data }
}

//--------------Socket Server---------------------------
export function connectSocketServer(httpServer) {
  const socketServer = new Server(httpServer)
  socketServer.on("connection", async (socket) => {
    console.log("cliente conectado")
    const userManager = new UserManagerDB()
    const MessageManager = new MessageManagerDB()
    const list = new ProductManagerDB()
    socket.on("new_user_front_to_back", async (data) => {
      let message = {}
      try {
        await userManager.addUsser(data.userPassword, data.userName)
        message = { message: "Nice job", status: true, data: data.userName }
      } catch (e) {
        message = { message: "Something went wrong", status: false }
        console.log(e)
      }
      socket.emit("logged_back_to_front", message)
    })
    socket.on("new_message_front_to_back", async (message, userName) => {
      try {
        await MessageManager.addMessage(message, userName)
        const messages = await MessageManager.getMessages()
        socket.emit("message_created_back_to_front", newMessage(true, "message created", messages))
      } catch (e) {
        console.log(e)
        socket.emit("message_created_back_to_front", newMessage(false, "an error ocurred", ""))
      }
    })
    socket.on("msg_front_to_back", async (data) => {
      try {
        const { title, description, price, thumbnails, code, stock } = data.data
        socket.emit("newProduct_to_front", await list.addProduct(title, description, price, thumbnails, code, stock), await list.getProducts())
      } catch (e) {
        console.log(e)
        socket.emit("newProduct_to_front", { status: "failure", message: "something went wrong :(", data: {} })
      }
    })
    socket.emit("msg_back_to_front_products", await list.getProducts())
    socket.on("msg_front_to_back_delete_product", async (product) => {
      await list.deleteProduct(product._id)
      socket.emit("msg_front_to_back_deleted", await list.getProducts())
    })
  })
}
//-------------MONGO------------------
import { connect } from "mongoose"
export async function connectMongo() {
  try {
    await connect("mongodb+srv://tosibautista:cp1xhHvnLrZzSDMQ@cluster0.so00fzx.mongodb.net/ecommerce")
  } catch (e) {
    console.log(e)
    throw "can not connect to the db"
  }
}