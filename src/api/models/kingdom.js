const mongoose = require("mongoose");

const kingdomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Kingdom name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Kingdom name cannot exceed 100 characters"],
    },
    ruler: {
      type: String,
      required: [true, "Ruler name is required"],
      trim: true,
    },
    foundedYear: {
      type: Number,
      required: true,
      min: [0, "Founded year cannot be negative"],
    },
    population: {
      type: Number,
      required: true,
      min: [100, "Population must be at least 100"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const Kingdom = mongoose.model("Kingdom", kingdomSchema);

module.exports = Kingdom;
