"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetail = void 0;
const userDetails_model_1 = require("../Model/userDetails.model");
const UserDetail = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ status: 400, message: "Data not found!.." });
        }
        await userDetails_model_1.userDetailModel.create(req.body).then((data) => {
            return res.status(200).send({ status: 200, result: data, message: "userDetail Created.." });
        }).catch((error) => {
            return res.status(400).send({ status: 400, error: error, message: "Error on userDetail Creation.." });
        });
    }
    catch (error) {
        console.error('Error on Create userDetail:', error);
        throw error;
    }
};
exports.UserDetail = UserDetail;
module.exports = {
    UserDetail: exports.UserDetail
};
