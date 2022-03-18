const express = require("express");
const router = express.Router();
const { addProduct,getProductUser } = require("../controllers/productController");
const{authorizedRoles}=require("../middleware/auth");


router.route("/addProduct").post(addProduct);

router.route("/getproduct").get(getProductUser);
module.exports = router;