const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next)=>{
    let { token } = req.cookies;
    token=token?token: req?.headers?.authorization;
    token=token?.replace("Bearer ",'')
    if(!token){
        return next(new ErrorHandler("Please Login to access this resoure",401));
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id)
    next();

   
});

//for admin roles
exports.authorizedRoles = (...roles) => {
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
           return next( new ErrorHandler(
                `Role:${req.user.role} is not allowed to access this resource `,403
            )
           );
        }

        next();
    }
}

