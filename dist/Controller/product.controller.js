"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productByOffers = exports.productBy_category_manufacturer = exports.offer = exports.review = exports.whislist = exports.product = void 0;
const product_model_1 = require("../Model/product.model");
const whislist_model_1 = require("../Model/whislist.model");
const reviews_model_1 = require("../Model/reviews.model");
const productOffer_model_1 = require("../Model/productOffer.model");
// Basic Create for Product,Whishlist,Review,Offer collection & Display Product with review & ratings query
const product = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ status: 400, message: "Data not found!.." });
        }
        const randomNumber = Math.floor(Math.random() * Math.pow(10, 6));
        const formatted = randomNumber.toString().padStart(6, '0');
        req.body.partNumber = "SKU-" + formatted;
        console.log("\n partNumber:", req.body.partNumber);
        await product_model_1.productModel.create(req.body).then((data) => {
            return res.status(200).send({ status: 200, result: data, message: "product Created.." });
        }).catch((error) => {
            return res.status(400).send({ status: 400, error: error, message: "Error on product Creation.." });
        });
    }
    catch (error) {
        console.error('Error on Create product:', error);
        throw error;
    }
};
exports.product = product;
const whislist = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ status: 400, message: "Data not found!.." });
        }
        await whislist_model_1.whislistModel.create(req.body).then((data) => {
            return res.status(200).send({ status: 200, result: data, message: "whislist Created.." });
        }).catch((error) => {
            return res.status(400).send({ status: 400, error: error, message: "Error on whislist Creation.." });
        });
    }
    catch (error) {
        console.error('Error on Create whislist:', error);
        throw error;
    }
};
exports.whislist = whislist;
const review = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ status: 400, message: "Data not found!.." });
        }
        await reviews_model_1.reviewModel.create(req.body).then((data) => {
            return res.status(200).send({ status: 200, result: data, message: "review Created.." });
        }).catch((error) => {
            return res.status(400).send({ status: 400, error: error, message: "Error on review Creation.." });
        });
    }
    catch (error) {
        console.error('Error on Create review:', error);
        throw error;
    }
};
exports.review = review;
const offer = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ status: 400, message: "Data not found!.." });
        }
        await productOffer_model_1.productOfferModel.create(req.body).then((data) => {
            return res.status(200).send({ status: 200, result: data, message: "product offer Created.." });
        }).catch((error) => {
            return res.status(400).send({ status: 400, error: error, message: "Error on product offer Creation.." });
        });
    }
    catch (error) {
        console.error('Error on Create product offer:', error);
        throw error;
    }
};
exports.offer = offer;
// Query for Product Display with grouping of category, manufacturer:
const productBy_category_manufacturer = async (req, res) => {
    try {
        const sort = req.body.sort ? req.body.sort : { name: 1 };
        const limit = req.body.limit ? req.body.limit : 5;
        const query = [{
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "productId",
                    as: "updates"
                }
            }, {
                $unwind: {
                    path: "$updates",
                    preserveNullAndEmptyArrays: true
                }
            }, {
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
            }, {
                $group: {
                    _id: {
                        category: "$category",
                        manufacturer: "$manufacturer"
                    },
                    name: { $first: "$name" },
                    model: { $first: "$model" },
                    manufacturer: { $first: "$manufacturer" },
                    price: { $first: "$price" },
                    weight: { $first: "$weight" },
                    review: { $first: "$updates.comment" },
                    rating: { $first: "$updates.ratings" },
                    user: { $first: "$user.name" }
                }
            }, {
                $sort: sort
            }, {
                $limit: limit
            }];
        const result = await product_model_1.productModel.aggregate(query);
        return res.status(200).send({ status: 200, result: result, message: "product display by category, manufacture with reviews and ratings.." });
    }
    catch (error) {
        console.error('Error on product grouping query:', error);
        throw error;
    }
};
exports.productBy_category_manufacturer = productBy_category_manufacturer;
const productByOffers = async (req, res) => {
    try {
        if (!req.body.condition) {
            return res.status(400).send({ status: 400, Errormessage: "Condition not found.." });
        }
        const sort = req.body.sort ? req.body.sort : { name: 1 };
        const limit = req.body.limit ? req.body.limit : 5;
        console.log("\n condition: ", req.body.condition);
        const query = [{
                $match: req.body.condition
            }, {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "prodInfo"
                }
            }, {
                $unwind: {
                    path: "$prodInfo",
                    preserveNullAndEmptyArrays: true
                }
            }, {
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
            }, {
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
            }, {
                $lookup: {
                    from: "users",
                    localField: "review.reviewer",
                    foreignField: "_id",
                    as: "user"
                }
            }, {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: {
                        category: "$prodInfo.category",
                        product: "$prodInfo._id"
                    },
                    product: {
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
                    review: {
                        $first: "$review.comment"
                    },
                    ratings: {
                        $first: "$review.ratings"
                    }
                }
            }, {
                $sort: sort
            }, {
                $limit: limit
            }
        ];
        const result = await productOffer_model_1.productOfferModel.aggregate(query);
        return res.status(200).send({ status: 200, result: result, message: "product offers with reviews and ratings.." });
    }
    catch (error) {
        console.error('Error on product grouping query:', error);
        throw error;
    }
};
exports.productByOffers = productByOffers;
module.exports = {
    product: exports.product, whislist: exports.whislist, review: exports.review, offer: exports.offer, productBy_category_manufacturer: exports.productBy_category_manufacturer, productByOffers: exports.productByOffers
};
