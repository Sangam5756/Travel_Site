const { listingSchema } = require("../Schema");
const Listing = require("../models/listing");



module.exports.index=async (req, res) => { 
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm =(req, res) => {
    res.render("listings/new.ejs");

};

module.exports.newPostListing=async (req, res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    await newlisting.save();
    req.flash("success","New Listing is Created");
    res.redirect("/listing");

};


module.exports.showListing=async (req, res) => {

    let { id } = req.params;
    const list = await Listing.findById(id).populate({path:"reviews",populate:{path:"author", }}).populate("owner");
    // console.log(list);
    if(!list){
        req.flash("error","Listing you requested for doesn't exist");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs", { list });

};



module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error","Listing you requested for doesn't exist");
        res.redirect("/listing");
    }
    let originalImageUrl  = list.image.url;
    originalImageUrl.replace("/upload", "/upload/W_250");
    req.flash("success","Listing Is Edited");
    res.render("listings/edit.ejs", { list, originalImageUrl });
};



module.exports.updatelisting=async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file  !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        list.image = {url,filename};
        await list.save();
    }
    
    req.flash("success","Listing is Updated");
    console.log(list);
    res.redirect(`/listing/${id}`);
};






module.exports.deleteListing =async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Is Deleted");
    res.redirect("/listing");
};
