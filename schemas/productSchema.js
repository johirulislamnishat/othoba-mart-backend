const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        product_img: {
            type: String,
            required: true,
        },
        gallery: {
            type: Array,
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
        status: {
            type: String,
            enum: [
                "featured",
                "best_selling",
                "new_arrival",
                "promoted",
                "pending",
                "regular",
            ],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = productSchema;
