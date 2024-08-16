import {productModel} from "../Model/product.model";
import {whislistModel} from "../Model/whislist.model";
import {reviewModel} from "../Model/reviews.model";
import {productOfferModel} from "../Model/productOffer.model";

// Basic Create for Product,Whishlist,Review,Offer collection & Display Product with review & ratings query

 export const product= async (req:any,res:any)=>{
    try{  
        if(!req.body){ 
          return res.status(400).send({status: 400  , message: "Data not found!.."});
        } 

        const randomNumber = Math.floor(Math.random() * Math.pow(10, 6)); 
        const formatted = randomNumber.toString().padStart(6, '0');

        req.body.partNumber = "SKU-"+formatted;
        console.log("\n partNumber:", req.body.partNumber)

          await productModel.create(req.body).then((data)=>{
            return res.status(200).send({status: 200 , result: data, message: "product Created.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on product Creation.."});
          })
    }catch(error){
        console.error('Error on Create product:', error);
        throw error;
    }
};

export const whislist= async (req:any,res:any)=>{
    try{  
        if(!req.body){ 
          return res.status(400).send({status: 400  , message: "Data not found!.."});
        } 

          await whislistModel.create(req.body).then((data)=>{
            return res.status(200).send({status: 200 , result: data, message: "whislist Created.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on whislist Creation.."});
          })
    }catch(error){
        console.error('Error on Create whislist:', error);
        throw error;
    }
};
 
export const review= async (req:any,res:any)=>{
    try{  
        if(!req.body){ 
          return res.status(400).send({status: 400  , message: "Data not found!.."});
        } 

          await reviewModel.create(req.body).then((data)=>{
            return res.status(200).send({status: 200 , result: data, message: "review Created.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on review Creation.."});
          })
    }catch(error){
        console.error('Error on Create review:', error);
        throw error;
    }
};

export const offer= async (req:any,res:any)=>{
    try{  
        if(!req.body){ 
          return res.status(400).send({status: 400  , message: "Data not found!.."});
        } 

          await productOfferModel.create(req.body).then((data)=>{
            return res.status(200).send({status: 200 , result: data, message: "product offer Created.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on product offer Creation.."});
          })
    }catch(error){
        console.error('Error on Create product offer:', error);
        throw error;
    }
};

// Query for Product Display with grouping of category, manufacturer:

export const productBy_category_manufacturer =async(req:any,res:any)=>{
  try{
    const sort = req.body.sort ? req.body.sort : { name : 1 };
    const limit = req.body.limit ? req.body.limit : 5;

    const query = [{
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "updates"
      }
    },{
      $unwind: {
        path: "$updates", 
        preserveNullAndEmptyArrays: true
      }
    },{
      $lookup: {
        from: "users",
        localField: "updates.reviewer",
        foreignField: "_id",
        as: "user"
      }
    },
     {
      $unwind: {
        path: "$user",
         preserveNullAndEmptyArrays: true
      }
    },{
      $group: {
        _id: {
          category : "$category",
          manufacturer: "$manufacturer"
        },
        name : { $first:  "$name"},
        model: { $first:"$model"},
        manufacturer: { $first: "$manufacturer"},
        price:{ $first: "$price"},
        weight: { $first:"$weight"},
        review :{ $first: "$updates.comment"},
        rating:{ $first: "$updates.ratings"},
        user : { $first:"$user.name"}
      }
    },{
      $sort : sort
    },{
      $limit : limit
    }];

    const result = await productModel.aggregate(query); 
    return res.status(200).send({status: 200 , result: result, message: "product display by category, manufacture with reviews and ratings.."});

  }catch(error){
    console.error('Error on product grouping query:', error);
    throw error;
}
}

export const productByOffers =async(req:any,res:any)=>{
  try{

    if(!req.body.condition){
      return res.status(400).send({status: 400 , Errormessage: "Condition not found.."});
    }
    const sort = req.body.sort ? req.body.sort : { name : 1 };
    const limit = req.body.limit ? req.body.limit : 5;

    console.log("\n condition: ", req.body.condition)

    const query = [{
      $match: 
        req.body.condition      
    },{
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "prodInfo"
      }
    },{
      $unwind: {
        path: "$prodInfo",
        preserveNullAndEmptyArrays :true
      }
    },{
      $lookup: {
        from: "reviews",
        localField: "prodInfo._id",
        foreignField: "productId",
        as: "review"
      }
    },
     {
      $unwind: {
        path: "$review",
        preserveNullAndEmptyArrays: true
        
      }
    },{
      $lookup: {
        from: "reviews",
        localField: "prodInfo._id",
        foreignField: "productId",
        as: "review"
      }
    },
     {
      $unwind: {
        path: "$review",
        preserveNullAndEmptyArrays: true
        
      }
    },{
       $lookup: {
         from: "users",
         localField: "review.reviewer",
         foreignField: "_id",
         as: "user"
       }
    },{
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true
      }
    },
     {
       $group: {
         _id: {
           category:  "$prodInfo.category",
           product : "$prodInfo._id"
         },
        product : {
          $first: "$prodInfo.name"      
        },
         model: {
           $first: "$prodInfo.model"
         },
         manufacture: {
           $first: "$prodInfo.manufacturer"
         },
         price: {
           $first: "$prodInfo.price"
         },
         weight: {
           $first: "$prodInfo.weight"
         },
         review : {
           $first : "$review.comment"
         },
         ratings:{
           $first: "$review.ratings"
         }
       }
    },{
      $sort : sort
    },{
      $limit : limit
    }
     ];

    const result = await productOfferModel.aggregate(query); 
    return res.status(200).send({status: 200 , result: result, message: "product offers with reviews and ratings.."});

  }catch(error){
    console.error('Error on product grouping query:', error);
    throw error;
}
}

module.exports = {
    product,whislist,review,offer,productBy_category_manufacturer,productByOffers
}