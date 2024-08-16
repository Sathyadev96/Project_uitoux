import mongoose,{Schema} from "mongoose";
 
const productOfferSchema:Schema = new Schema({
    id : {
        type : String,
        autoGenerate : true
    }, 
    productId : {
        type :  Schema.Types.ObjectId,
        ref : 'Product'  
    },
    topRated : { type: Boolean, default: false },
    featured : { type: Boolean, default: false },
    specialOffers : { type: Boolean, default: false },
    bestSeller : { type: Boolean, default: false }

},{
    timestamps : true
});
 

export const productOfferModel = mongoose.model('offer', productOfferSchema); 