import Listing from "./models/listings.js";
import Review from "./models/reviews.js";
import schemaValidations from './schema.js';
import customError from "./utils/customError.js";


const {listingSchema,reviewSchema} = schemaValidations;

let isLoggedIn = async (req,res,next) => {
 console.log("is user logged in ?" , req.user);
 
 let loggedIn = req.isAuthenticated(); 
 if(!loggedIn) {
    req.session.redirectUrl = req.originalUrl;
    console.log('redirectUrl: ', req.session.redirectUrl);
    req.flash("listingError","You must be logIn to perform this action ");
    return res.redirect("/login");
 } 
 next();
}
// this is because the session data will be refreshed by passport after authenticating 
let saveRedirectURL = async (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;   
    };
    next();
}

let isOwner = async (req,res,next) =>{
   let {id} = req.params;
   let singleListing = await Listing.findById(id); 
   if( singleListing && !singleListing.owner._id.equals(res.locals.currUser._id) ){
      req.flash("listingError","you are not the owner of the listing ");
      return res.redirect(`/listings/${id}`);
   }
   next();
};

let isReviewOwner = async (req,res,next) =>{
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId); 
    console.log(review);
    console.log(review.author._id);
    console.log(res.locals.currUser);
    
    if( review && !review.author._id.equals(res.locals.currUser._id  || typeof (res.locals.currUser) === "undefined" || typeof (review.author._id) === "undefined") ){
       req.flash("listingError","you are not the owner of the review ");
       return res.redirect(`/listings/${id}`);
    }
    next();
 };


let listingValidation = (req,res,next) => {
   // let validationResult  = listingSchema.validate(req.body);
   let {error} =  listingSchema.validate(req.body);
   if(error) {
       let errorMsg = error.details.map(el=>el.message).join(",");
       throw new customError(400,errorMsg);
   }else{
       next();
   }
}



let reviewValidation = (req,res,next) => {
    console.log("post request received");
    
    console.log(req.body);
    
    // let validationResult  = listingSchema.validate(req.body);
    let {error} =  reviewSchema.validate(req.body);
    if(error) {
        let errorMsg = error.details.map(el=>el.message).join(",");
        throw new customError(400,errorMsg);
    }else{
        next();
    }
}


export default {isLoggedIn , isOwner ,listingValidation ,reviewValidation ,saveRedirectURL ,isReviewOwner }; 