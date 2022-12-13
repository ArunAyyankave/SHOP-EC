const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    deleteStatus:{
        type:Boolean,
        default:false
    }

}, {timestamps:true});

module.exports = mongoose.model('Category',categorySchema);