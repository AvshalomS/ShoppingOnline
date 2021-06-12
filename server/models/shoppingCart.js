
// Shopping Cart
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shoppingCartSchema = new Schema({

    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: { type: Date },
    cartItems: [
        {
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            quantity: { type: Number },
        }],
    totalPrice: { type: Number },
});

const shoppingCartModel = mongoose.model("shoppingCart", shoppingCartSchema);
module.exports = shoppingCartModel;
