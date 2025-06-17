const Region = require("../models/region");
const Kingdom = require("../models/kingdom");

// Get all regions
exports.getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find().populate("kingdom", "name ruler");

    res.status(200).json({
      success: true,
      count: regions.length,
      data: regions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch regions",
      error: error.message,
    });
  }
};

// Get a single region by ID
exports.getRegionById = async (req, res) => {
  try {
    const region = await Region.findById(req.params.id).populate("kingdom");

    if (!region) {
      return res.status(404).json({
        success: false,
        message: `Region with id ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: region,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid Region ID format",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch region",
      error: error.message,
    });
  }
};

// Get regions by kingdom ID
exports.getRegionsByKingdom = async (req, res) => {
  try {
    const kingdomId = req.params.kingdomId;

    // Check if kingdom exists
    const kingdom = await Kingdom.findById(kingdomId);
    if (!kingdom) {
      return res.status(404).json({
        success: false,
        message: `Kingdom with id ${kingdomId} not found`,
      });
    }

    const regions = await Region.find({ kingdom: kingdomId }).populate(
      "kingdom",
      "name ruler"
    );

    res.status(200).json({
      success: true,
      count: regions.length,
      kingdomName: kingdom.name,
      data: regions,
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
      message: "Failed to fetch regions by kingdom",
      error: error.message,
    });
  }
};

// Create a new region
exports.createRegion = async (req, res) => {
  try {
    // Check if the associated kingdom exists
    const kingdomExists = await Kingdom.findById(req.body.kingdom);
    if (!kingdomExists) {
      return res.status(404).json({
        success: false,
        message: `Kingdom with id ${req.body.kingdom} not found`,
      });
    }

    const region = await Region.create(req.body);

    res.status(201).json({
      success: true,
      data: region,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create region",
      error: error.message,
    });
  }
};

// Update a region
exports.updateRegion = async (req, res) => {
  try {
    // If kingdom ID is being updated, check if it exists
    if (req.body.kingdom) {
      const kingdomExists = await Kingdom.findById(req.body.kingdom);
      if (!kingdomExists) {
        return res.status(404).json({
          success: false,
          message: `Kingdom with id ${req.body.kingdom} not found`,
        });
      }
    }

    const region = await Region.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("kingdom", "name ruler");

    if (!region) {
      return res.status(404).json({
        success: false,
        message: `Region with id ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: region,
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
        message: "Invalid Region or Kingdom ID format",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update region",
      error: error.message,
    });
  }
};

// Delete a region
exports.deleteRegion = async (req, res) => {
  try {
    const region = await Region.findByIdAndDelete(req.params.id);

    if (!region) {
      return res.status(404).json({
        success: false,
        message: `Region with id ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Region deleted successfully",
      data: {},
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid Region ID format",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete region",
      error: error.message,
    });
  }
};
