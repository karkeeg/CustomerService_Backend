const { get } = require("mongoose");
const ProductModel = require("../models/productModel");
const orderModel = require("../models/orderModel");

// Helper to build full image URL (now Cloudinary URLs are already full)
const getFullImageUrl = (req, imagePath) => {
  if (!imagePath) return "";
  // Cloudinary URLs are already full URLs, just ensure they're strings
  return imagePath.toString();
};

exports.addProduct = async (req, res) => {
  let productToAdd = await ProductModel.create({
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_description: req.body.product_description,
    product_rating: req.body.product_rating,
    count_in_stock: req.body.count_in_stock,
    product_image: req.file?.path, // This will be the Cloudinary URL
    category: req.body.category,
  });
  if (!productToAdd) {
    return res.status(400).json({ error: "something went wrong" });
  }
  // Add full image URL
  const productWithImage = {
    ...productToAdd._doc,
    product_image: getFullImageUrl(req, productToAdd.product_image),
  };
  res.send(productWithImage);
};

// Get all products
exports.getAllProduct = async (req, res) => {
  let products = await ProductModel.find().populate("category");
  if (!products) {
    return res.status(400).json({ error: "something went wrong" });
  }
  const productsWithFullImage = products.map((product) => ({
    ...product._doc,
    product_image: getFullImageUrl(req, product.product_image),
  }));
  res.send(productsWithFullImage);
};

// Get product details
exports.getProductDetails = async (req, res) => {
  let product = await ProductModel.findById(req.params.id).populate("category");
  if (!product) {
    return res.status(400).json({ error: "Product not found" });
  }
  const productWithImage = {
    ...product._doc,
    product_image: getFullImageUrl(req, product.product_image),
  };
  res.send(productWithImage);
};

// Get product by category
exports.getProductByCategory = async (req, res) => {
  let products = await ProductModel.find({ category: req.params.categoryId });
  if (!products) {
    return res.status(400).json({ error: "Product not found" });
  }
  const productsWithFullImage = products.map((product) => ({
    ...product._doc,
    product_image: getFullImageUrl(req, product.product_image),
  }));
  res.send(productsWithFullImage);
};

//update product
exports.updateProduct = async (req, res) => {
  // Note: Cloudinary automatically handles old file deletion when you upload a new one
  // No need to manually delete files

  let productToUpdate = await ProductModel.findByIdAndUpdate(
    req.params.id,
    {
      product_name: req.body.product_name,
      product_price: req.body.product_price,
      product_description: req.body.product_description,
      product_rating: req.body.product_rating,
      count_in_stock: req.body.count_in_stock,
      product_image: req.file?.path, // This will be the new Cloudinary URL
      category: req.body.category,
    },
    { new: true }
  );

  if (!productToUpdate) {
    return res.status(400).json({ error: " Something went wrong" });
  }
  const updatedProductWithImage = {
    ...productToUpdate._doc,
    product_image: getFullImageUrl(req, productToUpdate.product_image),
  };
  res.send(updatedProductWithImage);
};

//deleting product
exports.deleteProduct = (req, res) => {
  ProductModel.findByIdAndDelete(req.params.id)
    .then((deleteProduct) => {
      if (!deleteProduct) {
        return res.status(400).json({ error: "Product Not Found" });
      } else {
        // Note: Cloudinary files are not automatically deleted when products are deleted
        // You may want to implement manual deletion if needed
        return res.send({ message: "Product deleted successfully" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};

exports.getFilteredProducts = async (req, res) => {
  let filterArgs = {};
  for (var key in req.body) {
    if (req.body[key].length > 0) {
      if (key == "category") {
        filterArgs[key] = req.body[key];
      } else {
        filterArgs[key] = {
          $lte: req.body[key][1],
          $gte: req.body[key][0],
        };
      }
    }
  }
  console.log("frontend", req.body, "Backend", filterArgs);

  let products = await ProductModel.find(filterArgs).populate("category");
  if (!products) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(products);
};

exports.getRelatedProducts = async (req, res) => {
  let product = await ProductModel.findById(req.params.id);
  if (!product) {
    return res.status(400).json({ error: "Product not found" });
  }

  let products = await ProductModel.find({
    category: product.category,
    _id: { $ne: product._id },
  }).populate("category");
  if (!products) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(products);
};

exports.getTrendingProducts = async (req, res) => {
  try {
    const trendingProducts = await orderModel.aggregate([
      // Join orderItems array
      {
        $lookup: {
          from: "orderitems", // collection name (lowercase plural by MongoDB)
          localField: "orderItems",
          foreignField: "_id",
          as: "orderItemsDetails",
        },
      },
      // Unwind the order items
      { $unwind: "$orderItemsDetails" },

      // Group by product and count quantity
      {
        $group: {
          _id: "$orderItemsDetails.product",
          totalSold: { $sum: "$orderItemsDetails.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 12 },

      // Lookup product details
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },

      // Final projection
      {
        $project: {
          _id: "$productDetails._id",
          title: "$productDetails.product_name",
          price: "$productDetails.product_price",
          image: "$productDetails.product_image",
          totalSold: 1,
        },
      },
    ]);

    // Ensure image URLs are full and use forward slashes
    const trendingWithFullImage = trendingProducts.map((prod) => ({
      ...prod,
      image: prod.image ? getFullImageUrl(req, prod.image) : "",
    }));

    res.status(200).json(trendingWithFullImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trending products" });
  }
};
