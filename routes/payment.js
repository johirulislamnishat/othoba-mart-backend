const express = require("express");
const { default: mongoose } = require("mongoose");
const { verifyTokenAndAdminOrVendor } = require("./verifyToken");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const productSchema = require("../schemas/productSchema");
const Product = new mongoose.model("Product", productSchema);

// const allItems = await Product.find();
// const storeItems = new Map([
//     [1, { priceInCents: 10000, name: "Learn React Today" }],
//     [2, { priceInCents: 20000, name: "Learn CSS Today" }],
// ]);
// const storeItem = await Product.findById(item.id);
// console.log(storeItem);
// const price = storeItem.product_price * 100;
// console.log(price);
// console.log(item.quantity);

router.post("/", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.items.map((item) => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: item.quantity,
                };
            }),
            success_url: `${process.env.CLIENT_URL}/admin/orders`,
            cancel_url: `${process.env.CLIENT_URL}/admin/orders`,
        });
        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
