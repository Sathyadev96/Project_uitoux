import {CreateUser,EditUser,DeleteUser,DisplayUser, LoginUser} from '../Controller/user.controller';
import {UserDetail} from '../Controller/userDetails.controller';
import {product,whislist,review, offer,productByOffers,productBy_category_manufacturer} from '../Controller/product.controller';

import express from "express"; 
const Router = express.Router();
 
// USER ROUTER
Router.post('/login',LoginUser);

Router.post('/user/create',CreateUser);
Router.get('/user/display',DisplayUser);
Router.get('/user/display/:id',DisplayUser);
Router.patch('/user/edit/:id',EditUser);
Router.delete('/user/delete/:id',DeleteUser);

// CREATE ROUTER
Router.post('/create-user-detail',UserDetail);

Router.post('/create-product',product);
Router.post('/create-whislist',whislist);
Router.post('/create-review',review);
Router.post('/create-offer',offer);

// DISPLAY PRODUCTS WITH CONSTRAINS ROUTER
Router.get('/product-category',productBy_category_manufacturer);
Router.post('/product-offers',productByOffers);


export default Router;