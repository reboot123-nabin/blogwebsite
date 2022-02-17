const express = require("express");
const { registerUser, loginUser, logout, forgotPassword,addPost,resetPassword,deleteUserRole,updateUserRole,getSingleUser,getUserDetails,getAllUser,updatePassword,updateProfile, viewPost } = require("../controllers/userController");
const {isAuthenticatedUser}=require("../middleware/auth");
const router = express.Router();
const{authorizedRoles}=require("../middleware/auth");
const { createContact,getNotification } = require("../controllers/contactController");
//User route
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/password/reset/:token").put(resetPassword);

router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);
router.route("/addPost").post(addPost);
router.route("/viewpost").get(viewPost);
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