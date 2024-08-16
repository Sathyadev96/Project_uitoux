"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../Controller/user.controller");
const userDetails_controller_1 = require("../Controller/userDetails.controller");
const product_controller_1 = require("../Controller/product.controller");
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
// USER ROUTER
Router.post('/login', user_controller_1.LoginUser);
Router.post('/user/create', user_controller_1.CreateUser);
Router.get('/user/display', user_controller_1.DisplayUser);
Router.get('/user/display/:id', user_controller_1.DisplayUser);
Router.patch('/user/edit/:id', user_controller_1.EditUser);
Router.delete('/user/delete/:id', user_controller_1.DeleteUser);
// CREATE ROUTER
Router.post('/create-user-detail', userDetails_controller_1.UserDetail);
Router.post('/create-product', product_controller_1.product);
Router.post('/create-whislist', product_controller_1.whislist);
Router.post('/create-review', product_controller_1.review);
Router.post('/create-offer', product_controller_1.offer);
// DISPLAY PRODUCTS WITH CONSTRAINS ROUTER
Router.get('/product-category', product_controller_1.productBy_category_manufacturer);
Router.post('/product-offers', product_controller_1.productByOffers);
exports.default = Router;
