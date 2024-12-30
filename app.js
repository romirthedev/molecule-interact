const moleculeData = {
    methane: `
Methane
  CHEMDOOD08070920033D 0   0.00000     0.00000     0
[Insert methane SDF data here]
    `,
    ethanol: `
Ethanol
  CHEMDOOD08070920033D 0   0.00000     0.00000     0
[Insert ethanol SDF data here]
    `,
    glucose: `
Glucose
  CHEMDOOD08070920033D 0   0.00000     0.00000     0
[Insert glucose SDF data here]
    `
};

let viewer;

function initViewer() {
    viewer = $3Dmol.createViewer("viewer_container", {
        backgroundColor: "white"
    });
}

function loadMolecule(moleculeName) {
    const sdf = moleculeData[moleculeName];
    if (!sdf) {
        alert("Error: Molecule data not found.");
        return;
    }

    viewer.clear();
    viewer.addModel(sdf, "sdf");
    viewer.setStyle({}, { stick: {} });
    viewer.setColorByElement({ "scheme": "Jmol" });
    viewer.zoomTo();
    viewer.render();

    // Add click event for atoms
    viewer.getModel().setClickable({}, true, function (atom) {
        viewer.setStyle({ serial: atom.serial }, { stick: { radius: 0.3 } });
        viewer.center({ serial: atom.serial }, 1000);
        viewer.render();
    });

    alert(`${moleculeName.charAt(0).toUpperCase() + moleculeName.slice(1)} loaded successfully!`);
}

document.addEventListener("DOMContentLoaded", function () {
    initViewer();

    const moleculeSelect = document.getElementById("moleculeSelect");
    const loadButton = document.getElementById("loadMolecule");

    loadButton.addEventListener("click", function () {
        const selectedMolecule = moleculeSelect.value;
        if (selectedMolecule) {
            loadMolecule(selectedMolecule);
        } else {
            alert("Please select a molecule first.");
        }
    });
});

