const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Region name is required"],
      trim: true,
      maxlength: [100, "Region name cannot exceed 100 characters"],
    },
    kingdom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kingdom",
      required: [true, "Region must belong to a kingdom"],
    },
    terrain: {
      type: String,
      required: true,
      enum: {
        values: [
          "Mountains",
          "Forest",
          "Desert",
          "Plains",
          "Coastal",
          "Swamp",
          "Tundra",
          "Volcanic",
        ],
        message: "{VALUE} is not a valid terrain type",
      },
    },
    resources: [
      {
        type: String,
        trim: true,
      },
    ],
    dangerLevel: {
      type: Number,
      required: true,
      min: [1, "Danger level must be at least 1"],
      max: [10, "Danger level cannot exceed 10"],
    },
    coordinates: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries by kingdom
regionSchema.index({ kingdom: 1 });

const Region = mongoose.model("Region", regionSchema);

module.exports = Region;
