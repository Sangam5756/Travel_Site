if(process.env.NODE_ENV  != "production"){
    require("dotenv").config();
}


const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const Mongostore = require("connect-mongo");
const  flash  = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const { isError } = require("joi");


// Models
const User= require("./models/user.js");
const Review = require("./models/review.js");
// routes
const listingRouter = require("./routes/listing.js");
const reviewRouter  = require("./routes/review.js");
const userRouter    = require("./routes/user.js");
const { Duplex } = require("stream");


const dburl = process.env.ATLASDB_URL;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(dburl);
};
main()
.then(res => console.log("connected to db"))
.catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const store = Mongostore.create({
    mongoUrl:dburl,
    crypto:{
        secret : process.env.SECRET,

    },
    touchAfter: 24*3600,
    
});
store.on("error",()=>{
    console.log("Error in Mongo-session-store",err);
})
const sessionOption = {
    store,
    secret :  process.env.SECRET,
    resave :false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
};



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser =req.user;
    next();
});


app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter )


app.all("*",(req, res, next) =>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs",{err});
});

app.listen(8000, (req, res) => {
    console.log("server  is listening on port 8000");
});