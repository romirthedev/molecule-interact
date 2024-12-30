// Create a 3Dmol.js viewer
const viewerContainer = document.getElementById("viewer-container");
const viewer = $3Dmol.createViewer(viewerContainer, {
    backgroundColor: "#202020",
});

// Function to fetch and load a molecule
async function loadMolecule(name) {
    const apiUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${name}/SDF`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Molecule not found in PubChem.");

        const sdfData = await response.text();
        if (!sdfData || sdfData.trim() === "") throw new Error("No data received.");

        // Clear the viewer and add the new molecule
        viewer.clear();
        viewer.addModel(sdfData, "sdf");
        viewer.setStyle({}, { stick: { colorscheme: "Jmol" } });
        viewer.zoomTo();
        viewer.render();

        alert(`Molecule "${name}" loaded successfully!`);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Add event listener to the load button
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
        viewer.zoomTo({ serial: atom.serial });
        viewer.render();
    }
});
