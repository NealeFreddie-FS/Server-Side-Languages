const express = require("express");
const router = express.Router();
const regionController = require("../controllers/regionController");

// Get all regions and create a new region
router
  .route("/")
  .get(regionController.getAllRegions)
  .post(regionController.createRegion);

// Get regions by kingdom ID
router.route("/kingdom/:kingdomId").get(regionController.getRegionsByKingdom);

// Get, update, and delete a specific region by ID
router
  .route("/:id")
  .get(regionController.getRegionById)
  .put(regionController.updateRegion)
  .delete(regionController.deleteRegion);

module.exports = router;
