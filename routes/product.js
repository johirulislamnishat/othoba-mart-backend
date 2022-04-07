const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const productSchema = require("../schemas/productSchema");
const Product = new mongoose.model("Product", productSchema);
const { verifyTokenAndAdminOrVendor } = require("./verifyToken");
const { cloudinary } = require("../helper/cloudinary.config");

// get all products
router.get("/", async (req, res) => {
    await Product.find({}, (err, data) => {
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
    })
        .clone()
        .catch(function (err) {
            console.log(err);
        });
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
router.post("/add", async (req, res) => {
    // console.log("body ", req.body);
    // console.log("file ", req.files);
    const file = req.files.photo;
    await cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
        // console.log(result);
        const filePath = result.secure_url;
        // console.log(filePath);
        const newProduct = new Product({
            product_img: filePath,
            product_name: req.body.product_name,
            product_description: req.body.product_description,
            product_price: req.body.product_price,
            product_category: req.body.product_category,
            product_tags: req.body.product_tags,
            product_colors: req.body.product_colors,
            product_sizes: req.body.product_sizes,
        });
        newProduct.save((err) => {
            if (err) {
                // console.log(err);
                res.status(500).json({
                    status: 1,
                    error: "There was a server side error!",
                });
            } else {
                res.status(200).json({
                    status: 0,
                    message: "Product added successfully!",
                });
            }
        });
    });
});

// router.post("/add", verifyTokenAndAdminOrVendor, async (req, res) => {
//     // console.log(req.body);
//     const newProduct = new Product(req.body);
//     await newProduct.save((err) => {
//         if (err) {
//             // console.log(err);
//             res.status(500).json({
//                 status: 1,
//                 error: "There was a server side error!",
//             });
//         } else {
//             res.status(200).json({
//                 status: 0,
//                 message: "Product added successfully!",
//             });
//         }
//     });
// });

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
