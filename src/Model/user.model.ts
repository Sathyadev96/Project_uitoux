import mongoose,{Schema} from "mongoose";
 
const userSchema:Schema = new Schema({
    id : {
        type : String,
        autoGenerate : true
    },
    name : {
        type : String,
        require : true,
        trim : true
    },
    email : {
        type : String,
        require : true,
        unique : true,
        trim : true
    },
    password : {
        type : String,
        require : true
    },
    type: {
        type : String, 
        enum : ['user','company'],
        default : 'user'
    },
    status : {
        type: String, 
        enum : ['active','inactive'],
        default : 'active'
    }
},{
    timestamps : true
});

userSchema.index({ email: 1 });

export const userModel = mongoose.model('User', userSchema); 