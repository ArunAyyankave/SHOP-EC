const coupenData = require('../models/coupenModel')
const cartData = require('../models/cartModel')

const coupens = async (req, res) => {
    try {
        const coupens = await coupenData.find({})
        res.render('coupens', { coupens })
    } catch (err) {
        console.log(err.message)
    }
}

const addCoupen = async (req, res) => {
    try {
        res.render('addCoupen')
    } catch (err) {
        console.log(err.message);
    }
}

const saveCoupen = async (req, res) => {
    try {
        const coupen = new coupenData({
            code: req.body.code,
            discount: req.body.discount
        })
        await coupen.save()
        //req.flash('success', 'Coupen added successfully')
        res.redirect('/admin/coupons')
    } catch (error) {
        console.log(err.message);
    }
}

const deleteCoupen = async (req, res) => {
    try {
        const { id } = req.params
        await coupenData.findByIdAndDelete(id)
        res.send({ send: true })
        //res.redirect('/admin/coupons')
    } catch (error) {
        console.log(error.message);
    }
} 

const applyCoupen = async (req, res) => {
    try {
        const usercode = req.params.id
        const code = await coupenData.find({ code: usercode })
        if (code) {
            if (code[0].expiresAt > Date.now()) {
                const userId = req.session.user_id
                await cartData.findOneAndUpdate({ userId }, { coupenCode: usercode })
                const discount = code[0].discount
                res.send({ success: discount })
            } else {
                await coupenData.findOneAndDelete({ code: usercode })
                req.flash('error', 'Invalid code')
                res.redirect('back')
            }
        } else {
            req.flash('error', 'Invalid code')
            res.redirect('back')
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    coupens,
    addCoupen,
    saveCoupen,
    deleteCoupen,
    applyCoupen
}