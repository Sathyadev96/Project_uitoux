import mongoose,{Schema} from "mongoose";
 
const whislistSchema:Schema = new Schema({
    id : {
        type : String,
        autoGenerate : true
    }, 
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User' 
    },
    productId : Array,    

},{
    timestamps : true
});
 
export const whislistModel = mongoose.model('Whislist', whislistSchema); 