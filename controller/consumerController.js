const Service = require("../models/serviceModel");
const ServiceRequest = require("../models/serviceRequestModel");

// Get all available services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).populate("providerId", "username email");
    res.status(200).json(services);
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
    res.status(201).json({ message: "Service requested successfully", request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get consumer's requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ consumerId: req.user._id })
      .populate("providerId", "username email")
      .populate("serviceId");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
