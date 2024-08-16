 
import bcrypt from "bcrypt";
import {userModel} from "../Model/user.model";
import {userDetailModel} from "../Model/userDetails.model";
import mongoose from "mongoose";
import { whislistModel } from "../Model/whislist.model";
import { productModel } from "../Model/product.model";

 export const CreateUser = async (req:any,res:any)=>{
    try{  
        if(!req.body.password){
          console.log('Password Parameter not found!  ');
          return res.status(400).send({status: 400  , message: "Password Parameter not found!.."});
        }

        const salt = await bcrypt.genSalt(10);  
        const hashedCode = await bcrypt.hash(req.body.password, salt); 
        req.body.password = hashedCode; 

          await userModel.create(req.body).then((data)=>{
            return res.status(200).send({status: 200 , result: data, message: "User Created.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on User Creatio.."});
          })
    }catch(error){
        console.error('Error on Create User :', error);
        throw error;
    }
};

export const LoginUser = async (req:any,res:any)=>{
  try{  
      if(!req.body.email || !req.body.password){
        console.log('Credentials invalid!..');
        return res.status(400).send({status: 400  , message: "Invalid credentials!.."});
      } 

      const client:any = await userModel.findOne({email: req.body.email});

      if(!client){
        return res.status(400).send({status: 400 , message: "User not available.."}); 
      }; 
       const authenticate = await bcrypt.compare(req.body.password,client?.password);
       if(!authenticate)  return res.status(400).send({status: 400 , message: "Invalid password.."}); 
       
       const whislist = await whislistModel.findOne({userId : new mongoose.Types.ObjectId(client?._id)});
       const cartItems:any = whislist ? whislist?.productId : [];

       const cartPrice = cartItems.length > 0 ? await calculateItems(cartItems) : 0;   
        
      const userData:any = await userDetailModel.findOne({ 'userId': new mongoose.Types.ObjectId(client?._id) }).populate('userId').exec();
      userData.cartPrice = cartPrice;
      userData.cartItems = cartItems.length;   
      return res.status(200).send({status: 200 ,data: userData ? userData : '', message: "User Authenticate.."}); 
        
  }catch(error){
      console.error('Error on Authenticate User :', error);
      throw error;
  }
};

export const EditUser = async (req:any,res:any)=>{
    try{
        if(!req.params.id){
            return 'Parameter not found!'
        } 

        let updateData:any = {};

        if(req.body.name){
          updateData.name = req.body.name;          
        }
        if(req.body.type){
          updateData.type = req.body.type
        }
        if(req.body.status){
          updateData.status = req.body.status
        } console.log("\n updatedata: ",updateData)
         
          await userModel.findByIdAndUpdate(req.params.id,updateData).then((data)=>{
            return res.status(200).send({status: 200 , result: data, message: "User Updated.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on User Update.."});
          })
    }catch(error){
        console.error('Error on Update User :', error);
        throw error;
    }
};

export const DeleteUser = async (req:any,res:any)=>{
    try{
        if(!req.params.id){
            return 'Parameter not found!'
        } 
          await userModel.findByIdAndDelete(req.params.id).then((data)=>{
            return res.status(200).send({status: 200 , result: data, message: "User Deleted.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on User Deletion.."});
          })
    }catch(error){
        console.error('Error on Delete User :', error);
        throw error;
    }
};

export const DisplayUser = async (req:any,res:any)=>{
    try{
      console.log('\n parameter: ', req.params.id)
        if(!req.params.id){
            await userModel.find().sort({name : 1}).limit(10).then((data)=>{
                return res.status(200).send({status: 200 , result: data, message: "User Displayed.."});
              }).catch((error)=>{ 
                return res.status(400).send({status: 400 , error: error, message: "Error on User Selection.."});
              }) 
        }
 
          await userModel.findById(req.params.id).then((data)=>{
            return res.status(200).send({status: 200 , result: data, message: "User Displayed.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on User Selection.."});
          })
    }catch(error){
        console.error('Error on Select User :', error);
        throw error;
    }
};

const calculateItems = async (itemId : any)=>{ 

  const items = itemId.map((id:string)=>{
    return new mongoose.Types.ObjectId(id)
  }) 

  const result = await productModel.aggregate([{
    $match: {
       _id : {
        $in : items
       }
    }
  },{
    $group:{
      _id: null,
      price : {
        $sum: "$price"
      }
    }
  }]);  

  return result[0].price;
}

module.exports = {
    CreateUser,
    EditUser,
    DeleteUser,
    DisplayUser,
    LoginUser
}
