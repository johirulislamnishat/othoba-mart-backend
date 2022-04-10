const mongoose = require("mongoose");

const vendorSchema = mongoose.Schema(
    {
        shop_logo: {
            type: String,
            required: true,
        },
        vendor_name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        vendor: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        shop_name: {
            type: String,
            required: true,
            unique: true,
        },
        shop_address: {
            type: String,
            required: true,
        },
        shop_city: {
            type: String,
            required: true,
        },
        shop_country: {
            type: String,
            required: true,
        },
        shop_email: {
            type: String,
        },
        shop_phone: {
            type: String,
        },
        shop_products: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    { timestamps: true }
);

module.exports = vendorSchema;
