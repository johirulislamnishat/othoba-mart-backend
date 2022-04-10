const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        product_img: {
            type: String,
            required: true,
        },
        product_name: {
            type: String,
            required: true,
        },
        product_description: {
            type: String,
            required: true,
        },
        product_price: {
            type: Number,
            required: true,
        },
        product_category: {
            type: Array,
        },
        product_tags: {
            type: Array,
        },
        product_colors: {
            type: Array,
        },
        product_sizes: {
            type: Array,
        },
        shop: {
            type: mongoose.Types.ObjectId,
            ref: "Shop",
        },
    },
    { timestamps: true }
);

module.exports = productSchema;
