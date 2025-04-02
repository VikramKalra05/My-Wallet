const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  categoryName: { type: String, required: true },
  subCategories: [
    {
      subCategoryId: Number,
      subCategoryName: String,
    },
  ],
},{
    versionKey: false
});

const CategoryModel = mongoose.model("categorie", categorySchema);

module.exports = { CategoryModel }
