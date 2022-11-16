const express = require("express");
const admin_route = express();

const session = require("express-session");
const config = require("../config/config");
admin_route.use(session({secret:config.sessionSecret, resave:false, saveUninitialized:true}));

const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const multer = require("multer");
const path = require("path");

admin_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname, '../public/productImages'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});
const upload = multer({storage:storage})

const auth = require("../middleware/adminAuth");

const adminController = require("../controllers/adminController");

admin_route.get('/',auth.isLogout,adminController.loadLogin);

admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,adminController.loadDashboard);

admin_route.get('/logout',auth.isLogin,adminController.logout);

admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard);

admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad);

admin_route.post('/new-user',upload.single('image'),adminController.addUser);

admin_route.get('/edit-user',auth.isLogin, adminController.editUserLoad);

admin_route.post('/edit-user',adminController.updateUsers);

admin_route.get('/delete-user',adminController.deleteUser);


//for products start
const productController = require("../controllers/productController");

admin_route.get('/products',auth.isLogin,productController.loadProducts);

admin_route.get('/new-product',auth.isLogin,productController.newProductLoad);
admin_route.post('/new-product',upload.single('image'),productController.addProduct);

admin_route.get('/edit-product',auth.isLogin, productController.editProductLoad);
admin_route.post('/edit-product',upload.single('image'),productController.updateProduct);

admin_route.get('/delete-product',productController.deleteProduct);
//product end

//categories start
const categoryController = require("../controllers/categoryController");

admin_route.get('/categories',auth.isLogin,categoryController.loadCategories)

//admin_route.get('/new-category',auth.isLogin,categoryController.newCategoryLoad);
admin_route.post('/new-category',categoryController.addCategory);

//admin_route.get('/edit-category',auth.isLogin, categoryController.editCategoryLoad);
admin_route.post('/edit-category',categoryController.updateCategory);

admin_route.get('/delete-category',categoryController.deleteCategory);
//categories end

//brands start
const brandController = require("../controllers/brandController");

admin_route.get('/brands',auth.isLogin,brandController.loadBrands)

//admin_route.get('/new-brand',auth.isLogin,brandController.newBrandLoad);
admin_route.post('/new-brand',brandController.addBrand);

//admin_route.get('/edit-brand',auth.isLogin, brandController.editBrandLoad);
admin_route.post('/edit-brand',brandController.updateBrand);

admin_route.get('/delete-brand',brandController.deleteBrand);
//brands end


admin_route.get('*',function(req,res){

    res.redirect('/admin');

})

module.exports = admin_route;