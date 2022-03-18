const mongoose = require("mongoose");



const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please insert your name?"],
    },
    replies: {
        type: String,
        required: [true, "Please enter replies"],
    },
    nimage:{
        type:String
    },
    message: {
        type: String,
        required: [true, "Please insert message!"],
    },
    title:{
        type:String,
        required:[true,"please enter title"],
    },
    date:{
        type:String,
        required:[true,"pleas enter date"]
    }


});



module.exports = new mongoose.model("Post", postSchema);