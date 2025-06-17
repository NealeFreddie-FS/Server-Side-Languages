const express = require("express");
const router = express.Router();
const kingdomController = require("../controllers/kingdomController");

// Get all kingdoms and create a new kingdom
router
  .route("/")
  .get(kingdomController.getAllKingdoms)
  .post(kingdomController.createKingdom);

// Get, update, and delete a specific kingdom by ID
router
  .route("/:id")
  .get(kingdomController.getKingdomById)
  .put(kingdomController.updateKingdom)
  .delete(kingdomController.deleteKingdom);

module.exports = router;
