document.getElementById('load-molecule').addEventListener('click', () => {
    const moleculeName = document.getElementById('molecule-name').value.trim();
    if (!moleculeName) {
        alert('Please enter a molecule name.');
        return;
    }

    const url = `https://cactus.nci.nih.gov/chemical/structure/${moleculeName}/file?format=sdf`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Molecule not found');
            }
            return response.text();
        })
        .then(sdfData => {
            const viewer = $3Dmol.createViewer("viewer", { backgroundColor: "white" });
            viewer.addModel(sdfData, "sdf");
            viewer.setStyle({}, { stick: { colorscheme: "Jmol" } });
            viewer.zoomTo();
            viewer.render();
            alert('Molecule loaded successfully!');
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
});
