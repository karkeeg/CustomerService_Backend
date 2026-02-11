const Category = require("../models/categoryModel");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ category_name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      category_name: { $regex: new RegExp(`^${category_name}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await Category.create({ category_name });
    console.log("Category created successfully:", category);
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: error.message });
  }
};
