const Region = require("../models/region");
const Kingdom = require("../models/kingdom");

// Mock data for demo mode when database is not available
const mockRegions = [
  {
    _id: "60d21d5867d0d8992e610c88",
    name: "Misty Mountains",
    kingdom: {
      _id: "60d21b4667d0d8992e610c85",
      name: "Eldoria",
      ruler: "Queen Elara",
    },
    terrain: "Mountains",
    resources: ["Iron", "Silver", "Crystal"],
    dangerLevel: 7,
    coordinates: {
      x: 120,
      y: 85,
    },
    createdAt: new Date("2023-06-19T14:32:08.321Z"),
    updatedAt: new Date("2023-06-19T14:32:08.321Z"),
  },
  {
    _id: "60d21d7667d0d8992e610c89",
    name: "Emerald Forest",
    kingdom: {
      _id: "60d21b4667d0d8992e610c85",
      name: "Eldoria",
      ruler: "Queen Elara",
    },
    terrain: "Forest",
    resources: ["Wood", "Herbs", "Game"],
    dangerLevel: 3,
    coordinates: {
      x: 95,
      y: 120,
    },
    createdAt: new Date("2023-06-19T14:32:38.761Z"),
    updatedAt: new Date("2023-06-19T14:32:38.761Z"),
  },
  {
    _id: "60d21e1c67d0d8992e610c8a",
    name: "Burning Sands",
    kingdom: {
      _id: "60d21b5c67d0d8992e610c86",
      name: "Stormhold",
      ruler: "King Aldric",
    },
    terrain: "Desert",
    resources: ["Gold", "Gemstones", "Ancient Artifacts"],
    dangerLevel: 9,
    coordinates: {
      x: 180,
      y: 220,
    },
    createdAt: new Date("2023-06-19T14:35:24.551Z"),
    updatedAt: new Date("2023-06-19T14:37:08.124Z"),
  },
];

// Helper to check if MongoDB is connected
const isDbConnected = () => {
  return Region.db?.db?.databaseName !== undefined;
};

// Get all regions
exports.getAllRegions = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        mode: "demo",
        count: mockRegions.length,
        data: mockRegions,
      });
    }

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
    if (!isDbConnected()) {
      const region = mockRegions.find((r) => r._id === req.params.id);

      if (!region) {
        return res.status(404).json({
          success: false,
          message: `Region with id ${req.params.id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        mode: "demo",
        data: region,
      });
    }

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

    if (!isDbConnected()) {
      const regions = mockRegions.filter((r) => r.kingdom._id === kingdomId);
      const kingdom = regions.length > 0 ? regions[0].kingdom : null;

      if (!kingdom) {
        return res.status(404).json({
          success: false,
          message: `Kingdom with id ${kingdomId} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        mode: "demo",
        count: regions.length,
        kingdomName: kingdom.name,
        data: regions,
      });
    }

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
    if (!isDbConnected()) {
      // Find the mock kingdom
      let kingdomData = {};
      for (const mockRegion of mockRegions) {
        if (mockRegion.kingdom._id === req.body.kingdom) {
          kingdomData = mockRegion.kingdom;
          break;
        }
      }

      if (!Object.keys(kingdomData).length) {
        return res.status(404).json({
          success: false,
          message: `Kingdom with id ${req.body.kingdom} not found`,
        });
      }

      return res.status(201).json({
        success: true,
        mode: "demo",
        message: "Region created (demo mode - not saved to database)",
        data: {
          _id: `mock-${Date.now()}`,
          ...req.body,
          kingdom: kingdomData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

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
    if (!isDbConnected()) {
      const regionIndex = mockRegions.findIndex((r) => r._id === req.params.id);

      if (regionIndex === -1) {
        return res.status(404).json({
          success: false,
          message: `Region with id ${req.params.id} not found`,
        });
      }

      // If kingdom ID is changing, verify it exists in our mock data
      if (
        req.body.kingdom &&
        req.body.kingdom !== mockRegions[regionIndex].kingdom._id
      ) {
        let foundKingdom = false;

        for (const mockRegion of mockRegions) {
          if (mockRegion.kingdom._id === req.body.kingdom) {
            foundKingdom = true;
            break;
          }
        }

        if (!foundKingdom) {
          return res.status(404).json({
            success: false,
            message: `Kingdom with id ${req.body.kingdom} not found`,
          });
        }
      }

      const updatedRegion = {
        ...mockRegions[regionIndex],
        ...req.body,
        updatedAt: new Date(),
      };

      return res.status(200).json({
        success: true,
        mode: "demo",
        message: "Region updated (demo mode - not saved to database)",
        data: updatedRegion,
      });
    }

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
    if (!isDbConnected()) {
      const regionIndex = mockRegions.findIndex((r) => r._id === req.params.id);

      if (regionIndex === -1) {
        return res.status(404).json({
          success: false,
          message: `Region with id ${req.params.id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        mode: "demo",
        message: "Region deleted (demo mode - not actually deleted)",
        data: {},
      });
    }

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
