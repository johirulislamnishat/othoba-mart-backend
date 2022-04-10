const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const categorySchema = require("../schemas/categorySchema");
const Category = new mongoose.model("Category", categorySchema);
const subCategorySchema = require("../schemas/subCategorySchema");
const SubCategory = new mongoose.model("SubCategory", subCategorySchema);
const { verifyTokenAndAdminOrVendor } = require("./verifyToken");

router.post("/", verifyTokenAndAdminOrVendor, async (req, res) => {
    // console.log(req.body);
    const newSubCategory = new SubCategory(req.body);
    try {
        const addSubCat = await newSubCategory.save();
        await Category.updateOne(
            {
                _id: req.body.category_id,
            },
            {
                $push: {
                    subCategories: addSubCat._id,
                },
            }
        );
        res.status(200).json({
            status: 0,
            message: "Sub-Category added successfully!",
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
