const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { getAllCategories, addCategory, editCategory, deleteCategory, deleteSubCategory, editSubCategory, addSubCategory } = require("../controllers/categoryController");

const categoryRouter = express.Router()

categoryRouter.get("/", auth, getAllCategories)
categoryRouter.post("/create", auth, addCategory)
categoryRouter.post("/create/:categoryId", auth, addSubCategory)
categoryRouter.patch("/update/:categoryId", auth, editCategory)
categoryRouter.patch("/update/:categoryId/:subCategoryId", auth, editSubCategory)
categoryRouter.delete("/delete/:categoryId", auth, deleteCategory)
categoryRouter.delete("/delete/:categoryId/:subCategoryId", auth, deleteSubCategory)

module.exports = {
    categoryRouter
}