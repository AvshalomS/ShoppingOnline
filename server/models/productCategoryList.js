const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoryListSchema = new Schema({
    name: { type: String },
});

const categoryListModel = mongoose.model("category", categoryListSchema);
module.exports = categoryListModel;
