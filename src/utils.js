import multer from "multer"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/assets")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

export const uploader = multer({ storage })

import path from "path"
import { fileURLToPath } from "url"
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

export function newMessage(status,message,data) {
  return {status:status,message:message,data:data}
}
export function connectSocketServer(socketServer) {
  socketServer.on("connection", (socket) => {
      console.log("cliente conectado")
      const list = new ProductManager("src/public/products.json")
      socket.on("msg_front_to_back", async (data) => {
          try {
              const { title, description, price, thumbnails, code, stock } = data.data
              socket.emit("newProduct_to_front", await list.addProduct(title, description, price, thumbnails, code, stock), list.getProducts())
          } catch (e) {
              console.log(e)
              socket.emit("newProduct_to_front", { status: "failure", message: "something went wrong :(", data: {} })
          }
      })
      socket.emit("msg_back_to_front_products", list.getProducts())
      socket.on("msg_front_to_back_delete_product", async (product) => {
          await list.deleteProduct(product.id)
          socket.emit("msg_front_to_back_deleted", list.getProducts())
      })
  })
}