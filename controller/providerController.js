const ProviderProfile = require("../models/providerProfileModel");
const Service = require("../models/serviceModel");
const ServiceRequest = require("../models/serviceRequestModel");
const userModel = require("../models/userModel");

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

// Add a new service
exports.createService = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const user = await userModel.findById(req.user._id);
    
    if (user.role !== "provider") {
      return res.status(403).json({ error: "Only providers can create services" });
    }

    if (!user.isApproved) {
      return res.status(403).json({ error: "Your account is pending approval" });
    }

    const service = await Service.create({
      providerId: req.user._id,
      title,
      description,
      price,
      category
    });
    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get requests for provider
exports.getProviderRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ providerId: req.user._id })
      .populate("consumerId", "username email")
      .populate("serviceId");
    res.status(200).json(requests);
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
    res.status(200).json({ message: `Request ${status}`, request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
