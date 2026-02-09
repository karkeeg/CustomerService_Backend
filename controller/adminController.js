const userModel = require("../models/userModel");

exports.getAllProviders = async (req, res) => {
  try {
    const providers = await userModel.find({ role: "provider" });
    res.status(200).json(providers);
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
    res.status(200).json({ message: "Provider approved successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
