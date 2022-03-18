const express = require("express");
const upload=require('../middleware/upload')
const { registerUser, loginUser, logout, forgotPassword,addPost,resetPassword,deleteUserRole,updateUserRole,getSingleUser,getUserDetails,getAllUser,updatePassword,updateProfile, viewPost } = require("../controllers/userController");
const {isAuthenticatedUser}=require("../middleware/auth");
const router = express.Router();
const{authorizedRoles}=require("../middleware/auth");

// const passport = require("passport");
// const CLIENT_URL = "http://localhost:3000/";
const { createContact,getNotification ,searchdata} = require("../controllers/contactController");
//User route
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);
router.route("/addPost",upload.single('nimage')).post(addPost);
router.route("/viewpost").get(viewPost);
router.route("/").get(searchdata);


router.post('/Description/insert',upload.single('nimage'),function(req,res){
    const ntitle=req.body.title;
    const nimage=req.file.filename;
    const ndesc=req.body.desc;
    const nname=req.body.name;
    console.log(req.body)
    //console.log(req.body);
    const ndata=new DescriptionSchema({
        title:ntitle,
        nimage:nimage,
        desc:ndesc,
        name:nname
    })

ndata.save()
.then(function(data){
    res.status(201).json({message:"description created",data:data})
})
.catch(function(e){
    res.status(500).json({abc:e})
})
})
// router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed"
//   })
// );

// router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

// router.get(
//   "/github/callback",
//   passport.authenticate("github", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

// router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );
//Route
//for admin
router.route("/getallusers").get(isAuthenticatedUser,authorizedRoles("admin"),getAllUser);
router.route("/singleuser/:id").get(isAuthenticatedUser,authorizedRoles("admin"),getSingleUser);

router.route("/user/update/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateUserRole);
router.route("/user/delete/:id").delete(isAuthenticatedUser,authorizedRoles("admin"),deleteUserRole);

//contact
router.route("/add/contact").post(createContact);

router.route("/notification/:id").get(getNotification);


module.exports = router;