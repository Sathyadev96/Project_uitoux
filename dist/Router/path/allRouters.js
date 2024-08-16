"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../../Controller/user.controller");
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
Router.post('/create', user_controller_1.CreateUser);
Router.get('/display', user_controller_1.EditUser);
Router.patch('/edit', user_controller_1.EditUser);
Router.delete('/delete', user_controller_1.DeleteUser);
exports.default = Router;
