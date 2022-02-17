const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"name Cannot exceed 30 characters"],
        minLength:[4,"Name should have more than 4 characters"],
    },
    phone:{
        type:Number,
        required:[true,"Please enter your Phone Number"],
        maxLength:[10,"Number cannot exceed 10 digits"],
        minLength:[10,"Number should have more than 10 digits"],
    },
    email:{
        type:String,
        required:[true,"Please Enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter your valid Email"],
    },
    password:{
        type:String,
        required:[true,"Please Enter your password"],
        minLength:[8,"Password should be greater than 8 characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    },

    role:{
        type:String,
        default:"user",
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    // tokens:[
    //     {
    //         token:{
    //             type:String,
    //             required:true
    //         }
    //     }
    // ],
    resetPasswordToken: String,
    resetPasswordExpire:Date,


});

//hash password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password,10);
});

//jwt token

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };
//generating token


// userSchema.methods.getJWTToken = async function () {
//     console.log("here you reached generate token");
//     try{
//         let tokenthapa=jwt.sign({_id:this._id},process.env.SECRET_KEY);
//         this.tokens=this.tokens.concat({token:tokenthapa});
//         await this.save();
//         return token;
//     }
//     catch(err){
//         console.log(err);
//     }
//   };


//Compare password
userSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password);
}

//Generating password for reset token
userSchema.methods.getResetPasswordToken = function (){
    //Geerating Token

    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding resetPasswordToken to userschema

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("User",userSchema);