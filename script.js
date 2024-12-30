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
        // Wait for DOM to be fully loaded before initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        const viewerContainer = document.getElementById('viewer_container');
        
        // Clear any existing content
        viewerContainer.innerHTML = '';
        
        // Create viewer with specific dimensions
        this.viewer = $3Dmol.createViewer(viewerContainer, {
            backgroundColor: 'white',
            id: 'molecule_viewer',
            width: '100%',
            height: '100%'
        });

        // Add event listeners
        document.getElementById('loadButton').addEventListener('click', () => this.loadMolecule());
        
        // Initial viewer setup
        this.viewer.setStyle({}, {
            stick: {
                colorscheme: 'Jmol',
                radius: 0.2
            }
        });

        // Ensure proper sizing and centering
        window.requestAnimationFrame(() => {
            this.viewer.resize();
            this.viewer.center();
            this.viewer.zoomTo();
            this.viewer.render();
        });
    }

    loadMolecule() {
    const select = document.getElementById('moleculeSelect');
    const selectedMolecule = select.value;

    if (!selectedMolecule) {
        this.showMessage('Please select a molecule first.', 'error');
        return;
    }

    try {
        // Clear previous molecule
        this.viewer.clear();

        // Load new molecule
        const data = this.moleculeData[selectedMolecule];
        this.viewer.addModel(data, "sdf");
        
        // Set style with labels included
        this.viewer.setStyle({}, {
            stick: {
                colorscheme: 'Jmol',
                radius: 0.2
            },
            label: {
                font: 12,
                alignment: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0)',
                showBackground: false
            }
        });

        // Ensure proper sizing and centering
        this.viewer.resize();
        this.viewer.center();
        this.viewer.zoomTo();
        this.viewer.render();

        this.showMessage(`${selectedMolecule.charAt(0).toUpperCase() + selectedMolecule.slice(1)} loaded successfully!`, 'success');
    } catch (error) {
        this.showMessage(`Error loading molecule: ${error.message}`, 'error');
    }
}
    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Hide message after 3 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new MoleculeViewer();
});
