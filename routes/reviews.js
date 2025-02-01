import express from 'express';

import wrapAsync from '../utils/wrapAsyncError.js';
import middlewares from '../middleware.js';
import reviewController from "../controller/reviews.js"

const {isReviewOwner , isLoggedIn ,reviewValidation} = middlewares;
let {newReview  , destroyReview} = reviewController

const  router = express.Router({mergeParams: true});


router.post("/", isLoggedIn , reviewValidation ,wrapAsync(newReview) )

router.delete("/:reviewId",isReviewOwner,wrapAsync(destroyReview) )

export default router;