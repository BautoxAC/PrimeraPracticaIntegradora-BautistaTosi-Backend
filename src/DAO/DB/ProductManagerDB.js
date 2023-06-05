import { Productmodel } from "../models/products.model.js";
import { newMessage } from "../../utils.js";
import { cartModel } from "../models/carts.model.js";
export class ProductManagerDB {
    async addProduct(title, description, price, thumbnails, code, stock) {
        try {
            let product = { title, description, price: Number(price), thumbnails: thumbnails !== undefined && [thumbnails], code, stock: Number(stock) }
            let addPro = true
            const productValues = Object.values(product)
            for (const prop of productValues) {
                if (!prop) {
                    addPro = false
                    break
                }
            }
            const products = await this.getProducts()
            let codeVerificator = products.find((product) => product.code === code)
            if (codeVerificator) {
                return newMessage("failure", "Error, the code is repeated", "")
            } else if (!addPro) {
                return newMessage("failure", "Error, data is incomplete please provide more data and the stock and the price must be numbers", "")
            } else {
                await Productmodel.create(product)
                const lastAdded = await Productmodel.findOne({}).sort({ _id: -1 }).lean()
                return newMessage("success", "Product added successfully", lastAdded)
            }
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async updateProduct(id, propsReceivedToUpdate) {
        try {
            let productToUpdate = await this.getProductById(id)
            productToUpdate = productToUpdate.data
            const entriesRecieved = Object.entries(propsReceivedToUpdate)
            const valuesToUpdate = Object.keys(productToUpdate)
            const dataTypes = Object.entries(productToUpdate).map((prop) => ({ key: prop[0], type: prop[0] === "thumbnails" ? "string" : typeof (prop[1]) }))
            const messages = []
            if (!productToUpdate || Array.isArray(propsReceivedToUpdate)) {
                return newMessage("failure", "The product was not found or the data is an Array", "")
            }
            const propToUpdateFound = entriesRecieved.map((entry) => {
                const status = valuesToUpdate.some((propUpdate) => entry[0] === propUpdate && entry[0] !== "id" && entry[0] !== "status")
                return { entries: { key: entry[0], value: entry[1] }, status: status, type: typeof (entry[1]) }
            })
            for (let i = 0; i < propToUpdateFound.length; i++) {
                const prop = propToUpdateFound[i]
                const sameTypeAndKey = dataTypes.find((type) => type.type === prop.type && type.key === prop.entries.key)
                const sameKey = dataTypes.find(type => type.key === prop.entries.key)
                if (prop.status && sameTypeAndKey) {
                    if (prop.entries.key === "thumbnails") {
                        const thumbnailRepeated = productToUpdate.thumbnails.some(thumbnail => thumbnail === prop.entries.value)
                        thumbnailRepeated ? messages.push(` The prop Number: ${i + 1} (${prop.entries.key}) has a value repeated`) : productToUpdate.thumbnails.push(prop.entries.value)
                    } else {
                        productToUpdate[prop.entries.key] = prop.entries.value
                    }
                } else {
                    messages.push(` The prop Number: ${i + 1} (${prop.entries.key}) was provided incorrectly`)
                    prop.status ? messages.push(`Must be ${sameKey?.type}`) : messages.push("The prop must be title, description, price, thumbnails, code or stock")
                }
            }
            await Productmodel.updateOne({ _id: productToUpdate._id.toString() }, productToUpdate)
            return newMessage("success", "Updated successfully" + (messages).toString(), productToUpdate)
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }

    }
    async getProducts() {
        try {
            const products = await Productmodel.find({}).lean()
            return products
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async getProductById(id) {
        try {
            let productFindId = await Productmodel.findOne({ _id: id }).lean()
            if (productFindId) {
                return newMessage("success", "Found successfully", productFindId)
            } else {
                return newMessage("failure", "Not Found", "")
            }
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async deleteProduct(id) {
        try {
            const productToDelete = await Productmodel.deleteOne({ _id: id })
            return newMessage("success", "Deleted successfully", productToDelete)
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
}
export class CartManagerDB {
    async getCartById(id) {
        try {
            let cartFindId = await cartModel.findOne({ _id: id }).lean()
            if (cartFindId) {
                return newMessage("success", "Found successfully", cartFindId.products)
            } else {
                return newMessage("failure", "Cart not Found", "")
            }
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async addCart() {
        try {
            await cartModel.create({ products: [] })
            const lastAdded = await cartModel.findOne({}).sort({ _id: -1 }).lean()
            return newMessage("success", "cart added successfully", lastAdded)
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async addProduct(idCart, idProduct) {
        try {
            const listProducts = new ProductManagerDB()
            let cart = await cartModel.findOne({ _id: idCart }).lean()
            if (!cart) {
                return newMessage("failure", "cart not found", "")
            }
            let product = await listProducts.getProductById(idProduct)
            product = product.data
            if (!product) {
                return newMessage("failure", "product not found", "")
            }
            const productRepeated = cart.products.find(pro => pro.idProduct.toString() === product._id.toString())
            let messageReturn = {}
            if (productRepeated) {
                const positionProductRepeated = cart.products.indexOf(productRepeated)
                console.log(positionProductRepeated,cart.products[positionProductRepeated].quantity)
                if (cart.products[positionProductRepeated].quantity < product.stock) {
                    cart.products[positionProductRepeated].quantity++
                    messageReturn = newMessage("success", "Product repeated: quantity added correctly", cart)
                } else {
                    messageReturn = newMessage("failure", "Product repeated: quantity is iqual to the stock", cart)
                }
            } else {
                cart.products.push({ idProduct: product._id, quantity: 1 })
                messageReturn = newMessage("success", "Product added correctly", cart)
            }
            await cartModel.updateOne({ _id: cart._id }, cart)
            return messageReturn
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
}