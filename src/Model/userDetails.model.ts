import mongoose,{Schema} from "mongoose";
 
const userDetailSchema:Schema = new Schema({
    id : {
        type : String,
        autoGenerate : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    contact : {
        type : String,
        require : true,
        unique : true
    },
    address : {
        type : String, 
        trim : true
    }, 
    location: {
        type : String, 
        require: true
    },
    lang : {
        type: String, 
        enum : ['EN','RU','ES'],
        default : 'EN'
    },
    currency: {
        type: String,
        enum: ['USD','RUB','ESA']
    },
    workingHrs: {
        type: String,
        default : "MON-FRI 10AM-6PM"
    }
},{
    timestamps : true
});

userDetailSchema.index({ userId: 1 });

export const userDetailModel = mongoose.model('UserDetail', userDetailSchema); 