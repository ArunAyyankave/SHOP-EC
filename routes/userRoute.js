const express = require("express");
const user_route = express();
const session = require("express-session");

const config = require("../config/config");

user_route.use(session({secret:config.sessionSecret, resave:false, saveUninitialized:true}));

const auth = require('../middleware/auth');

user_route.set('view engine','ejs');
user_route.set('views','./views/users');

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))





user_route.use(express.static('public'));



const userController = require("../controllers/userController");

user_route.get('/register',auth.isLogout,userController.loadRegister);

user_route.post('/register',userController.insertUser);

user_route.post('/verify',userController.verifyPhone);

user_route.get('/',auth.isLogout,userController.LandingPage);
user_route.get('/login',auth.isLogout,userController.loginLoad);

user_route.post('/login',userController.verifyLogin);

user_route.get('/userhome',auth.isLogin,userController.loaduserHome);

user_route.get('/logout',auth.isLogin,userController.userLogout);

//product
user_route.get('/productDetails/:id',userController.loadProduct)

const cartController = require("../controllers/cartController")
user_route.get('/cart/:id',cartController.loadCart)
user_route.get('/addToCart/:id',cartController.addToCart)

module.exports = user_route;