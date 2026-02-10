const Service = require("../models/serviceModel");
const ServiceRequest = require("../models/serviceRequestModel");

// Get all available services with pagination, search, and filtering
exports.getAllServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category;

    const filter = { isActive: true };
    
    // Add search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Add category filter
    if (category) {
      filter.category = category;
    }

    const services = await Service.find(filter)
      .populate("providerId", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(filter);

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

// Create a service request
exports.requestService = async (req, res) => {
  try {
    const { serviceId, providerId } = req.body;
    const request = await ServiceRequest.create({
      consumerId: req.user._id,
      providerId,
      serviceId
    });
    
    const populatedRequest = await ServiceRequest.findById(request._id)
      .populate("providerId", "username email")
      .populate("serviceId");
    
    res.status(201).json({ message: "Service requested successfully", request: populatedRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get consumer's requests with pagination and filtering
exports.getMyRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = { consumerId: req.user._id };
    if (status) {
      filter.status = status;
    }

    const requests = await ServiceRequest.find(filter)
      .populate("providerId", "username email")
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

// Cancel a service request
exports.cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await ServiceRequest.findOne({ _id: id, consumerId: req.user._id });
    
    if (!request) {
      return res.status(404).json({ error: "Request not found or unauthorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Only pending requests can be cancelled" });
    }

    request.status = "cancelled";
    await request.save();

    res.status(200).json({ message: "Request cancelled successfully", request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
