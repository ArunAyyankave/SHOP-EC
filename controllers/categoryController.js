const Category = require("../models/categoryModel");

const loadCategories = async(req,res)=>{
    try {
        const categoryData = await Category.find({})
        res.render('categories',{categories:categoryData})
    } catch (error) {
        console.log(error.message);
    }
}

const newCategoryLoad = async(req, res)=>{
    try {
        res.render('new-category')
    } catch (error) {
        console.log(error.message);
    }
}

const addCategory = async(req, res)=>{
    try {

        const product = new Category({
            name:req.body.name,
        });

        const CategoryData = await product.save();

        if (CategoryData) {
            //res.send('Category added successfully')
            res.redirect('/admin/categories')
        } else {
            res.render('new-category',{message:'Something went wrong...'});
        }
        
    } catch (error) {
        console.log();
    }
}

const editCategoryLoad = async(req, res)=>{
    try {
        const id = req.query.id;
        const categoryData = await Category.findById({ _id:id});
        if (categoryData) {
            res.render('edit-category',{category:categoryData});
        } else {
            res.redirect('admin/categories')
        }
    } catch (error) {
        console.log(message.error);
    }
}

const updateCategory = async(req, res)=>{
    try {

        const categoryData = await Category.findByIdAndUpdate({ _id:req.body.id},{ $set:{ name:req.body.name}});

        res.redirect('/admin/categories')
        
    } catch (error) {
        console.log(error.message);
    }
}

const deleteCategory = async(req, res)=>{
    try {
        const id = req.query.id;
        await Category.deleteOne({ _id:id });
        res.redirect('/admin/categories');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadCategories,
    newCategoryLoad,
    addCategory,
    editCategoryLoad,
    updateCategory,
    deleteCategory
}




