// Cart item

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({

    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: productModel
    },
    quantity: { type: Number },
    totalPrice: { type: Number },
    shoppingCartID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: shoppingCartModel
    },
});

const cartItemModel = mongoose.model("cartItem", cartItemSchema);
module.exports = cartItemModel;
