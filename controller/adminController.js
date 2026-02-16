const userModel = require("../models/userModel");
const serviceModel = require("../models/serviceModel");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalConsumers = await userModel.countDocuments({ role: "consumer" });
    const totalProviders = await userModel.countDocuments({ role: "provider" });
    const totalServices = await serviceModel.countDocuments();
    const pendingProviders = await userModel.countDocuments({ role: "provider", isApproved: false });

    res.status(200).json({
      consumers: totalConsumers,
      providers: totalProviders,
      services: totalServices,
      pendingProviders: pendingProviders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProviders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const providers = await userModel.find({ role: "provider", isApproved: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await userModel.countDocuments({ role: "provider", isApproved: true });

    res.status(200).json({
      providers,
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

exports.getAllConsumers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const consumers = await userModel.find({ role: "consumer", isApproved: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await userModel.countDocuments({ role: "consumer", isApproved: true });

    res.status(200).json({
      consumers,
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

exports.getAllServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const services = await serviceModel.find()
      .populate("providerId", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await serviceModel.countDocuments();

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

exports.approveProvider = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // Trigger notification for the approved provider
    const notificationData = {
      recipient: user._id,
      title: "Account Approved",
      message: "Congratulations! Your provider account has been approved by the admin. You can now start creating services.",
      type: "approval",
    };

    await createNotification(notificationData);

    // Trigger Push Notification
    const { sendPushNotification } = require("../utils/pushNotificationHelper");
    await sendPushNotification(
      user._id,
      notificationData.title,
      notificationData.message,
      { type: "approval" }
    );

    res.status(200).json({ message: "Provider approved successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await serviceModel.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Also delete services related to this user if they are a provider
    if (user.role === "provider") {
      await serviceModel.deleteMany({ providerId: user._id });
    }
    res.status(200).json({ message: "User and related services deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update service moderation status
exports.updateServiceModerationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved or rejected

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid moderation status" });
    }

    const service = await serviceModel.findByIdAndUpdate(
      id,
      { moderationStatus: status },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Trigger notification for the provider
    const { createNotification } = require("./notificationController");
    const { sendPushNotification } = require("../utils/pushNotificationHelper");

    const notificationData = {
      recipient: service.providerId,
      title: `Service ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your service "${service.title}" has been ${status} by the admin.`,
      type: "moderation",
    };

    await createNotification(notificationData);
    await sendPushNotification(
      service.providerId,
      notificationData.title,
      notificationData.message,
      { serviceId: service._id.toString() }
    );

    res.status(200).json({ message: `Service ${status} successfully`, service });
  } catch (error) {
    console.error("Error updating service moderation status:", error);
    res.status(500).json({ error: error.message });
  }
};
