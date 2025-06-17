const express = require("express");
const router = express.Router();
const kingdomRoutes = require("./kingdomRoutes");
const regionRoutes = require("./regionRoutes");

// API root endpoint
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Fantasy Kingdoms API is running",
    version: "1.0.0",
    endpoints: {
      kingdoms: {
        getAllKingdoms: "/api/kingdoms",
        getKingdomById: "/api/kingdoms/:id",
        createKingdom: "/api/kingdoms",
        updateKingdom: "/api/kingdoms/:id",
        deleteKingdom: "/api/kingdoms/:id",
      },
      regions: {
        getAllRegions: "/api/regions",
        getRegionById: "/api/regions/:id",
        getRegionsByKingdom: "/api/regions/kingdom/:kingdomId",
        createRegion: "/api/regions",
        updateRegion: "/api/regions/:id",
        deleteRegion: "/api/regions/:id",
      },
    },
    metadata: {
      hostname: req.hostname,
      method: req.method,
    },
  });
});

// Use the routes
router.use("/kingdoms", kingdomRoutes);
router.use("/regions", regionRoutes);

module.exports = router;
