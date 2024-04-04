const express = require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../Schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { index, renderNewForm, newPostListing ,showListing, renderEditForm,  deleteListing, updatelisting} = require("../controllers/listings.controller.js");
const multer  = require('multer');
const {storage}  = require("../cloudConfig.js");
const upload = multer({ storage });


router
    .route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(newPostListing ));
    


router.get("/new",isLoggedIn ,renderNewForm);


router
    .route("/:id")
    .get(wrapAsync(showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync( updatelisting))
    .delete(isLoggedIn,isOwner,wrapAsync(deleteListing));


router.get("/:id/edit",isLoggedIn,wrapAsync(renderEditForm));


module.exports = router;