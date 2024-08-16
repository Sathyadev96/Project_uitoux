import mongoose,{Schema} from "mongoose";
 
const productSchema:Schema = new Schema({
    id : {
        type : String,
        autoGenerate : true
    },
    image: String,
    name : {
        type : String,
        require : true,
        trim : true
    },
    model : {
        type : String,
        require : true,
        unique : true,
        trim : true
    }, 
    manufacturer: {
        type : String,
        require : true
    },  
    price : {
        type: Number, 
        require: true
    },
    weight : {
        type: Number,
        require: true
    },
    inStock : {
        type:  Boolean,
        default: true
    },
    category: {
        type: String,
        enum : ['Manufacture','Automative','Electronics','Plumbing'],
        default: 'Manufacture'
    },
    partNo:  String,  

},{
    timestamps : true
});

productSchema.index({ category: 1 });

export const productModel = mongoose.model('Product', productSchema); 