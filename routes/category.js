const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const categorySchema = require("../schemas/categorySchema");
const Category = new mongoose.model("Category", categorySchema);
const { verifyTokenAndAdminOrVendor } = require("./verifyToken");

router.post("/", verifyTokenAndAdminOrVendor, async (req, res) => {
    // console.log(req.body);
    const newCategory = new Category(req.body);
    await newCategory.save((err) => {
        if (err) {
            // console.log(err);
            res.status(500).json({
                status: 1,
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                status: 0,
                message: "Category added successfully!",
            });
        }
    });
});

// get all categories
router.get("/", verifyTokenAndAdminOrVendor, async (req, res) => {
    await Category.find({})
        .populate("subCategories", "-__v -createdAt -updatedAt")
        .select("-__v -createdAt -updatedAt")
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
                    message: "All category data retrieve successfully!",
                });
            }
        });
});

module.exports = router;
