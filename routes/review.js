const express = require("express");
const router= express.Router({mergeParams :true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,  isReviewAuthor, validatereview} = require("../middleware.js");
const { reviewPost, deleteReview } = require("../controllers/reviews.controller.js");




// post route
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewPost));


// DELETE REVIEW
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(deleteReview));

module.exports =router;
