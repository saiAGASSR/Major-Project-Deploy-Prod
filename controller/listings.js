import Listing from  '../models/listings.js'
import customError from '../utils/customError.js';


// mapBox
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
// import  pkg  from "@mapbox/mapbox-sdk/services/geocoding.js";
// const  =  "@mapbox/mapbox-sdk/services/geocoding";
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';

const mbxGeoCodingClient = mbxGeocoding({ accessToken: process.env.mapBox_access_token });

// const mbxGeoCodingClient = mbxGeocoding({ accessToken: process.env.mapBox_access_token });

let allListings = async (req,res,next)=>{

    let allListings = await Listing.find({})
    console.log("req reciedved");
    
    res.render("./listings/allListings",{allListings})
}

let  getNewListting = async(req,res)=>{
    res.render("./listings/addListForm")
    }

let getSingleListing = async (req,res)=>{
    let  id     = req.params.id ;
    console.log(id);
    
    let  singleListing  =  await Listing.findById(id).populate({ path:'reviews', populate: { path: "author"}}).populate("owner");
    console.log(singleListing);
    if(!singleListing){
        req.flash("listingError","The listing you are searching is deleted or does not exists");
        res.redirect("/listings");
    }
    
    res.render('listings/singleListing' , {singleListing})
    }

let postaddnewListing = async (req, res, next) => {

    let responce =  await mbxGeoCodingClient.forwardGeocode({
        // query: 'Paris, France',
        query: req.body.location,
        limit: 1
      })
        .send()
        console.log(`the location is : ${req.body.location}`);
        

    let coOrdinates = responce.body.features[0].geometry;
    console.log("is coOrdinates defined ? " , coOrdinates);
    
        // response.body.features   
    console.log(responce.body.features[0].geometry.coordinates);
    
    // res.send("it is working");
    // console.log(req.body);
    let imageObj = req.file;
    console.log("new post request ");
    console.log(req.body);
    // Create a new listing object
    let addList = new Listing({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        image: {
            url : imageObj.path,
            fileName : imageObj.filename
        },
        country: req.body.country,
        location: req.body.location,
        geoCordinates : coOrdinates
    });
    addList.owner = req.user._id;
    let savedListing = await addList.save();

    console.log(savedListing);
    
    req.flash("listingSuccess","new listing added successfully")
    res.redirect("/listings"); // Redirect after successful save

    console.log("added");
};

let getEditListing = async(req,res)=>{
    console.log(req.params.id);
    let id = req.params.id;
    let editListing = await Listing.findById(id);
    if(!editListing){
        req.flash("listingError","The listing you are searching is deleted or does not exists");
        res.redirect("/listings");
    }
    let replacedImageUrl = editListing.image.url ;
    console.log(replacedImageUrl)
    console.log(replacedImageUrl);
    replacedImageUrl = replacedImageUrl.replace("/upload","/upload/ar_1.0,c_fill,h_250/bo_5px_solid_black");
    console.log(replacedImageUrl);
    // https://res.cloudinary.com/demo/image/upload/ar_1.0,c_fill,h_250/bo_5px_solid_lightblue/leather_bag_gray.jpg
                    
    res.render("./listings/editListForm",{editListing , replacedImageUrl})
    
    };

let putEditNewListing = async(req,res)=>{
    let id = req.params.id;
    let imageObj = req.file;
    
    if(!req.body.listing){
        throw new customError(400,"please provide information")
    } 
    let updateJSONBody = req.body.listing;
    
    let editListing = await Listing.findByIdAndUpdate(id,{...updateJSONBody})

    if( typeof imageObj !== "undefined" ){
        editListing.image = {
            url : imageObj.path,
            fileName : imageObj.filename
        }
    await    editListing.save()
    }
    
    console.log('id in put is ',id);
    console.log('body in put is ',updateJSONBody);
    req.flash("listingSuccess","new listing edited successfully")
    res.redirect(`/listings/${id}`)
    
    };

let destroyListing = async(req,res)=>{
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("listingSuccess","listing deleted successfully")
    res.redirect("/listings");
    };

let destroyAllListing = async(req,res)=>{
    await Listing.deleteMany({});
    req.flash("listingSuccess","all listing deleted successfully")
    res.redirect("/listings");
};

export default  {allListings , getSingleListing , getNewListting,postaddnewListing , getEditListing , putEditNewListing , destroyListing , destroyAllListing};