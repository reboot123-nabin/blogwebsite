const mongoose = require("mongoose");



const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please insert your title?"],
    },
    description: {
        type: String,
        required: [true, "Please enter description"],
    },
    price:{
        type:String
    },
    quantity: {
        type: String,
        required: [true, "Please insert message!"],
    },
    img:{
        type:String,
        required:[true,"please enter image"],
    },

});



module.exports = new mongoose.model("Product", productSchema);