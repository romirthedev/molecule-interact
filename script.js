const moleculeData = {
    methane: `
        Methane
        -ISIS- 09220114422D
        5  4  0  0  0  0            999 V2000
        0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
        0.0000    0.0000    1.0890 H   0  0  0  0  0  0  0  0  0  0  0  0
        1.0267    0.0000   -0.3630 H   0  0  0  0  0  0  0  0  0  0  0  0
       -0.5133   -0.8892   -0.3630 H   0  0  0  0  0  0  0  0  0  0  0  0
       -0.5133    0.8892   -0.3630 H   0  0  0  0  0  0  0  0  0  0  0  0
        1  2  1  0
        1  3  1  0
        1  4  1  0
        1  5  1  0
        M  END
    `,
    ethanol: `
        Ethanol
        -ISIS-  12231110192D
        8  7  0  0  0  0            999 V2000
        1.3011   -0.1331    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
        0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
        1.7376    0.6448    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
        1.7376    1.6818    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
        1.6980   -0.9670    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
       -0.4202   -0.7546   -0.8877 H   0  0  0  0  0  0  0  0  0  0  0  0
       -0.4202   -0.7546    0.8877 H   0  0  0  0  0  0  0  0  0  0  0  0
       -0.4202    1.2257    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
        1  2  1  0
        1  3  1  0
        1  5  1  0
        2  6  1  0
        2  7  1  0
        2  8  1  0
        3  4  1  0
        M  END
    `,
    glucose: `
        Glucose
        -ISIS-  12131109162D
        24 23  0  0  0  0            999 V2000
        1.5250   -0.8700    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
        0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
        0.0000    1.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
       -1.2160    2.1540    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
       -2.4320    1.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
       -2.4320    0.0000    0.0000 C   0  0  0  0  0  0  0  0
       -1.5000    0.0000    0.0000 O   0  0  0  0  0  0  0  0
       -0.5400    2.1540    0.0000 O   0  0  0  0  0  0  0  0
        0.5400   -0.8700    0.0000 H   0  0  0  0  0  0  0  0
       -0.5400   -0.8700    0.0000 H   0  0  0  0  0  0  0  0
       -0.5400    1.2250    0.0000 H   0  0  0  0  0  0  0  0
       -1.2160   -0.9000    0.0000 H   0  0  0  0  0  0  0  0
        1.0000    2.1540    0.0000 H   0  0  0  0  0  0  0  0
       -3.0000    0.8700    0.0000 H   0  0  0  0  0  0  0  0
       -3.0000   -0.8700    0.0000 H   0  0  0  0  0  0  0  0
       -3.0000    1.5000    0.0000 H   0  0  0  0  0  0  0  0
       -0.5400   -2.1540    0.0000 H   0  0  0  0  0  0  0  0
        2.5000   -0.8700    0.0000 H   0  0  0  0  0  0  0  0
       -0.5400    1.2250    0.0000 H   0  0  0  0  0  0  0  0
        1.2160    0.8700    0.0000 H   0  0  0  0  0  0  0  0
        0.0000   -0.8700    0.0000 H   0  0  0  0  0  0  0  0
        M  END
    `
};

document.getElementById('load-molecule').addEventListener('click', () => {
    const moleculeName = document.getElementById('molecule-dropdown').value;
    if (!moleculeName) {
        alert('Please select a molecule.');
        return;
    }

    const sdfData = moleculeData[moleculeName];
    const viewer = $3Dmol.createViewer("viewer", { backgroundColor: "#000000" });
    viewer.addModel(sdfData, "sdf");
    viewer.setStyle({}, { stick: { colorscheme: "Jmol", radius: 0.15, clickable: true } });
    viewer.zoomTo();
    viewer.render();
    alert('Molecule loaded successfully!');

    // Zoom to specific regions for demonstration
    if (moleculeName === 'ethanol') {
        viewer.setStyle({ atomindex: 1 }, { stick: { colorscheme: "Jmol", radius: 0.2, clickable: true, callback: function (atom) {
            viewer.zoomTo({ serial: atom.serial });
            viewer.render();
        } } });
    }
});
