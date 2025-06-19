// DOM Elements
const kingdomsContainer = document.getElementById("kingdomsContainer");
const regionsContainer = document.getElementById("regionsContainer");
const addKingdomBtn = document.getElementById("addKingdomBtn");
const addRegionBtn = document.getElementById("addRegionBtn");
const kingdomModal = document.getElementById("kingdomModal");
const regionModal = document.getElementById("regionModal");
const kingdomForm = document.getElementById("kingdomForm");
const regionForm = document.getElementById("regionForm");

// State
let kingdoms = [];
let regions = [];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Load kingdoms and regions
  loadKingdoms();
  loadRegions();

  // Event Listeners
  if (addKingdomBtn) {
    addKingdomBtn.addEventListener("click", openKingdomModal);
  }

  if (addRegionBtn) {
    addRegionBtn.addEventListener("click", openRegionModal);
  }

  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === kingdomModal) {
      closeKingdomModal();
    }
    if (event.target === regionModal) {
      closeRegionModal();
    }
  });

  // Form submissions
  if (kingdomForm) {
    kingdomForm.addEventListener("submit", handleKingdomSubmit);
  }

  if (regionForm) {
    regionForm.addEventListener("submit", handleRegionSubmit);
  }
});

/**
 * Load kingdoms from API
 */
async function loadKingdoms() {
  showLoader();

  try {
    const response = await fetch("/api/kingdoms");

    if (!response.ok) {
      throw new Error("Failed to fetch kingdoms");
    }

    const data = await response.json();
    kingdoms = data.data || [];

    renderKingdoms();
    populateKingdomDropdown();
  } catch (error) {
    console.error("Error loading kingdoms:", error);
    showError("Failed to load kingdoms. Please try again later.");
  } finally {
    hideLoader();
  }
}

/**
 * Load regions from API
 */
async function loadRegions() {
  try {
    const response = await fetch("/api/regions");

    if (!response.ok) {
      throw new Error("Failed to fetch regions");
    }

    const data = await response.json();
    regions = data.data || [];

    renderRegions();
  } catch (error) {
    console.error("Error loading regions:", error);
    showError("Failed to load regions. Please try again later.");
  }
}

/**
 * Render kingdoms in the container
 */
function renderKingdoms() {
  if (!kingdomsContainer) return;

  kingdomsContainer.innerHTML = "";

  if (kingdoms.length === 0) {
    kingdomsContainer.innerHTML = `
      <div class="no-items-message">
        <p>No kingdoms have been created yet. Click the "Add Kingdom" button to create one.</p>
      </div>
    `;
    return;
  }

  kingdoms.forEach((kingdom) => {
    const card = document.createElement("div");
    card.className = "kingdom-card";

    card.innerHTML = `
      <div class="kingdom-card-header">
        <h3 class="kingdom-name">${kingdom.name}</h3>
        <span class="kingdom-status ${
          kingdom.isActive ? "active" : "inactive"
        }">
          ${kingdom.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div class="kingdom-card-body">
        <div class="kingdom-info">
          <p><strong>Ruler:</strong> ${kingdom.ruler}</p>
          <p><strong>Founded:</strong> Year ${kingdom.foundedYear}</p>
          <p><strong>Population:</strong> ${kingdom.population.toLocaleString()}</p>
        </div>
        <p class="kingdom-description">${
          kingdom.description || "No description available."
        }</p>
      </div>
      <div class="kingdom-card-footer">
        <button class="view-regions-btn" data-kingdom-id="${
          kingdom._id
        }">View Regions</button>
        <div class="action-buttons">
          <button class="edit-btn" data-kingdom-id="${
            kingdom._id
          }">Edit</button>
          <button class="delete-btn" data-kingdom-id="${
            kingdom._id
          }">Delete</button>
        </div>
      </div>
    `;

    // Add event listeners
    card.querySelector(".view-regions-btn").addEventListener("click", () => {
      loadRegionsByKingdom(kingdom._id, kingdom.name);
    });

    card.querySelector(".edit-btn").addEventListener("click", () => {
      openKingdomEditModal(kingdom);
    });

    card.querySelector(".delete-btn").addEventListener("click", () => {
      deleteKingdom(kingdom._id, kingdom.name);
    });

    kingdomsContainer.appendChild(card);
  });
}

/**
 * Render regions in the container
 */
function renderRegions() {
  if (!regionsContainer) return;

  regionsContainer.innerHTML = "";

  if (regions.length === 0) {
    regionsContainer.innerHTML = `
      <div class="no-items-message">
        <p>No regions have been created yet. Click the "Add Region" button to create one.</p>
      </div>
    `;
    return;
  }

  regions.forEach((region) => {
    const card = document.createElement("div");
    card.className = "region-card";
    card.classList.add(`terrain-${region.terrain.toLowerCase()}`);

    card.innerHTML = `
      <div class="region-card-header">
        <h3 class="region-name">${region.name}</h3>
        <span class="danger-level danger-level-${region.dangerLevel}">
          Danger Level: ${region.dangerLevel}
        </span>
      </div>
      <div class="region-card-body">
        <div class="region-info">
          <p><strong>Kingdom:</strong> ${region.kingdom.name}</p>
          <p><strong>Terrain:</strong> ${region.terrain}</p>
          <p><strong>Resources:</strong> ${
            region.resources.join(", ") || "None"
          }</p>
          <p><strong>Coordinates:</strong> X:${region.coordinates.x}, Y:${
      region.coordinates.y
    }</p>
        </div>
      </div>
      <div class="region-card-footer">
        <div class="action-buttons">
          <button class="edit-btn" data-region-id="${region._id}">Edit</button>
          <button class="delete-btn" data-region-id="${
            region._id
          }">Delete</button>
        </div>
      </div>
    `;

    // Add event listeners
    card.querySelector(".edit-btn").addEventListener("click", () => {
      openRegionEditModal(region);
    });

    card.querySelector(".delete-btn").addEventListener("click", () => {
      deleteRegion(region._id, region.name);
    });

    regionsContainer.appendChild(card);
  });
}

/**
 * Load regions by kingdom ID
 */
async function loadRegionsByKingdom(kingdomId, kingdomName) {
  showLoader();

  try {
    const response = await fetch(`/api/regions/kingdom/${kingdomId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch regions for this kingdom");
    }

    const data = await response.json();

    // Update regions container title
    const regionsHeader = document.querySelector("#regionsSection h2");
    if (regionsHeader) {
      regionsHeader.textContent = `Regions of ${kingdomName}`;
    }

    // Update view
    regions = data.data || [];
    renderRegions();

    // Scroll to regions section
    const regionsSection = document.getElementById("regionsSection");
    if (regionsSection) {
      regionsSection.scrollIntoView({ behavior: "smooth" });
    }
  } catch (error) {
    console.error("Error loading regions:", error);
    showError(
      `Failed to load regions for ${kingdomName}. Please try again later.`
    );
  } finally {
    hideLoader();
  }
}

/**
 * Open kingdom modal for creating new kingdom
 */
function openKingdomModal() {
  if (kingdomModal) {
    // Reset form
    if (kingdomForm) {
      kingdomForm.reset();
      kingdomForm.dataset.mode = "create";
      document.querySelector("#kingdomModal .modal-title").textContent =
        "Add New Kingdom";
    }
    kingdomModal.style.display = "block";
  }
}

/**
 * Open kingdom modal for editing
 */
function openKingdomEditModal(kingdom) {
  if (kingdomModal && kingdomForm) {
    // Fill form with kingdom data
    document.getElementById("kingdomId").value = kingdom._id;
    document.getElementById("kingdomName").value = kingdom.name;
    document.getElementById("kingdomRuler").value = kingdom.ruler;
    document.getElementById("kingdomYear").value = kingdom.foundedYear;
    document.getElementById("kingdomPopulation").value = kingdom.population;
    document.getElementById("kingdomActive").checked = kingdom.isActive;
    document.getElementById("kingdomDescription").value =
      kingdom.description || "";

    // Update form mode
    kingdomForm.dataset.mode = "edit";
    document.querySelector("#kingdomModal .modal-title").textContent =
      "Edit Kingdom";

    // Open modal
    kingdomModal.style.display = "block";
  }
}

/**
 * Close kingdom modal
 */
function closeKingdomModal() {
  if (kingdomModal) {
    kingdomModal.style.display = "none";
  }
}

/**
 * Open region modal for creating new region
 */
function openRegionModal() {
  if (regionModal) {
    // Reset form
    if (regionForm) {
      regionForm.reset();
      regionForm.dataset.mode = "create";
      document.querySelector("#regionModal .modal-title").textContent =
        "Add New Region";
    }
    regionModal.style.display = "block";
  }
}

/**
 * Open region modal for editing
 */
function openRegionEditModal(region) {
  if (regionModal && regionForm) {
    // Fill form with region data
    document.getElementById("regionId").value = region._id;
    document.getElementById("regionName").value = region.name;
    document.getElementById("regionKingdom").value = region.kingdom._id;
    document.getElementById("regionTerrain").value = region.terrain;
    document.getElementById("regionDanger").value = region.dangerLevel;
    document.getElementById("regionResources").value =
      region.resources.join(", ");
    document.getElementById("regionX").value = region.coordinates.x;
    document.getElementById("regionY").value = region.coordinates.y;

    // Update form mode
    regionForm.dataset.mode = "edit";
    document.querySelector("#regionModal .modal-title").textContent =
      "Edit Region";

    // Open modal
    regionModal.style.display = "block";
  }
}

/**
 * Close region modal
 */
function closeRegionModal() {
  if (regionModal) {
    regionModal.style.display = "none";
  }
}

/**
 * Handle kingdom form submission
 */
async function handleKingdomSubmit(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById("kingdomName").value,
    ruler: document.getElementById("kingdomRuler").value,
    foundedYear: parseInt(document.getElementById("kingdomYear").value),
    population: parseInt(document.getElementById("kingdomPopulation").value),
    isActive: document.getElementById("kingdomActive").checked,
    description: document.getElementById("kingdomDescription").value,
  };

  const mode = kingdomForm.dataset.mode;
  const kingdomId = document.getElementById("kingdomId").value;

  try {
    let response;

    if (mode === "edit" && kingdomId) {
      // Update existing kingdom
      response = await fetch(`/api/kingdoms/${kingdomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      // Create new kingdom
      response = await fetch("/api/kingdoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }

    if (!response.ok) {
      throw new Error("Failed to save kingdom");
    }

    // Reload kingdoms
    await loadKingdoms();

    // Close modal
    closeKingdomModal();

    // Show success message
    showToast(
      mode === "edit"
        ? "Kingdom updated successfully!"
        : "Kingdom created successfully!"
    );
  } catch (error) {
    console.error("Error saving kingdom:", error);
    showError("Failed to save kingdom. Please try again.");
  }
}

/**
 * Handle region form submission
 */
async function handleRegionSubmit(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById("regionName").value,
    kingdom: document.getElementById("regionKingdom").value,
    terrain: document.getElementById("regionTerrain").value,
    dangerLevel: parseInt(document.getElementById("regionDanger").value),
    resources: document
      .getElementById("regionResources")
      .value.split(",")
      .map((resource) => resource.trim())
      .filter((resource) => resource !== ""),
    coordinates: {
      x: parseInt(document.getElementById("regionX").value),
      y: parseInt(document.getElementById("regionY").value),
    },
  };

  const mode = regionForm.dataset.mode;
  const regionId = document.getElementById("regionId").value;

  try {
    let response;

    if (mode === "edit" && regionId) {
      // Update existing region
      response = await fetch(`/api/regions/${regionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      // Create new region
      response = await fetch("/api/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }

    if (!response.ok) {
      throw new Error("Failed to save region");
    }

    // Reload regions
    await loadRegions();

    // Close modal
    closeRegionModal();

    // Show success message
    showToast(
      mode === "edit"
        ? "Region updated successfully!"
        : "Region created successfully!"
    );
  } catch (error) {
    console.error("Error saving region:", error);
    showError("Failed to save region. Please try again.");
  }
}

/**
 * Delete a kingdom
 */
async function deleteKingdom(id, name) {
  if (
    !confirm(
      `Are you sure you want to delete the kingdom "${name}"? This will also delete all its regions.`
    )
  ) {
    return;
  }

  try {
    const response = await fetch(`/api/kingdoms/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete kingdom");
    }

    // Reload kingdoms and regions
    await loadKingdoms();
    await loadRegions();

    showToast(`Kingdom "${name}" deleted successfully!`);
  } catch (error) {
    console.error("Error deleting kingdom:", error);
    showError(`Failed to delete kingdom "${name}". Please try again.`);
  }
}

/**
 * Delete a region
 */
async function deleteRegion(id, name) {
  if (!confirm(`Are you sure you want to delete the region "${name}"?`)) {
    return;
  }

  try {
    const response = await fetch(`/api/regions/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete region");
    }

    // Reload regions
    await loadRegions();

    showToast(`Region "${name}" deleted successfully!`);
  } catch (error) {
    console.error("Error deleting region:", error);
    showError(`Failed to delete region "${name}". Please try again.`);
  }
}

/**
 * Populate kingdom dropdown
 */
function populateKingdomDropdown() {
  const dropdown = document.getElementById("regionKingdom");
  if (!dropdown) return;

  // Clear existing options except the first one
  while (dropdown.options.length > 1) {
    dropdown.remove(1);
  }

  // Add kingdom options
  kingdoms.forEach((kingdom) => {
    const option = document.createElement("option");
    option.value = kingdom._id;
    option.textContent = kingdom.name;
    dropdown.appendChild(option);
  });
}

/**
 * Show loader
 */
function showLoader() {
  const loaderContainer = document.getElementById("loaderContainer");
  if (loaderContainer) {
    loaderContainer.style.display = "flex";
  }
}

/**
 * Hide loader
 */
function hideLoader() {
  const loaderContainer = document.getElementById("loaderContainer");
  if (loaderContainer) {
    loaderContainer.style.display = "none";
  }
}

/**
 * Show error message
 */
function showError(message) {
  const errorContainer = document.getElementById("errorContainer");
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = "block";

    setTimeout(() => {
      errorContainer.style.display = "none";
    }, 5000);
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = "success") {
  // Create toast element if it doesn't exist
  let toastContainer = document.getElementById("toastContainer");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    document.body.appendChild(toastContainer);
  }

  // Create toast
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // Add to container
  toastContainer.appendChild(toast);

  // Remove after delay
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 500);
  }, 3000);
}
