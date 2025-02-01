import mongoose from "mongoose";
import Review from "./reviews.js";

const Schema  = mongoose.Schema;

const listingSchema = new Schema({
    title        : {
        type     : String,
        required : true
    } ,
    description  : String ,
    image        : {
        url : String,
        fileName : String
                            
    } ,
    location     : {
        type        : String,
        required    : true
    } ,
    country      :  {
        type        : String,
        required    : true
    } ,
    price        :  {
        type        : Number,
        required    : true
    },
    reviews : [{
        type : Schema.Types.ObjectId ,
        ref : "Review",
    }] , 
    owner : {
        type : Schema.Types.ObjectId,
        ref  : "User" 
    },
    geoCordinates:  {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
    
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        console.log("deeleting revies of that list ");
        
        await Review.deleteMany({ _id : {$in : listing.reviews}});

    }
})

const Listing = mongoose.model("Listing", listingSchema);

export default Listing ;