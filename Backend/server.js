const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const cors = require("cors");
const path =  require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/error");
// const passportSetup = require("./utils/passport");
// const passport = require("passport");
//config/dotenv
dotenv.config({
    path: "./config/config.env",
});

//connect databse
connectDB();

//for cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET

});

const app = express();


// app.use(passport.initialize());
// app.use(passport.session());

const multer=require('multer');
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'files')
    },
    filename:(req,file,cb)=>{
        console.log(file)
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
const upload=multer({storage:storage});
app.post("/upload",upload.single("image"),(req,res)=>{
    res.send("image uploaded");
});
app.get("/upload",(req,res)=>{
    res.render("upload");
})

app.use(express.json());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(cors());

//Routes
app.use("/api/v1/",require("./routes/userRoute"));
app.use("/api/v1/",require("./routes/productRoute"));


app.use('/',express.static(path.join(__dirname, 'files')))

//middleware error
app.use(errorMiddleware)

//define port
const PORT = process.env.PORT
const server = app.listen(PORT,()=>{
console.log(`Server is running at ${PORT}`);
})

//Unhandled Promise Rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server to Unhandled Promise rejection`);

    server.close(()=>{
        process.exit(1);
    });
});