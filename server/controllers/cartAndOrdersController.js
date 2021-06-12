// MongoDB database Model -----------------------------------------------------------------------------
const ShoppingCartModel = require('../models/shoppingCart')
const orderModel = require('../models/order')

// Img server path
const imgPath = 'images/';

// ----------------------------------------------------------------------------------------------------
// cart And Orders Controller 
// ----------------------------------------------------------------------------------------------------
class CartAndOrdersController {
    static async getNumOfOrders(req, res, next) {
        try {
            const result = await orderModel.find({})
            return res.json({ numOfOrders: result.length })
        } catch (error) {
            console.log(error);
            return res.json({ numOfOrders: 0 })
        }
    }
    static async getCartByCartId(req, res, next) {
        const { cartId } = req.params
        const result = await getCartByCartId(cartId)
        if (result) return res.json({ message: "userCarts", status: "OK", cart: result })
        return res.json({ message: "get user cart error!", status: "Error", cart: null })
    }
    static async getCartsByUserId(req, res, next) {
        try {

            const { id } = req.body
            const userCarts = await getUserCarts(id)
            return res.json({ message: "userCarts:", status: "OK", userCarts })

        } catch (error) {
            console.log(error);
            return res.json({ message: "get user carts error!", status: "Error", userCarts: [] })
        }
    }
    static async getLastCartByUserId(req, res, next) {
        try {

            const { id } = req.body
            const userCarts = await getUserCarts(id)
            if (userCarts) {
                let result = userCarts[0]
                let totalPrice = 0;
                result.cartItems.map(product => {
                    // console.log(product.productID.productPicture, imgPath)
                    const img = product.productID.productPicture
                    if (img.slice(0, 7) !== 'images/') {
                        product.productID.productPicture = imgPath + product.productID.productPicture
                    }
                    totalPrice += product.productID.productPrice * product.quantity
                    return product
                })
                result.totalPrice = totalPrice
                return res.json({ message: "userCart:", status: "OK", userCart: result })
            }
            return res.json({ message: "userCart img error:", status: "Error", userCart: userCarts[0] })

        } catch (error) {
            console.log(error);
            return res.json({ message: "get user cart error!", status: "Error", userCart: null })
        }
    }
    static async openNewCart(req, res, next) {
        try {

            const { id } = req.body
            const newCart = new ShoppingCartModel({ clientID: id, date: Date.now(), totalPrice: 0 })
            const isInsert = await newCart.save();

            if (isInsert) return res.json({ message: 'New cart created!', status: "OK", isInsert })
            return res.json({ message: 'create new cart error!', status: "Error" })

        } catch (error) {
            console.log(error);
            return res.json({ message: "create new cart error!", status: "Error", userCarts: [] })
        }
    }
    static async addToCart(req, res, next) {
        try {

            const { shoppingCartID, productID, quantity } = req.body

            let cart = await ShoppingCartModel.findById(shoppingCartID)
            cart.cartItems.push({ productID, quantity })
            const isInsert = await cart.save()

            if (isInsert) {
                const cart = await ShoppingCartModel.findById(shoppingCartID).populate('cartItems.productID')
                let totalPrice = 0;
                cart.cartItems.map(product => {
                    // console.log(product.productID.productPicture, imgPath);
                    const img = product.productID.productPicture
                    if (img.slice(0, 7) !== 'images/') {
                        product.productID.productPicture = imgPath + product.productID.productPicture
                    }
                    totalPrice += product.productID.productPrice * product.quantity
                    return product
                })
                cart.totalPrice = totalPrice
                return res.json({ message: 'item saved!', status: "OK", cart })
            }
            return res.json({ message: 'item saved error!', status: "Error" })

        } catch (error) {
            console.log(error);
            return res.json({ message: "error!", status: "Error" })
        }
    }
    static async deleteFromCart(req, res, next) {

        // itemPlace = 3 -> delete item 3
        // itemPlace = null -> delete all items

        const { item } = req.body
        // console.log(item);
        try {
            if (item.place === null) {
                const cart = await ShoppingCartModel.findById(item.cartId)
                cart.cartItems = []
                await cart.save()
                return res.json({ message: 'item deleted!', status: "OK" })
            } else {
                const cart = await ShoppingCartModel.findById(item.cartId)
                cart.cartItems.splice(item.place, 1)
                await cart.save()
                return res.json({ message: 'item deleted!', status: "OK" })
            }
        } catch (error) {
            console.log(error);
            return res.json({ message: "error!", status: "Error" })
        }
    }
    static async orderTheCart(req, res, next) {
        const { order, cart } = req.body
        const userCreditCart = order.creditCart.toString()
        // console.log(order, cart)

        const numOfOrdersPerDate = await orderModel.find({ shippingDate: order.shippingDate })
        // console.log(numOfOrdersPerDate.length)
        if (numOfOrdersPerDate.length >= 3) return res.json({ message: "You have to choose another day, all deliveries are busy", status: "moreThan3" })

        try {
            const userOrder = {
                cartID: cart._id,
                totalPrice: cart.totalPrice,
                city: order.city,
                street: order.street,
                shippingDate: order.shippingDate,
                orderDate: new Date(),
                creditCart: userCreditCart.slice(userCreditCart.length - 4)
            }

            const newOrder = new orderModel(userOrder)
            const isInsert = await newOrder.save()
            if (isInsert) {
                // console.log(isInsert);
                const cart = await getCartByCartId(isInsert.cartID)
                return res.json({ message: "the cart orderd!", status: "OK", cart })
            }
            return res.json({ message: "error!", status: "Error" })
        } catch (error) {
            console.log(error);
            return res.json({ message: "error!", status: "Error" })
        }
    }
    static async checkIfCartIsOrdered(req, res, next) {
        const { id } = req.body
        try {
            const result = await orderModel.find({ cartID: id })
            if (result.length === 0) return res.json({ cartIsOrderd: false })
            return res.json({ cartIsOrderd: true })
        } catch (error) {
            console.log(error);
            return res.status(401).json({ status: "Error" })
        }
    }
}
module.exports = CartAndOrdersController;

async function getUserCarts(id) {
    try {
        const result = await ShoppingCartModel
            .find({ clientID: id })
            .sort({ date: 'descending' })
            .populate('cartItems.productID')
            .exec();
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}
async function getCartByCartId(cartId) {
    try {
        const cart = await ShoppingCartModel.findById(cartId).populate('cartItems.productID')
        let totalPrice = 0;
        cart.cartItems.map(product => {
            // console.log(product.productID.productPicture, imgPath);
            const img = product.productID.productPicture
            if (img.slice(0, 7) !== 'images/') {
                product.productID.productPicture = imgPath + product.productID.productPicture
            }
            totalPrice += product.productID.productPrice * product.quantity
            return product
        })
        cart.totalPrice = totalPrice
        return cart
    } catch (error) {
        console.log(error);
        return null;
    }
}
