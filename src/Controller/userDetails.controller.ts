import {userDetailModel} from "../Model/userDetails.model";

 export const UserDetail= async (req:any,res:any)=>{
    try{  
        if(!req.body){ 
          return res.status(400).send({status: 400  , message: "Data not found!.."});
        } 

          await userDetailModel.create(req.body).then((data)=>{
            return res.status(200).send({status: 200 , result: data, message: "userDetail Created.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on userDetail Creation.."});
          })
    }catch(error){
        console.error('Error on Create userDetail:', error);
        throw error;
    }
};

module.exports = {
    UserDetail
}