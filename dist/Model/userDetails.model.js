"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDetailModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userDetailSchema = new mongoose_1.Schema({
    id: {
        type: String,
        autoGenerate: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    contact: {
        type: String,
        require: true,
        unique: true
    },
    address: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        require: true
    },
    lang: {
        type: String,
        enum: ['EN', 'RU', 'ES'],
        default: 'EN'
    },
    currency: {
        type: String,
        enum: ['USD', 'RUB', 'ESA']
    },
    workingHrs: {
        type: String,
        default: "MON-FRI 10AM-6PM"
    }
}, {
    timestamps: true
});
userDetailSchema.index({ userId: 1 });
exports.userDetailModel = mongoose_1.default.model('UserDetail', userDetailSchema);
