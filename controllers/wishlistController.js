
const wishlistData = require('../models/wishlistModel')
const mongoose = require('mongoose')

const addToWishlist = async(req, res)=>{
    try {
        if (req.session.user_id) {
            const prodId = req.params.id
            const productId = new mongoose.Types.ObjectId(prodId)
            const userId = req.session.user_id
            
            
                const userExist = await wishlistData.findOne({ userId })
                if (userExist) {
                    const productExist = await wishlistData.findOne({
                        $and: [{ userId }, {
                            wishlistItems: {
                                $elemMatch: {
                                    productId
                                }
                            }
                        }]
                    })
                    if (productExist) {
                        res.send({ success: false })
                    } else {
                        await wishlistData.updateOne({ userId }, { $push: { wishlistItems: { productId } } })
                        res.send({ success: true })
                    }
                } else {
                    const wishlist = new wishlistData({
                        userId, wishlistItems: [{ productId }]
                    })
                    await wishlist.save()
                        .then(() => {
                            res.send({ success: true })
                        })
                        .catch((err) => {
                            res.render('error',{err})
                        })
                }
            
        } else {
            //req.flash('error', 'You are not logged in')
            res.redirect('back')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const userWishlist = async(req,res)=>{
    try {
        const user = req.session.user_id
        const userId = mongoose.Types.ObjectId(user)
        
        const { prodId } = req.params.id
        const productId = new mongoose.Types.ObjectId(prodId)
        const wishlistProducts = await wishlistData.aggregate([{ $match: { userId } }, { $unwind: '$wishlistItems' },
                                                                { $project: { item: '$wishlistItems.productId' } },
                                                                { $lookup: { from: 'products', localField: 'item', foreignField: '_id', as: 'product' } }]);
           
        res.render('wishlist', { wishlistProducts })
    } catch (error) {
        console.log(error.message);
    }
}

const deleteWishlist = async(req,res)=>{
    try {
        const prodId = req.params.id
        const productId = new mongoose.Types.ObjectId(prodId)
        const userId = req.session.user_id
        
            await wishlistData.updateOne({ userId }, { $pull: { wishlistItems: { "productId": productId } } })
            res.send({ success: true })
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    addToWishlist,
    userWishlist,
    deleteWishlist
}