const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const citiesListSchema = new Schema({
    name: { type: String },
});

const citiesListModel = mongoose.model("city", citiesListSchema);
module.exports = citiesListModel;