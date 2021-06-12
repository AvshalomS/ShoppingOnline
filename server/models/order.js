const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    cartID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shoppingcart'
    },
    totalPrice: { type: Number },
    city: { type: String },
    street: { type: String },
    shippingDate: { type: Date },
    orderDate: { type: Date },
    creditCart: { type: String },
});

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;