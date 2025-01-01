class MoleculeViewer {
    constructor() {
        this.viewer = null;
        this.currentMolecule = null;
        // Molecule data with proper MOL format
        this.moleculeData = {
            methane: `Methane
  MOL    0

  5  4  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0
    0.6294    0.6294    0.6294 H   0  0  0  0  0
   -0.6294   -0.6294    0.6294 H   0  0  0  0  0
   -0.6294    0.6294   -0.6294 H   0  0  0  0  0
    0.6294   -0.6294   -0.6294 H   0  0  0  0  0
  1  2  1  0  0  0
  1  3  1  0  0  0
  1  4  1  0  0  0
  1  5  1  0  0  0
M  END`,
            ethanol: `Ethanol
  MOL    0

  9  8  0  0  0  0            999 V2000
    1.2304   -0.2164    0.0000 C   0  0  0  0  0
   -0.2164    0.2164    0.0000 C   0  0  0  0  0
   -0.9410   -0.9845    0.0000 O   0  0  0  0  0
    1.8584    0.6796    0.0000 H   0  0  0  0  0
    1.3889   -0.8124    0.8900 H   0  0  0  0  0
    1.3889   -0.8124   -0.8900 H   0  0  0  0  0
   -0.3750    0.8124    0.8900 H   0  0  0  0  0
   -0.3750    0.8124   -0.8900 H   0  0  0  0  0
   -1.8584   -0.6796    0.0000 H   0  0  0  0  0
  1  2  1  0  0  0
  2  3  1  0  0  0
  1  4  1  0  0  0
  1  5  1  0  0  0
  1  6  1  0  0  0
  2  7  1  0  0  0
  2  8  1  0  0  0
  3  9  1  0  0  0
M  END`,
            water: `Water
  MOL    0

  3  2  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 O   0  0  0  0  0
    0.7572    0.5858    0.0000 H   0  0  0  0  0
   -0.7572    0.5858    0.0000 H   0  0  0  0  0
  1  2  1  0  0  0
  1  3  1  0  0  0
M  END`
        };

        // Molecule information for labels and descriptions
        this.moleculeInfo = {
            methane: {
                bonds: [
                    { atoms: [0, 1], label: 'C-H Bond', desc: 'Carbon-Hydrogen covalent bond' }
                ],
                formula: 'CH₄',
                description: 'Simplest hydrocarbon'
            },
            ethanol: {
                bonds: [
                    { atoms: [0, 1], label: 'C-C Bond', desc: 'Carbon-Carbon single bond' },
                    { atoms: [1, 2], label: 'C-O Bond', desc: 'Carbon-Oxygen bond (hydroxyl group)' }
                ],
                formula: 'C₂H₅OH',
                description: 'Alcohol compound'
            },
            water: {
                bonds: [
                    { atoms: [0, 1], label: 'O-H Bond', desc: 'Oxygen-Hydrogen polar bond' }
                ],
                formula: 'H₂O',
                description: 'Essential compound for life'
            }
        };

        this.initOnLoad();
    }

    initOnLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing viewer...');
        const viewerContainer = document.getElementById('viewer_container');
        
        // Ensure container is empty
        viewerContainer.innerHTML = '';

        // Check for required libraries
        if (typeof($) === 'undefined' || typeof($3Dmol) === 'undefined') {
            this.showMessage('Required libraries not loaded', 'error');
            return;
        }

        // Create viewer with modern styling
        this.viewer = $3Dmol.createViewer(viewerContainer, {
            backgroundColor: 'transparent',
            id: 'molecule_viewer',
            width: '100%',
            height: '400px'
        });

        // Set up event listeners
        document.getElementById('loadButton').addEventListener('click', () => this.loadMolecule());
        this.setupKeyboardControls();
        
        // Start animation loop
        this.animate();
    }

    loadMolecule() {
        const select = document.getElementById('moleculeSelect');
        const selectedMolecule = select.value;

        if (!selectedMolecule) {
            this.showMessage('Please select a molecule', 'error');
            return;
        }

        try {
            console.log(`Loading molecule: ${selectedMolecule}`);
            
            // Clear current view
            this.viewer.clear();
            
            // Load molecule data
            const molData = this.moleculeData[selectedMolecule];
            this.currentMolecule = selectedMolecule;

            // Add model with enhanced styling
            this.viewer.addModel(molData, "mol");
            this.viewer.setStyle({}, {
                stick: {
                    colorscheme: 'Jmol',
                    radius: 0.2,
                    opacity: 0.9
                },
                sphere: {
                    colorscheme: 'Jmol',
                    scale: 0.3,
                    opacity: 0.9
                }
            });

            // Add clickable labels
            this.addMoleculeLabels(selectedMolecule);

            // Center and zoom with animation
            this.viewer.zoomTo();
            this.viewer.center();
            
            // Trigger render with fade-in effect
            const viewerElement = document.getElementById('viewer_container');
            viewerElement.style.opacity = '0';
            
            requestAnimationFrame(() => {
                this.viewer.render();
                viewerElement.style.opacity = '1';
                viewerElement.style.transition = 'opacity 0.5s ease-in-out';
            });

            // Show molecule info
            this.showMoleculeInfo(selectedMolecule);
            
            this.showMessage(`${selectedMolecule.charAt(0).toUpperCase() + selectedMolecule.slice(1)} loaded`, 'success');
        } catch (error) {
            console.error('Loading error:', error);
            this.showMessage(`Error loading molecule: ${error.message}`, 'error');
        }
    }

    addMoleculeLabels(moleculeName) {
        const info = this.moleculeInfo[moleculeName];
        if (!info || !info.bonds) return;

        info.bonds.forEach(bond => {
            this.viewer.addLabel(bond.label, {
                position: { x: 0, y: 0, z: 0 },
                backgroundColor: 'rgba(0,0,0,0.8)',
                fontColor: 'white',
                fontSize: 12,
                borderRadius: 10,
                padding: 5,
                clickable: true
            });
        });
    }

    showMoleculeInfo(moleculeName) {
        const info = this.moleculeInfo[moleculeName];
        const infoContainer = document.getElementById('info_container');
        
        if (!info || !infoContainer) return;

        infoContainer.innerHTML = `
            <div class="molecule-info">
                <h2>${info.formula}</h2>
                <p>${info.description}</p>
            </div>
        `;

        // Animate info appearance
        infoContainer.style.opacity = '0';
        requestAnimationFrame(() => {
            infoContainer.style.opacity = '1';
            infoContainer.style.transition = 'opacity 0.3s ease-in-out';
        });
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        if (!messageDiv) return;

        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        messageDiv.style.display = 'block';

        requestAnimationFrame(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
            messageDiv.style.transition = 'all 0.3s ease-out';
        });

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-20px)';
            messageDiv.style.transition = 'all 0.3s ease-in';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 300);
        }, 3000);
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'r':
                    this.resetView();
                    break;
                case '+':
                case '=':
                    this.viewer.zoom(1.1);
                    break;
                case '-':
                    this.viewer.zoom(0.9);
                    break;
            }
            this.viewer.render();
        });
    }

    resetView() {
        this.viewer.zoomTo();
        this.viewer.center();
        this.viewer.render();
    }

    animate() {
        if (this.currentMolecule) {
            this.viewer.rotate(0.3);
            this.viewer.render();
        }
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the viewer
document.addEventListener('DOMContentLoaded', () => {
    new MoleculeViewer();
});
