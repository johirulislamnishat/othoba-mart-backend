const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
    {
        user_name: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        purchased_items: [
            {
                item_name: {
                    type: String,
                    required: true,
                },
                item_qty: {
                    type: Number,
                    required: true,
                },
                item_total_price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        total_price: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = orderSchema;
