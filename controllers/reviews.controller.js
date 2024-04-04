const Listing = require("../models/listing");
const Review = require("../models/review");

 
 module.exports.reviewPost=async  (req, res) =>{
    let { id } = req.params;
    let listing= await Listing.findById(id);
    let newReview  = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save(); 
    console.log("newReview saved");
    req.flash("success","New Review is created");
    res.redirect(`/listing/${id}`);
};


module.exports.deleteReview= async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is Deleted");
    res.redirect(`/listing/${id}`) ; // Add a leading slash before "listing"
}

