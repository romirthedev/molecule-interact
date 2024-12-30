// Create a 3Dmol.js viewer
const viewerContainer = document.getElementById("viewer-container");
const viewer = $3Dmol.createViewer(viewerContainer, {
    backgroundColor: "#202020",
});

// Function to fetch and load a molecule
async function loadMolecule(name) {
    const apiUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${name}/record/SDF?record_type=3d`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Molecule not found");

        const sdfData = await response.text();
        viewer.clear(); // Clear previous molecule
        viewer.addModel(sdfData, "sdf");
        viewer.setStyle({}, { stick: { colorscheme: "Jmol" } });
        viewer.zoomTo();
        viewer.render();

        alert(`Molecule "${name}" loaded! Click on bonds to explore.`);
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Add click event listener for loading molecules
document.getElementById("load-button").addEventListener("click", () => {
    const moleculeName = document.getElementById("molecule-input").value.trim();
    if (moleculeName) {
        loadMolecule(moleculeName);
    } else {
        alert("Please enter a molecule name.");
    }
});

// Add click event listener for molecule interactions
viewer.onClick(function (atom, viewer, event) {
    if (atom) {
        const info = `You clicked on ${atom.elem} (atom index: ${atom.index})`;
        alert(info);
        // Zoom into the clicked atom
        viewer.zoomTo({ serial: atom.serial });
        viewer.render();
    }
});
