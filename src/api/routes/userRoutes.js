const express = require('express');
const router = express.Router();

const {signup, login, getUser, userUpdate, deleteUser} = require('../controllers/user');
const upload = require("../../middleware/multerConfig");
const authenticate = require("../../middleware/auth");


router.post("/signup", upload.single("profile_image"), signup);
router.post("/login", login);


router.use(authenticate); 
router.get("/getUser", getUser);
router.put("/updateUser", upload.single("profile_image"), userUpdate);
router.delete("/deleteUser", deleteUser); 


module.exports = router;