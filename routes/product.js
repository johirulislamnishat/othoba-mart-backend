const express = require("express");
const { default: mongoose } = require("mongoose");
const { verifyTokenAndAdminOrVendor } = require("./verifyToken");
const { cloudinary } = require("../helper/cloudinary.config");
const router = express.Router();
const productSchema = require("../schemas/productSchema");
const Product = new mongoose.model("Product", productSchema);
const shopSchema = require("../schemas/shopSchema");
const Shop = new mongoose.model("Shop", shopSchema);

// get all products
router.get("/", async (req, res) => {
    try {
        await Product.find({})
            .populate("shop", " -__v -createdAt -updatedAt -shop_products ")
            .select(" -__v -createdAt -updatedAt")
            .exec((err, data) => {
                if (err) {
                    res.status(500).json({
                        status: 1,
                        error: "There was a server side error!",
                    });
                } else {
                    res.status(200).json({
                        status: 0,
                        result: data,
                        message: "Products retrieve successfully!",
                    });
                }
            });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// get paginated products
router.get("/paginated", async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.size);
    try {
        const data = await Product.find()
            .limit(limit * 1)
            .skip(page * limit)
            .exec();
        const count = await Product.countDocuments();
        res.status(200).json({
            status: 0,
            result: data,
            total_items: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            message: "Paginated products retrieve successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// get single product data
router.get("/:id", async (req, res) => {
    try {
        const data = await Product.findById(req.params.id);
        res.status(200).json({
            status: 0,
            result: data,
            message: "Products retrieve successfully!",
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// add a product
router.post("/", verifyTokenAndAdminOrVendor, async (req, res) => {
    const file = req.files.photo;
    try {
        await cloudinary.uploader.upload(
            file.tempFilePath,
            async (err, result) => {
                const filePath = result.secure_url;
                const newProduct = new Product({
                    ...req.body,
                    product_img: filePath,
                    shop: req.user.shop_id,
                });
                const addProduct = await newProduct.save();
                console.log(addProduct);
                await Shop.updateOne(
                    {
                        _id: req.user.shop_id,
                    },
                    {
                        $push: {
                            shop_products: addProduct._id,
                        },
                    }
                );
            }
        );
        res.status(200).json({
            status: 0,
            message: "Product added successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// approve vendor
router.put("/status/:id", verifyTokenAndAdminOrVendor, async (req, res) => {
    try {
        const changeStatus = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: req.body.status,
                },
            },
            { new: true }
        );
        res.status(200).json({
            status: 0,
            message: "Product status changed successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// delete a product
router.delete("/:id", verifyTokenAndAdminOrVendor, async (req, res) => {
    const id = req.params.id;
    // console.log(id);
    const result = await Product.findOneAndDelete(id);
    res.status(200).json({
        status: 0,
        message: "Product deleted successfully!",
    });
});

module.exports = router;
