const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: { type: String },
    productPrice: { type: Number },
    productPicture: { type: String },
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categoryListModel'
    }
});

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;