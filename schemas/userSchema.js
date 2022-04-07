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
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isCustomer: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = userSchema;
