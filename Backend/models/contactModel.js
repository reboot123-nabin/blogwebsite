const mongoose = require("mongoose");



const contactSchema = new mongoose.Schema({

    fullname: {

        type: String,

        required: [true, "Please insert your name?"],

    },

    phone: {

        type: Number,

        required: [true, "Phone number is required!"],

    },

    email: {

        type: String,

        required: [true, "Email is required!"],

        unique: true,

    },

    message: {

        type: String,

        required: [true, "Please insert message!"],



    },



});



module.exports = new mongoose.model("Contact", contactSchema);