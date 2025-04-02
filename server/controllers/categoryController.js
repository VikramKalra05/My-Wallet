const { CategoryModel } = require("../models/categoryModel");
const mongoose = require("mongoose");

const getAllCategories = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const categories = await CategoryModel.find({ userId }).lean();

    if (categories.length > 0) {
      res.status(200).json({ categories });
    } else {
      res.status(404).json({ msg: "Categories not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
};

const addCategory = async (req, res) => {
  try {
    const { categoryName, subCategory } = req.body;
    const { userId } = req.body.user;

    // Convert array of subcategory names into objects with unique IDs
    const subCategories = (subCategory || []).map((name) => ({
      _id: new mongoose.Types.ObjectId(),
      subCategoryName: name,
    }));

    const newCategory = new CategoryModel({
      userId,
      categoryName,
      subCategories,
    });

    await newCategory.save();
    res.status(201).json({ message: "Category added", category: newCategory });
  } catch (error) {
    res.status(500).json({ error: "Error adding category" });
  }
};

const addSubCategory = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { categoryId } = req.params;
    const { subCategoryName } = req.body;

    // Find the category and ensure it belongs to the user
    const category = await CategoryModel.findOne({ _id: categoryId, userId });

    if (!category) {
      return res
        .status(404)
        .json({ error: "Category not found or unauthorized" });
    }

    // Create a new subcategory with a unique ID
    const newSubCategory = {
      _id: new mongoose.Types.ObjectId(),
      subCategoryName,
    };

    // Push the new subcategory into the category's subCategories array
    category.subCategories.push(newSubCategory);

    await category.save();
    res.status(201).json({ message: "Subcategory added", category });
  } catch (error) {
    res.status(500).json({ error: "Error adding subcategory" });
  }
};

const editCategory = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { categoryId } = req.params;
    const { categoryName } = req.body;

    // Find the category by ID and check if it belongs to the user
    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this category" });
    }

    // Update the category name if it belongs to the user
    category.categoryName = categoryName;
    const updatedCategory = await category.save();

    res
      .status(200)
      .json({ message: "Category updated", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ error: "Error updating category" });
  }
};

const editSubCategory = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { categoryId, subCategoryId } = req.params;
    const { subCategoryName } = req.body;

    // Find the category and ensure it belongs to the user
    const category = await CategoryModel.findOne({ _id: categoryId, userId });

    if (!category) {
      return res
        .status(404)
        .json({ error: "Category not found or unauthorized" });
    }

    // Find the subcategory within the category
    const subCategory = category.subCategories.id(subCategoryId);

    if (!subCategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    // Update subcategory name
    subCategory.subCategoryName = subCategoryName;

    await category.save();
    res.status(200).json({ message: "Subcategory updated", category });
  } catch (error) {
    res.status(500).json({ error: "Error updating subcategory" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { categoryId } = req.params;

    // Find the category by ID and check if it belongs to the user
    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this category" });
    }

    // Delete the category
    await CategoryModel.findByIdAndDelete(categoryId);

    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { categoryId, subCategoryId } = req.params;

    // Find the category by ID and check if it belongs to the user
    const category = await CategoryModel.findById(categoryId);
    console.log("Category found:", category);
    console.log("Subcategories:", category.subCategories);
    console.log("SubCategoryId:", subCategoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this subcategory" });
    }

    // Check if subcategory exists
    const subCategoryExists = category.subCategories.some(
      (sub) => sub._id.toString() === subCategoryId
    );

    if (!subCategoryExists) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    // Remove the subcategory
    category.subCategories = category.subCategories.filter(
      (sub) => sub._id.toString() !== subCategoryId
    );

    const updatedCategory = await category.save();

    res
      .status(200)
      .json({ message: "Subcategory deleted", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ error: "Error deleting subcategory" });
  }
};

module.exports = {
  getAllCategories,
  addCategory,
  addSubCategory,
  editCategory,
  editSubCategory,
  deleteSubCategory,
  deleteCategory,
};
