const User = require('../models/userModel');
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Cart = require('../models/cartModel')
const mongoose = require('mongoose')

const addToCart = async(req, res)=>{
    try {

        if (req.session.user_id) {
            const prodId = req.params.id
            const productId = new mongoose.Types.ObjectId(prodId)
            const userId = req.session.user_id
            const item = await Product.findOne({ _id: productId })
            const price = item.price
            const detail = await User.findById({ _id: userId })
            
                const userExist = await Cart.findOne({ userId })
                if (userExist) {
                    const productExist = await Cart.findOne({
                        $and: [{ userId }, {
                            cartItems: {
                                $elemMatch: {
                                    productId
                                }
                            }
                        }]
                    })

                    if (productExist) {
                        await Cart.findOneAndUpdate({ $and: [{ userId }, { "cartItems.productId": productId }] }, { $inc: { "cartItems.$.quantity": 1 } })
                        res.send({ success: true })
                    } else {
                        await Cart.updateOne({ userId }, { $push: { cartItems: { productId, quantity: 1, price } } })
                        res.send({ success: true })
                    }
                } else {
                    const cart = new Cart({
                        userId, cartItems: [{ productId, quantity: 1, price }]
                    })
                    await cart.save()
                        .then(() => {
                            res.send(success)
                        })
                        .catch((err) => {
                            console.log(err.message);
                        })
                }
                
           
        } else {
           res.redirect("/login")
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

//show cart
const loadCart = async(req, res)=>{
    try {
        if (req.session.user_id) {
            const user = req.session.user_id
            const userId = mongoose.Types.ObjectId(user)
            // console.log(userId)
            
            const cartList = await Cart.aggregate([{ $match: { userId } }, { $unwind: '$cartItems' },
            { $project: { item: '$cartItems.productId', itemQuantity: '$cartItems.quantity' } },
            { $lookup: { from: "products", localField: 'item', foreignField: '_id', as: 'product' } }]);
            // console.log(cartList);
            let total;
            let subtotal = 0;

            cartList.forEach((p) => {
                p.product.forEach((p2) => {
                    total = parseInt(p2.price) * parseInt(p.itemQuantity)
                    subtotal += total
                })
            })

            let shipping = 0;
            if (subtotal < 15000) {
                shipping = 50
            } else {
                shipping = 0
            }
            const grandtotal = subtotal + shipping
            const category = await Category.find({})
            const userData = await User.findById({_id:user})
            res.render('cart', { cartList, subtotal, total, shipping, grandtotal, category, userData })
        } else {
            // req.flash('error', 'you are not logged in')
            // res.redirect('back')
        }
        //const categoryData = await Category.find({})
        //res.render('cart',{ category:categoryData })
    } catch (error) {
        console.log(error.message);
    }
}

const itemInc = async (req, res)=>{
    try {
        const prodId = req.params
        const productId = mongoose.Types.ObjectId(prodId)
        const userId = req.session.user_id
        //const detail = await userData.findById({ _id: userId })
        
        if (userId) {
            const userExist = await Cart.findOne({ userId })
            if (userExist) {

                const productExist = await Cart.findOne({
                    $and: [{ userId }, {
                        cartItems: {
                            $elemMatch: {
                                productId
                            }
                        }
                    }]
                })
                
                if (productExist) {
                    await Cart.findOneAndUpdate({ $and: [{ userId }, { "cartItems.productId": productId }] }, { $inc: { "cartItems.$.quantity": 1 } })
                    let quantity = 0
                    //req.flash('success', 'Item added to cart successfully')
                    res.send({ success: true })
                } else {
                    //req.flash('error', 'Unable to add item!!!')
                    res.redirect('back')
                }
            } else {
                //req.flash('error', 'You are not logged in')
            }
        } else {
            //req.flash('error', 'You are unable to access the product')
            res.redirect('back')
        }
        
    } catch (error) {
        console.log(error.message)
    }
}

const itemDec = async (req, res)=>{
    try {
        const prodId = req.params.id
        const productId = new mongoose.Types.ObjectId(prodId)
        const userId = req.session.user_id
        //const detail = await userData.findById({ _id: userId })

        if (userId) {
            const userExist = await Cart.findOne({ userId })

            if (userExist) {
                const productExist = await Cart.findOne({
                    $and: [{ userId }, {
                        cartItems: {
                            $elemMatch: {
                                productId
                            }
                        }
                    }]
                })

                if (productExist) {
                    await Cart.findOneAndUpdate({ $and: [{ userId }, { "cartItems.productId": productId }] }, { $inc: { "cartItems.$.quantity": -1 } })
                    //req.flash('success', 'Item removed from cart successfully')
                    res.send({ success: true })
                } else {
                    //req.flash('error', 'Unable to delete item!!!')
                    res.redirect('back')
                }
            } else {
                //req.flash('error', 'You are not logged in')
            }
        } else {
            //req.flash('error', 'You are unable to access the product')
            res.redirect('back')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const itemDelete = async (req, res)=>{
    try {

        const prodId = req.params.id
        const productId = new mongoose.Types.ObjectId(prodId)
        const userId = req.session.user_id
        //const detail = await userData.findById({ _id: userId })
        if (userId) {
            await Cart.updateOne({ userId }, { $pull: { cartItems: { "productId": productId } } })
            res.send({ success: true })
        } else {
            //req.flash('error', 'You are unable to access the product')
            res.redirect('back')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadCart,
    addToCart,
    itemInc,
    itemDec,
    itemDelete
}