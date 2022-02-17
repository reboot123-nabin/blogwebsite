const User = require("../models/userModel");
const Post=require("../models/postModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");

const sendEmail=require("../utils/sendEmail");
// const cloudinary = require("cloudinary");

//Register a User

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

    // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder:"avatars",
    //     width: 150,
    //     crop: "scale",
    // });
    const {name,phone,email,password} = req.body;

    if(!name || !phone || !email || ! password){
        return next(new ErrorHandler("Please Enter all the field", 400));
    }

    const user = await User.create({
        name,
        phone,
        email,
        password,
        avatar:{
            public_id:"myCloud.public_id",
            url:"myCloud.secure_url",
        },
    });

    // const token = user.getJWTToken();

    // res.status(201).json({
    //     success:true,
    //     token,
    // });

    sendToken(user,201,res);
});

//Login User

exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const { email, password} = req.body;

    //checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401))
    }

    sendToken(user,200,res);
});



//Logout
exports.logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token", null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message:"Logged Out",
    });
});

// getUserDetails

//get User details

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id);

    if(!user){

      return next(new ErrorHandler("User Not found!",400));

    }

    res.status(200).json({

      success:true,

      user,

    });

  });

//forgot password

exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User Not found!",404));
    }

    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then,please ignore it.`;

    try {
        await sendEmail({
            email:user.email,
            subject:`SchoolManagementsystem password Recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message:`Email sent to ${user.email} successfully!`,
        });


    }catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }

});

//Reset Password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not password", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });





  // update user password

exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{

  const user = await User.findById(req.user.id).select("+password");



  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);



  if(!isPasswordMatched){

      return next(new ErrorHandler("Old password is incorrect", 400));

  }



  if (req.body.newPassword !== req.body.confirmPassword){

      return next(new ErrorHandler("Password does not match",400));

  }



  user.password = req.body.newPassword;



  await user.save();

  sendToken(user,200,res);

});


//update User Profile

exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

  const newUserData = {

      name: req.body.name,

      email:req.body.email,

  };



 

  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{

      new: true,

      runValidators: true,

      useFindAndModify: false,



  });



  res.status(200).json({

      success: true,

      message:"Updated!",

      user,

     



  });

});

//view post

exports.viewPost=catchAsyncErrors(async(req,res,next)=>{
  try {
    const posts = await Post.find();
    res.status(200).json({
      success:true,
      posts,
    });
    
  } catch (error) {
    return next(new ErrorHandler("Server Error",500));
  }
})
exports.addPost=catchAsyncErrors(async(req,res,next)=>{
  const {name,replies,message,title,date} = req.body;

  // if(!name || !message || !replies || !title || !date){
  //     return next(new ErrorHandler("Please Enter all the field", 400));
  // }

  const post = await Post.create({
      name,
      message,
     replies,
     title,
     date
  });
  res.status(200).json({
    success: true,
    message:"Success!",
    post,
});
  // const token = user.getJWTToken();

  // res.status(201).json({
  //     success:true,
  //     token,
  // });

})


//for admin (Get All Users)

exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{
  try {
    const users = await User.find();

    res.status(200).json({
      success:true,
      users,
    });
    
  } catch (error) {
    return next(new ErrorHandler("Server Error",500));
  }

});

//Get single User (admin)

exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);

    if(!user){
      return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
    }

    res.status(200).json({
      success:true,
      user,
    });
    
  } catch (error) {
    return next(new ErrorHandler("Server Error",500))
  }
})

//Update user by (admin)
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
  try {
    const newUserData = {
      name:req.body.name,
      email:req.body.email,
      role:req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
      new:true,
      runValidators:true,
      useFindAndModify:false,
    });

    res.status(200).json({
     success:true,
     message:"User updated successfully!",
     user,
    });
    
  } catch (error) {
    return next(error)
    
  }
});

//Delete User (admin)
exports.deleteUserRole = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.params.id);

  if(!user){
      return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
  }

  await user.remove();

  res.status(200).json({
  success: true,
  message:"User deleted successfully!",
});

});