const Brand = require("../models/brandModel");


const loadBrands = async(req,res)=>{
    try {
        const brandData = await Brand.find({})
        res.render('brands',{brands:brandData})
    } catch (error) {
        console.log(error.message);
    }
}

const newBrandLoad = async(req, res)=>{
    try {
        res.render('new-brand')
    } catch (error) {
        console.log(error.message);
    }
}

const addBrand = async(req, res)=>{
    try {

        const brand = new Brand({
            name:req.body.name,
        });

        const brandData = await brand.save();

        if (brandData) {
            //res.send('Category added successfully')
            res.redirect('/admin/brands')
        } else {
            res.render('new-brand',{message:'Something went wrong...'});
        }
        
    } catch (error) {
        console.log();
    }
}

const editBrandLoad = async(req, res)=>{
    try {
        const id = req.query.id;
        const brandData = await Brand.findById({ _id:id});
        if (brandData) {
            res.render('edit-brand',{brand:brandData});
        } else {
            res.redirect('admin/brands')
        }
    } catch (error) {
        console.log(message.error);
    }
}

const updateBrand = async(req, res)=>{
    try {

        const brandData = await Brand.findByIdAndUpdate({ _id:req.body.id},{ $set:{ name:req.body.name}});

        res.redirect('/admin/brand')
        
    } catch (error) {
        console.log(error.message);
    }
}

const deleteBrand = async(req, res)=>{
    try {
        const id = req.query.id;
        await Brand.deleteOne({ _id:id });
        res.redirect('/admin/brands');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadBrands,
    newBrandLoad,
    addBrand,
    editBrandLoad,
    updateBrand,
    deleteBrand
}