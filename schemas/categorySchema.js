const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
    {
        category_name: {
            type: String,
            required: true,
            unique: true,
        },
        subCategories: [
            {
                type: mongoose.Types.ObjectId,
                ref: "SubCategory",
            },
        ],
    },
    { timestamps: true }
);

module.exports = categorySchema;
