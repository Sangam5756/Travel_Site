const express = require("express");
const User = require("../models/user.js");
const user = require("../models/user.js");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { renderSignupForm, signupPost, renderLogin, loginPost, logout } = require("../controllers/users.controller.js");


router
.route("/signup")
.get(renderSignupForm)
.post( wrapAsync (signupPost));


router
.route("/login")
.get(renderLogin)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect : "/login", failureFlash:true}),loginPost);


// LOGOUT
router.get("/logout",logout);

module.exports = router;