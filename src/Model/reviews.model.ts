import mongoose,{Schema} from "mongoose";
 
const reviewSchema:Schema = new Schema({
    id : {
        type : String,
        autoGenerate : true
    }, 
    reviewer : {
        type : Schema.Types.ObjectId,
        ref : 'User' 
    },
    productId : {
        type :  Schema.Types.ObjectId,
        ref : 'Product'  
    },
    comment :  {
        type : String,
        trim : true
    },
    ratings: {
        type : Number,
        min : 1,
        max: 5
    } 

},{
    timestamps : true
});
 

export const reviewModel = mongoose.model('Review', reviewSchema); 