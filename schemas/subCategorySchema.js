const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
    {
        subCategory_name: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

module.exports = subCategorySchema;
