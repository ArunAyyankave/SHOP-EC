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

//cart
const cartController = require("../controllers/cartController")

user_route.get('/cart/:id',cartController.loadCart)
user_route.get('/addToCart/:id',cartController.addToCart)

user_route.post('/itemInc/:id', cartController.itemInc)
user_route.post('/itemDec/:id', cartController.itemDec)
user_route.put('/itemDelete/:id', cartController.itemDelete)

//Checkout
const checkoutController = require('../controllers/checkoutController')

user_route.get('/checkout/:id', auth.isLogin, checkoutController.checkoutPage)
user_route.post('/placeOrder', auth.isLogin, checkoutController.placeOrder)

user_route.get('/checkoutAddress', auth.isLogin, checkoutController.checkoutAddress)
user_route.post('/saveAddress/:id', auth.isLogin, userController.saveAddress)

const couponController = require('../controllers/couponController') 
user_route.post('/applyCoupen/:id', auth.isLogin, couponController.applyCoupen)

user_route.get('/viewOrders', auth.isLogin, checkoutController.viewOrders)
user_route.post('/orderedProducts', auth.isLogin, checkoutController.orderedProducts)
user_route.put('/cancelOrder/:id', auth.isLogin, checkoutController.cancelOrder)

//Wishlist
const wishlistController = require('../controllers/wishlistController')

user_route.get('/addToWishlist/:id', auth.isLogin, wishlistController.addToWishlist)
user_route.get('/wishlist/:id', auth.isLogin, wishlistController.userWishlist)
user_route.delete('/deleteWishlistItem/:id', auth.isLogin, wishlistController.deleteWishlist)

//User Profile
user_route.get('/userProfile/:id', auth.isLogin, userController.userProfile)

user_route.get('/addAddress', auth.isLogin, userController.addAddress)
//user_route.get('/saveAddress/:id', auth.isLogin, userController.saveAddress)
user_route.delete('/deleteAddress/:id', auth.isLogin, userController.deleteAddress)

const categoryController = require('../controllers/categoryController')
user_route.get('/user/singleProduct/:id', categoryController.singleProduct)


module.exports = user_route;