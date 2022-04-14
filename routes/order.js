const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const orderSchema = require("../schemas/orderSchema");
const Order = new mongoose.model("Order", orderSchema);
const {
    verifyTokenAndAuthorization,
    verifyTokenAndSuperAdminOrVendor,
} = require("./verifyToken");

router.post("/place", verifyTokenAndAuthorization, async (req, res) => {
    // console.log(req.body);
    const newOrder = new Order(req.body);
    await newOrder.save((err) => {
        if (err) {
            // console.log(err);
            res.status(500).json({
                status: 1,
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                status: 0,
                message: "Order placed successfully!",
            });
        }
    });
});

// get all orders
router.get("/", async (req, res) => {
    try {
        await Order.find({})
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
                        message: "Order retrieve successfully!",
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

// approve vendor
router.put("/:id", verifyTokenAndSuperAdminOrVendor, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
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
            message: "Order status updated successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
