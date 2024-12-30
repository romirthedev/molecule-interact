document.getElementById("load-molecule").addEventListener("click", async () => {
    const moleculeName = document.getElementById("molecule-name").value.trim();
    const viewerContainer = document.getElementById("viewer-container");

    if (!moleculeName) {
        alert("Please enter a molecule name!");
        return;
    }

    // Clear the viewer container before rendering a new molecule
    viewerContainer.innerHTML = "";

    // Initialize the 3Dmol.js viewer
    const viewer = $3Dmol.createViewer("viewer-container", { backgroundColor: "gray" });

    try {
        // Fetch molecule data in SDF format from the NCI resolver
        const response = await fetch(`https://cactus.nci.nih.gov/chemical/structure/${moleculeName}/file?format=sdf`);
        if (!response.ok) throw new Error("Molecule not found!");

        const sdfData = await response.text();

        // Load and render the molecule
        viewer.addModel(sdfData, "sdf");
        viewer.setStyle({}, { stick: { colorscheme: "Jmol" } });
        viewer.zoomTo();
        viewer.render();

        // Display a success message
        alert(`Molecule "${moleculeName}" loaded! Click on bonds to explore.`);
    } catch (error) {
        console.error("Error loading molecule:", error);
        alert("Failed to load the molecule. Please check the name and try again.");
    }
});
