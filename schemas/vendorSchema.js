const mongoose = require("mongoose");

const vendorSchema = mongoose.Schema(
    {
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
        shop_name: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isVendor: {
            type: Boolean,
            default: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isCustomer: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            default: "Pending",
        },
    },
    { timestamps: true }
);

module.exports = vendorSchema;
