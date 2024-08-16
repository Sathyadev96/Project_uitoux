"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayUser = exports.DeleteUser = exports.EditUser = exports.LoginUser = exports.CreateUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../Model/user.model");
const userDetails_model_1 = require("../Model/userDetails.model");
const mongoose_1 = __importDefault(require("mongoose"));
const whislist_model_1 = require("../Model/whislist.model");
const product_model_1 = require("../Model/product.model");
const CreateUser = async (req, res) => {
    try {
        if (!req.body.password) {
            console.log('Password Parameter not found!  ');
            return res.status(400).send({ status: 400, message: "Password Parameter not found!.." });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedCode = await bcrypt_1.default.hash(req.body.password, salt);
        req.body.password = hashedCode;
        await user_model_1.userModel.create(req.body).then((data) => {
            return res.status(200).send({ status: 200, result: data, message: "User Created.." });
        }).catch((error) => {
            return res.status(400).send({ status: 400, error: error, message: "Error on User Creatio.." });
        });
    }
    catch (error) {
        console.error('Error on Create User :', error);
        throw error;
    }
};
exports.CreateUser = CreateUser;
const LoginUser = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            console.log('Credentials invalid!..');
            return res.status(400).send({ status: 400, message: "Invalid credentials!.." });
        }
        const client = await user_model_1.userModel.findOne({ email: req.body.email });
        if (!client) {
            return res.status(400).send({ status: 400, message: "User not available.." });
        }
        ;
        const authenticate = await bcrypt_1.default.compare(req.body.password, client?.password);
        if (!authenticate)
            return res.status(400).send({ status: 400, message: "Invalid password.." });
        const whislist = await whislist_model_1.whislistModel.findOne({ userId: new mongoose_1.default.Types.ObjectId(client?._id) });
        const cartItems = whislist ? whislist?.productId : [];
        const cartPrice = cartItems.length > 0 ? await calculateItems(cartItems) : 0;
        const userData = await userDetails_model_1.userDetailModel.findOne({ 'userId': new mongoose_1.default.Types.ObjectId(client?._id) }).populate('userId').exec();
        userData.price = cartPrice;
        console.log("\n ****:", userData?.name, userData?.contact, userData?.price);
        userData.cartItems = cartItems.length;
        userData.cartPrice = cartPrice;
        return res.status(200).send({ status: 200, data: userData ? userData : '', message: "User Authenticate.." });
    }
    catch (error) {
        console.error('Error on Authenticate User :', error);
        throw error;
    }
};
exports.LoginUser = LoginUser;
const EditUser = async (req, res) => {
    try {
        if (!req.params.id) {
            return 'Parameter not found!';
        }
        let updateData = {};
        if (req.body.name) {
            updateData.name = req.body.name;
        }
        if (req.body.type) {
            updateData.type = req.body.type;
        }
        if (req.body.status) {
            updateData.status = req.body.status;
        }
        console.log("\n updatedata: ", updateData);
        await user_model_1.userModel.findByIdAndUpdate(req.params.id, updateData).then((data) => {
            return res.status(200).send({ status: 200, result: data, message: "User Updated.." });
        }).catch((error) => {
            return res.status(400).send({ status: 400, error: error, message: "Error on User Update.." });
        });
    }
    catch (error) {
        console.error('Error on Update User :', error);
        throw error;
    }
};
exports.EditUser = EditUser;
const DeleteUser = async (req, res) => {
    try {
        if (!req.params.id) {
            return 'Parameter not found!';
        }
        await user_model_1.userModel.findByIdAndDelete(req.params.id).then((data) => {
            return res.status(200).send({ status: 200, result: data, message: "User Deleted.." });
        }).catch((error) => {
            return res.status(400).send({ status: 400, error: error, message: "Error on User Deletion.." });
        });
    }
    catch (error) {
        console.error('Error on Delete User :', error);
        throw error;
    }
};
exports.DeleteUser = DeleteUser;
const DisplayUser = async (req, res) => {
    try {
        console.log('\n parameter: ', req.params.id);
        if (!req.params.id) {
            await user_model_1.userModel.find().sort({ name: 1 }).limit(10).then((data) => {
                return res.status(200).send({ status: 200, result: data, message: "User Displayed.." });
            }).catch((error) => {
                return res.status(400).send({ status: 400, error: error, message: "Error on User Selection.." });
            });
        }
        await user_model_1.userModel.findById(req.params.id).then((data) => {
            return res.status(200).send({ status: 200, result: data, message: "User Displayed.." });
        }).catch((error) => {
            return res.status(400).send({ status: 400, error: error, message: "Error on User Selection.." });
        });
    }
    catch (error) {
        console.error('Error on Select User :', error);
        throw error;
    }
};
exports.DisplayUser = DisplayUser;
const calculateItems = async (itemId) => {
    const items = itemId.map((id) => {
        return new mongoose_1.default.Types.ObjectId(id);
    });
    const result = await product_model_1.productModel.aggregate([{
            $match: {
                _id: {
                    $in: items
                }
            }
        }, {
            $group: {
                _id: null,
                price: {
                    $sum: "$price"
                }
            }
        }]);
    return result[0].price;
};
module.exports = {
    CreateUser: exports.CreateUser,
    EditUser: exports.EditUser,
    DeleteUser: exports.DeleteUser,
    DisplayUser: exports.DisplayUser,
    LoginUser: exports.LoginUser
};
