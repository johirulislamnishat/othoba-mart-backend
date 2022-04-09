const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const orderSchema = require("../schemas/orderSchema");
const Order = new mongoose.model("Order", orderSchema);
const { verifyTokenAndAuthorization } = require("./verifyToken");

router.post("/place", verifyTokenAndAuthorization, async (req, res) => {
    console.log(req.body);
    const newOrder = new Order(req.body);
    await newOrder.save((err) => {
        if (err) {
            console.log(err);
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

module.exports = router;
