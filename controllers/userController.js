const User = require('../models/userModel');
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const config = require("../config/config");
const client = require("twilio")(config.accountSID, config.authToken)

const securePassword = async(password)=>{

    try {
        
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }

}

//for send mail
const sendVerifyMail = async(name, email, user_id)=>{

    try {
        
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'arunayk712@gmail.com',
                pass:'nykfjdbclkklppaj'
            }
        });
        const mailOptions = {
            from:'arunayk712@gmail.com',
            to:email,
            subject:'For Verification mail',
            html:'<p>Hii '+name+', please click here to <a href="http://127.0.0.1:3000/verify?id='+user_id+'"> Verify </a> your mail.</p>'
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent:- ",info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }

}

const loadRegister = async(req,res)=>{
    try {

        res.render('registration')
        
    } catch (error) {
        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{

    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            
            password:spassword,
            is_admin:0
        });

        const userData = await user.save();

        if(userData){
            //sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render('otp',{userinfo:userData});

            client
                .verify
                .services(config.serviceID)
                .verifications
                .create({
                    to:req.body.mno,
                    channel:'sms'
                })
                .then((data)=>{
                    res.status(200).send(data)
                })
        }
        else{
            res.render('registration',{message:"Your registration has been failed."});
        }

    } catch (error) {
        console.log(error.messsage);
    }

}

const verifyPhone = (req, res)=>{

    client
        .verify
        .services(config.serviceID)
        .verificationChecks
        .create({
            to:`+${req.body.mobile}`,
            code:req.body.otp
        })
        .then(async(data)=>{
            //res.status(200).send(data)
            const updateInfo = await User.updateOne({_id:req.body.id},{ $set:{ is_verified:1 } });
            //console.log(updateInfo);
            res.send('success!!!')
        })

}


const verifyMail = async(req, res)=>{

    try {
        
        const updateInfo = await User.updateOne({_id:req.query.id},{ $set:{ is_verified:1 } });

        console.log(updateInfo);
        res.render("email-verified")

    } catch (error) {
        console.log(error.message);
    }

}

//login user methods

const loginLoad = async(req,res)=>{

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

    const userData= await User.findOne({email:email});

    if (userData) {
        
        const passwordMatch = await bcrypt.compare(password,userData.password);
        if (passwordMatch) {
            if (userData.is_verified === 0) {
                res.render('login',{message:"Please verify your mail."});
            }
            else if(userData.is_admin === 0){
                req.session.user_id = userData._id;
                res.redirect('/userhome');
            }
            else{
                res.render('login',{message:"Email and password is incorrect"});
            }
        }
        else {
            res.render('login',{message:"Email and password is incorrect"});
        }
    }
    else {
        res.render('login',{message:"Email and password is incorrect"});
    }

} catch (error) {
    console.log(error.message);
}

}

const loadHome = async(req,res)=>{
    try {
        const userData =  await User.findById({ _id:req.session.user_id });
        res.render('home',{ user:userData });

    } catch (error) {
        console.log(error.message);
    }
}

//jkhhffjkhkjhfj
const loaduserHome = async(req,res)=>{
    try {
        const userData =  await User.findById({ _id:req.session.user_id });
        const productData = await Product.find({})
        const categoryData = await Category.find({})
        res.render('userhome',{ user:userData, product:productData, category:categoryData });

    } catch (error) {
        console.log(error.message);
    }
}

const userLogout = async(req,res)=>{

    try {
        
       delete req.session.user_id;
        res.redirect('/');

    } catch (error) {
        console.log(error.message);
    }

}

const LandingPage = async(req, res)=>{

    try {
        const productData = await Product.find({})
        const categoryData = await Category.find({})
        res.render('userhome',{product:productData, category:categoryData })
    } catch (error) {
        console.log(error.message);
    }

}

const loadProduct = async(req, res)=>{
    try {
        const { id } = req.params
        const productDetails = await Product.findById(id)
        res.render('productDetails',{details:productDetails})
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    LandingPage,
    loaduserHome,
    verifyPhone,
    loadProduct,
}