const User = require("../models/user");

module.exports.renderSignupForm=(req, res) =>{
    res.render("users/signup.ejs");                               
};


module.exports.signupPost=async(req, res) =>{

    try {
        let {username, email, password} = req.body;
        const newUser=new User({email,username});
        const registeredUser =  await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listing")
        }) 
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
   
   
};

module.exports.renderLogin= (req, res) =>{
    res.render("users/login.ejs");
};



module.exports.loginPost=async(req, res) =>
        {
            req.flash("success", "Welcome back to Wanderlust!")
            let redirectUrl =res.locals.redirectUrl || "/listing"
           res.redirect(redirectUrl);

};


module.exports.logout=(req, res)=>{
    req.logOut((err) =>{
        if(err){
          return  next(err);
        }
        req.flash("success", "You are logout now");
        res.redirect("/listing");
    })
};