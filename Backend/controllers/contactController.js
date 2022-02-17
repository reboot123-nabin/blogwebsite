const Contact = require("../models/contactModel");

const catchAsyncErrors = require("../middleware/catchAsyncError");

const ErrorHandler = require("../utils/errorHandler");


exports.createContact = catchAsyncErrors(async(req,res,next)=>{

    const {fullname,phone,email,message} = req.body;

    if(!fullname || !phone || !email || !message){

        return next(new ErrorHandler("please Filled all the filed",400));

    }

    try {

        const contact = await Contact.create({

            fullname,

            phone,

            email,

            message,

        });



        res.status(200).json({

            success:true,

            message:"contact Added successfully!",

            contact,



        });

       

       

    } catch (error) {

        return (next)

       

    }

})

exports.getAllNotification=catchAsyncErrors(async(req,res,next)=>{
    const options={
        contact:req.auth?.id()
    }


})



exports.getNotification = catchAsyncErrors(async(req,res,next)=>{
    const contact = await Contact.findById({
        read:false,
        _id:req.params.id
    });

    if(!contact){
      return next(new ErrorHandler("Contact Not found!",400));
    }
    contact.read=true
    contact.read_at=new Date()
    await contact.save()
    res.status(200).json({
      success:true,
      contact,

    });

})
