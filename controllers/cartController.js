const User = require('../models/userModel');
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Cart = require('../models/cartModel')

const loadCart = async(req, res)=>{
    try {
        const categoryData = await Category.find({})
        res.render('cart',{ category:categoryData })
    } catch (error) {
        console.log(error.message);
    }
}

const addToCart = async(req, res)=>{
    try {

        if(req.session.user){
            
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadCart,
    addToCart
}