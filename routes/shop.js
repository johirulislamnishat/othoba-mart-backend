const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { verifyTokenAndAdminOrVendor } = require("./verifyToken");
const { cloudinary } = require("../helper/cloudinary.config");
const shopSchema = require("../schemas/shopSchema");
const Shop = new mongoose.model("Shop", shopSchema);
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);

// add a shop
router.post("/", verifyTokenAndAdminOrVendor, async (req, res) => {
    const file = req.files.shop_logo;
    try {
        await cloudinary.uploader.upload(
            file.tempFilePath,
            async (err, result) => {
                const filePath = result.secure_url;
                const newShop = new Shop({
                    ...req.body,
                    vendor: req.user.id,
                    shop_logo: filePath,
                });
                const addShop = await newShop.save();
                await User.updateOne(
                    {
                        _id: req.user.id,
                    },
                    {
                        $set: {
                            shop: addShop._id,
                        },
                    }
                );
            }
        );
        res.status(200).json({
            status: 0,
            message: "Shop data added successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
    // await cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
    //     const filePath = result.secure_url;
    //     const newShop = new Shop({
    //         ...req.body,
    //         vendor: req.user.id,
    //         shop_logo: filePath,
    //     });
    //     const addShop = await newShop.save((err) => {
    //         if (err) {
    //             console.log(err);
    //             res.status(500).json({
    //                 status: 1,
    //                 error: "There was a server side error!",
    //             });
    //         } else {
    //             res.status(200).json({
    //                 status: 0,
    //                 message: "Shop data added successfully!",
    //             });
    //         }
    //     });
    //     console.log("req => ", req.user);
    //     await User.updateOne(
    //         {
    //             _id: req.user.id,
    //         },
    //         {
    //             $push: {
    //                 shop: addShop._id,
    //             },
    //         }
    //     );
    // });
});

// get all shops
router.get("/", async (req, res) => {
    await Shop.find({})
        .populate("vendor", "-password -__v -createdAt -updatedAt")
        .select(
            "_id shop_logo shop_name shop_address shop_country shop_city shop_email shop_phone status"
        )
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
                    message: "All shops data retrieve successfully!",
                });
            }
        });
});

// get a single shop data
router.get("/:id", verifyTokenAndAdminOrVendor, async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        res.status(200).json({
            status: 0,
            result: shop,
            message: "Shop data retrieve successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

// update a shop
router.put("/:id", verifyTokenAndAdminOrVendor, async (req, res) => {
    try {
        const updatedShop = await Shop.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({
            status: 0,
            result: updatedUser,
            message: "Shop data updated successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
