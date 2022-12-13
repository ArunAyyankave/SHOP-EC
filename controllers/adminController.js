const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

const checkoutData = require('../models/checkoutModel')
const mongoose = require('mongoose')

const loadLogin = async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});

        if (userData) {
            
            const passwordMatch = await bcrypt.compare(password,userData.password);

            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    res.render('login',{message:"Email and password is incorrect"});
                }else {
                    req.session.admin_id = userData._id;
                    res.redirect("/admin/home");
                }
            }else {
                res.render('login',{message:"Email and password is incorrect"});
            }
        }else{
            res.render('login',{message:"Email and password is incorrect"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async(req, res)=>{
    try {
        const userData = await User.findById({_id:req.session.admin_id});
        res.render('home',{admin:userData});
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async(req,res)=>{
    try {
        delete req.session.admin_id;
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }
}

const loadUsers = async(req,res)=>{
    try {
        const userData = await User.find({is_admin:0})
        res.render('users',{users:userData});
    } catch (error) {
        console.log(error.message);
    }
}

const blockUser = async(req,res)=>{
    try {
        const id = req.query.id;
        await User.deleteOne({ _id:id });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

const productOrders = async(req, res)=>{
    try {
        const orderData = await checkoutData.find({}).sort({ 'orderStatus.date': -1 })
        orderId = mongoose.Types.ObjectId(orderData._Id)
        res.render('orders', { orderData, orderId })
    } catch (error) {
        console.log(error.message);
    }
}

const orderItems = async(req, res)=>{
    try {
        const carId = req.body
        const cartId = mongoose.Types.ObjectId(carId)
        const cartList = await checkoutData.aggregate([{ $match: { _id: cartId } }, { $unwind: '$cartItems' },
        { $project: { item: '$cartItems.productId', itemQuantity: '$cartItems.quantity' } },
        { $lookup: { from: 'products', localField: 'item', foreignField: '_id', as: 'product' } }]);

        res.send({ cartList })
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    loadUsers,
    blockUser,
    productOrders,
    orderItems
}