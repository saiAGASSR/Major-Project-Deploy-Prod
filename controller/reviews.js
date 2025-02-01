import Listing from  '../models/listings.js'
import Review from '../models/reviews.js';



let newReview = async (req,res,next)=>{
    let listingId = req.params.id;
    console.log('listingId: ', listingId);


    let newReview = new Review(req.body.review);
    // let reviewOwner = currUser._id;
    let reviewOwner = req.user._id;
    // newReview.push(reviewOwner);
    newReview.author = reviewOwner;
    console.log('newReview: ', newReview);
    let listing = await Listing.findById(listingId);

    console.log('listing: ', listing);

    listing.reviews.push(newReview);
    await newReview.save(),
    await listing.save();


    res.redirect(`/listings/${listingId}`)

};

let destroyReview = async (req,res,next)=>{
    let listingId = req.params.id;
    console.log('listingId: ', listingId);

    let reviewId = req.params.reviewId;
    console.log('reviewId: ', reviewId);

    
    let listing = await Listing.findById(listingId);
    console.log('listing: ', listing);

    // let listDelete = await Listing.deleteOne({ $pull : { reviews :  reviewId  } })
    let listDelete = await Listing.findByIdAndUpdate( listingId , { $pull : { reviews :  reviewId  } })
    console.log('listDelete: ', listDelete);

    let review = await Review.findByIdAndDelete(reviewId);
    console.log('review: ', review);

    res.redirect(`/listings/${listingId}`)

};

export default {newReview , destroyReview};