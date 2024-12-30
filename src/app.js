document.addEventListener('DOMContentLoaded', () => {
    const moleculeSelect = document.getElementById('moleculeSelect');
    const loadMoleculeButton = document.getElementById('loadMolecule');
    const viewerContainer = document.getElementById('viewer_container');
    const bondDetails = document.getElementById('bond_details');

    const molecules = {
        methane: 'https://files.rcsb.org/ligands/view/MET_model.sdf',
        ethanol: 'https://files.rcsb.org/ligands/view/ETH_model.sdf',
        glucose: 'https://files.rcsb.org/ligands/view/GLC_model.sdf'
    };

    loadMoleculeButton.addEventListener('click', () => {
        const selectedMolecule = moleculeSelect.value;
        if (selectedMolecule && molecules[selectedMolecule]) {
            loadMolecule(molecules[selectedMolecule]);
        }
    });

    function loadMolecule(url) {
        const viewer = $3Dmol.createViewer(viewerContainer, { backgroundColor: 'white' });
        viewer.clear();
        $3Dmol.download(url, viewer, {}, () => {
            viewer.zoomTo();
            viewer.render();
            viewer.zoom(1.2, 1000);
        });
    }

    // Example function to show bond details (customize as needed)
    function showBondDetails(bond) {
        bondDetails.classList.remove('hidden');
        bondDetails.innerHTML = `
            <h2>Bond Details</h2>
            <p>Atom 1: ${bond.atom1}</p>
            <p>Atom 2: ${bond.atom2}</p>
            <p>Type: ${bond.type}</p>
        `;
    }
});
