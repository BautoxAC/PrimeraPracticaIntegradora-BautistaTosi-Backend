import multer from "multer"
import { Server } from "socket.io"
import { ProductManagerDB } from "./DAO/DB/ProductManagerDB.js"
import { Productmodel } from "./DAO/models/products.model.js"
import { ProductManager } from "./DAO/FileSystem/ProductManager.js"
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
    const list = new ProductManagerDB()
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