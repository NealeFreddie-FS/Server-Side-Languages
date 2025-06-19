const Kingdom = require("../models/kingdom");

// Mock data for demo mode when database is not available
const mockKingdoms = [
  {
    _id: "60d21b4667d0d8992e610c85",
    name: "Eldoria",
    ruler: "Queen Elara",
    foundedYear: 1200,
    population: 50000,
    isActive: true,
    description: "A prosperous kingdom with lush forests and fertile plains",
    createdAt: new Date("2023-06-19T14:23:22.112Z"),
    updatedAt: new Date("2023-06-19T14:23:22.112Z"),
  },
  {
    _id: "60d21b5c67d0d8992e610c86",
    name: "Stormhold",
    ruler: "King Aldric",
    foundedYear: 800,
    population: 35000,
    isActive: true,
    description: "A mountainous kingdom known for its fierce warriors",
    createdAt: new Date("2023-06-19T14:23:40.221Z"),
    updatedAt: new Date("2023-06-19T14:23:40.221Z"),
  },
];

// Helper to check if MongoDB is connected
const isDbConnected = () => {
  return Kingdom.db?.db?.databaseName !== undefined;
};

// Get all kingdoms
exports.getAllKingdoms = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        mode: "demo",
        count: mockKingdoms.length,
        data: mockKingdoms,
      });
    }

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
    if (!isDbConnected()) {
      const kingdom = mockKingdoms.find((k) => k._id === req.params.id);

      if (!kingdom) {
        return res.status(404).json({
          success: false,
          message: `Kingdom with id ${req.params.id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        mode: "demo",
        data: kingdom,
      });
    }

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
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        mode: "demo",
        message: "Kingdom created (demo mode - not saved to database)",
        data: {
          _id: `mock-${Date.now()}`,
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

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
    if (!isDbConnected()) {
      const kingdomIndex = mockKingdoms.findIndex(
        (k) => k._id === req.params.id
      );

      if (kingdomIndex === -1) {
        return res.status(404).json({
          success: false,
          message: `Kingdom with id ${req.params.id} not found`,
        });
      }

      const updatedKingdom = {
        ...mockKingdoms[kingdomIndex],
        ...req.body,
        updatedAt: new Date(),
      };

      return res.status(200).json({
        success: true,
        mode: "demo",
        message: "Kingdom updated (demo mode - not saved to database)",
        data: updatedKingdom,
      });
    }

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
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        mode: "demo",
        message: "Kingdom deleted (demo mode - not actually deleted)",
        data: {},
      });
    }

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
