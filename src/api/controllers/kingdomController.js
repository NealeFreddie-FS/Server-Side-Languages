const Kingdom = require("../models/kingdom");

// Get all kingdoms
exports.getAllKingdoms = async (req, res) => {
  try {
    const kingdoms = await Kingdom.find();
    res.status(200).json({
      success: true,
      count: kingdoms.length,
      data: kingdoms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch kingdoms",
      error: error.message,
    });
  }
};

// Get a single kingdom by ID
exports.getKingdomById = async (req, res) => {
  try {
    const kingdom = await Kingdom.findById(req.params.id);

    if (!kingdom) {
      return res.status(404).json({
        success: false,
        message: `Kingdom with id ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: kingdom,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid Kingdom ID format",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch kingdom",
      error: error.message,
    });
  }
};

// Create a new kingdom
exports.createKingdom = async (req, res) => {
  try {
    const kingdom = await Kingdom.create(req.body);

    res.status(201).json({
      success: true,
      data: kingdom,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Kingdom with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create kingdom",
      error: error.message,
    });
  }
};

// Update a kingdom
exports.updateKingdom = async (req, res) => {
  try {
    const kingdom = await Kingdom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!kingdom) {
      return res.status(404).json({
        success: false,
        message: `Kingdom with id ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: kingdom,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid Kingdom ID format",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update kingdom",
      error: error.message,
    });
  }
};

// Delete a kingdom
exports.deleteKingdom = async (req, res) => {
  try {
    const kingdom = await Kingdom.findByIdAndDelete(req.params.id);

    if (!kingdom) {
      return res.status(404).json({
        success: false,
        message: `Kingdom with id ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Kingdom deleted successfully",
      data: {},
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid Kingdom ID format",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete kingdom",
      error: error.message,
    });
  }
};
