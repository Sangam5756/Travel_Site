const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(res => console.log("connected to db")).catch(err => console.log(err));

// INITIALIZE DATA BASE FUNCTION
const initDB =  async() =>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj) =>({...obj, owner:"6604075ddc8a4f1370160bc7"}));
    await Listing.insertMany(initData.data);
    console.log("data was Intialize");

}

initDB();