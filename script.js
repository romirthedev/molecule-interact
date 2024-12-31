class MoleculeViewer {
    constructor() {
        this.viewer = null;
        this.moleculeData = {
            methane: `
Methane (CH4)
  CHEMDOOD08070920033D 0   0.00000     0.00000     0
 
  5  4  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.6294    0.6294    0.6294 H   0  0  0  0  0  0  0  0  0  0  0  0
    -0.6294   -0.6294    0.6294 H   0  0  0  0  0  0  0  0  0  0  0  0
    -0.6294    0.6294   -0.6294 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.6294   -0.6294   -0.6294 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
M  END
            `,
            ethanol: `
Ethanol (C2H5OH)
  CHEMDOOD08070920033D 0   0.00000     0.00000     0
 
  9  8  0  0  0  0  0  0  0  0999 V2000
    1.2304   -0.2164    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.2164    0.2164    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.9410   -0.9845    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    1.8584    0.6796    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.3889   -0.8124    0.8900 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.3889   -0.8124   -0.8900 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.3750    0.8124    0.8900 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.3750    0.8124   -0.8900 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.8584   -0.6796    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
  1  6  1  0  0  0  0
  2  7  1  0  0  0  0
  2  8  1  0  0  0  0
  3  9  1  0  0  0  0
M  END
            `,
            water: `
Water (H2O)
  CHEMDOOD08070920033D 0   0.00000     0.00000     0
 
  3  2  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.7572    0.5858    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7572    0.5858    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
M  END
            `
        };
        this.init();
    }

    init() {
        const viewerContainer = document.getElementById('viewer_container');
        if (!viewerContainer) {
            console.error('Viewer container not found.');
            return;
        }

        this.viewer = $3Dmol.createViewer(viewerContainer, { backgroundColor: 'white' });

        // Attach event listeners
        document.getElementById('loadButton').addEventListener('click', () => this.loadMolecule());
    }

    loadMolecule() {
        const select = document.getElementById('moleculeSelect');
        const selectedMolecule = select.value;

        if (!this.moleculeData[selectedMolecule]) {
            this.showMessage('Molecule data not found.', 'error');
            return;
        }

        this.viewer.clear();
        this.viewer.addModel(this.moleculeData[selectedMolecule], 'sdf');
        this.viewer.setStyle({}, { stick: { colorscheme: 'Jmol', radius: 0.2 } });
        this.viewer.zoomTo();
        this.viewer.render();
        this.showMessage(`Loaded ${selectedMolecule}.`, 'success');
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('message');
        if (!messageDiv) return;

        messageDiv.textContent = message;
        messageDiv.className = type;
        setTimeout(() => (messageDiv.textContent = ''), 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => new MoleculeViewer());
