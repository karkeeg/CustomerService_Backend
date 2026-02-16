const ProviderProfile = require("../models/providerProfileModel");
const Service = require("../models/serviceModel");
const ServiceRequest = require("../models/serviceRequestModel");
const userModel = require("../models/userModel");
const { createNotification } = require("../utils/notificationHelper");

// Create or update provider profile
exports.updateProfile = async (req, res) => {
  try {
    const { servicesOffered, experience, location } = req.body;
    let profile = await ProviderProfile.findOneAndUpdate(
      { userId: req.user._id },
      { servicesOffered, experience, location },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all services for the provider with pagination
exports.getProviderServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const services = await Service.find({ providerId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments({ providerId: req.user._id });

    res.status(200).json({
      services,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new service
exports.createService = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const user = await userModel.findById(req.user._id);
    console.log("Creating service - User:", user.username, "Role:", user.role, "Approved:", user.isApproved);
    
    if (user.role !== "provider") {
      console.log("Access denied: User is not a provider");
      return res.status(403).json({ error: "Only providers can create services" });
    }

    if (!user.isApproved) {
      console.log("Access denied: Provider account pending approval");
      return res.status(403).json({ error: "Your account is pending approval" });
    }

    const Category = require("../models/categoryModel");
    
    // Fetch category to check price limits
    const existingCategory = await Category.findOne({ 
      category_name: { $regex: new RegExp(`^${category}$`, 'i') } 
    });

    if (existingCategory) {
      if (price < existingCategory.minPrice || price > existingCategory.maxPrice) {
        return res.status(400).json({ 
          error: `Price must be between Rs.${existingCategory.minPrice} and Rs.${existingCategory.maxPrice} for the ${category} category.` 
        });
      }
    } else {
      // If category doesn't exist, create it with default limits
      await Category.create({ category_name: category });
    }

    const service = await Service.create({
      providerId: req.user._id,
      title,
      description,
      price,
      category,
      images: req.body.images || [], // Add images support
    });
    console.log("Service created successfully:", service);
    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, isActive } = req.body;

    const service = await Service.findOne({ _id: id, providerId: req.user._id });
    
    if (!service) {
      return res.status(404).json({ error: "Service not found or unauthorized" });
    }

    const Category = require("../models/categoryModel");
    const targetCategoryName = category || service.category;
    const targetPrice = price !== undefined ? price : service.price;

    const existingCategory = await Category.findOne({ 
      category_name: { $regex: new RegExp(`^${targetCategoryName}$`, 'i') } 
    });

    if (existingCategory) {
      if (targetPrice < existingCategory.minPrice || targetPrice > existingCategory.maxPrice) {
        return res.status(400).json({ 
          error: `Price must be between Rs.${existingCategory.minPrice} and Rs.${existingCategory.maxPrice} for the ${targetCategoryName} category.` 
        });
      }
    } else if (category) {
      // If a new category is provided but doesn't exist, create it
      await Category.create({ category_name: category });
    }

    if (title) service.title = title;
    if (description) service.description = description;
    if (price !== undefined) service.price = price;
    if (category) service.category = category;
    if (typeof isActive !== 'undefined') service.isActive = isActive;
    if (req.body.images) service.images = req.body.images; // Add images support

    await service.save();
    console.log("Service updated successfully:", service);
    res.status(200).json({ message: "Service updated successfully", service });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findOneAndDelete({ _id: id, providerId: req.user._id });
    
    if (!service) {
      return res.status(404).json({ error: "Service not found or unauthorized" });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get requests for provider with pagination and filtering
exports.getProviderRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = { providerId: req.user._id };
    if (status) {
      filter.status = status;
    }

    const requests = await ServiceRequest.find(filter)
      .populate("consumerId", "username email")
      .populate("serviceId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ServiceRequest.countDocuments(filter);

    res.status(200).json({
      requests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update request status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const request = await ServiceRequest.findById(requestId);
    
    if (!request || request.providerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Request not found or unauthorized" });
    }

    request.status = status;
    await request.save();
    
    const populatedRequest = await ServiceRequest.findById(requestId)
      .populate("consumerId", "username email")
      .populate("serviceId")
      .populate("providerId", "username");

    // Notify the consumer
    const notificationData = {
      recipient: populatedRequest.consumerId._id,
      sender: req.user._id,
      title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your request for ${populatedRequest.serviceId.title} has been ${status} by ${populatedRequest.providerId.username}.`,
      type: "request",
      metadata: { requestId: populatedRequest._id },
    };

    await createNotification(notificationData);

    // Trigger Push Notification
    const { sendPushNotification } = require("../utils/pushNotificationHelper");
    await sendPushNotification(
      populatedRequest.consumerId._id,
      notificationData.title,
      notificationData.message,
      { requestId: populatedRequest._id.toString() }
    );
    
    res.status(200).json({ message: `Request ${status}`, request: populatedRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
