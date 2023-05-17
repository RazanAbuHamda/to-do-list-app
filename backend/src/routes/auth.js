const router=require('express').Router()
const AuthController=require("../controllers/authController")
const verify=require('../helpers/verifyToken')


router.post('/register',AuthController.register);

router.post('/login',AuthController.login)

router.post('/logout',AuthController.logout)

module.exports=router;
//router.:instead of app. , by require('express').Router()
