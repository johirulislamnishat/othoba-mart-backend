const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        user_name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isVendor: {
            type: String,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isSuperAdmin: {
            type: Boolean,
            default: false,
        },
        isCustomer: {
            type: String,
            default: true,
        },
        shop_name: {
            type: String,
            unique: true,
        },
        shop: {
            type: mongoose.Types.ObjectId,
            ref: "Shop",
        },
        vendor_status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

module.exports = userSchema;
