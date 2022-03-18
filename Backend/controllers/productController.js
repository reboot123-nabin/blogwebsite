
const Product = require("../models/productModel");

const catchAsyncErrors = require("../middleware/catchAsyncError");

const ErrorHandler = require("../utils/errorHandler");



exports.addProduct=catchAsyncErrors(async(req,res,next)=>{
    const {title,description,price,quantity,img} = req.body;
  console.log(req.body);
    // if(!name || !message || !replies || !title || !date){
    //     return next(new ErrorHandler("Please Enter all the field", 400));
    // }
    const product = await Product.create({
        title,
        description,
        price,
        quantity,
        img
    });
    res.status(200).json({
      success: true,
      message:"Success!",
      product,
  });
    // const token = user.getJWTToken();
  
    // res.status(201).json({
    //     success:true,
    //     token,
    // });
  
  })
//for admin (Get All Users)

exports.getProductUser = catchAsyncErrors(async(req,res,next)=>{
    try {
      const product = await Product.find();
  
      res.status(200).json({
        success:true,
        product,
      });
      
    } catch (error) {
      return next(new ErrorHandler("Server Error",500));
    }
  
  });
 
  