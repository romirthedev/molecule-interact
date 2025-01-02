/* class MoleculeViewer {
    constructor() {
        this.viewer = null;
        this.moleculeData = {
            methane: 
`Methane
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
            ethanol:
`Ethanol
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
            water:
`Water
  MOL    0

  3  2  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 O   0  0  0  0  0
    0.7572    0.5858    0.0000 H   0  0  0  0  0
   -0.7572    0.5858    0.0000 H   0  0  0  0  0
  1  2  1  0  0  0
  1  3  1  0  0  0
M  END`
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        const viewerContainer = document.getElementById('viewer_container');
        viewerContainer.innerHTML = '';
        
        console.log('Initializing viewer...');
        
        // Make sure required libraries are loaded
        if (typeof($) === 'undefined' || typeof($3Dmol) === 'undefined') {
            console.error('Required libraries not loaded');
            this.showMessage('Error: Required libraries not loaded', 'error');
            return;
        }

        this.viewer = $3Dmol.createViewer(viewerContainer, {
            backgroundColor: 'white',
            id: 'molecule_viewer',
            width: '100%',
            height: '100%'
        });

        if (!this.viewer) {
            console.error('Failed to create viewer');
            this.showMessage('Error: Failed to create viewer', 'error');
            return;
        }

        document.getElementById('loadButton').addEventListener('click', () => this.loadMolecule());
        console.log('Viewer created successfully');
    }

    loadMolecule() {
        const select = document.getElementById('moleculeSelect');
        const selectedMolecule = select.value;

        console.log('Selected molecule:', selectedMolecule);

        if (!selectedMolecule) {
            this.showMessage('Please select a molecule first.', 'error');
            return;
        }

        try {
            console.log(`Loading molecule: ${selectedMolecule}`);
            this.viewer.clear();

            const data = this.moleculeData[selectedMolecule];
            console.log('Molecule data (first 100 chars):', data.substring(0, 100));
            
            this.viewer.addModel(data, "mol");
            
            this.viewer.setStyle({}, {
                stick: {
                    colorscheme: 'Jmol',
                    radius: 0.2
                },
                sphere: {
                    colorscheme: 'Jmol',
                    scale: 0.3
                }
            });

            this.viewer.zoomTo();
            this.viewer.center();
            
            window.requestAnimationFrame(() => {
                this.viewer.render();
                console.log('Molecule rendered successfully');
            });

            this.showMessage(`${selectedMolecule.charAt(0).toUpperCase() + selectedMolecule.slice(1)} loaded successfully!`, 'success');
        } catch (error) {
            console.error('Error loading molecule:', error);
            this.showMessage(`Error loading molecule: ${error.message}`, 'error');
        }
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new MoleculeViewer();
});
*/

class MoleculeViewer {
    constructor() {
        this.viewer = null;
        this.currentMolecule = null;
        // Original molecule data - keep this exactly as it was since it was working
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

        // Bond information for highlighting
        this.bondInfo = {
            methane: [{ from: 0, to: 1, label: 'C-H Bond' }],
            ethanol: [
                { from: 0, to: 1, label: 'C-C Bond' },
                { from: 1, to: 2, label: 'C-O Bond' }
            ],
            water: [{ from: 0, to: 1, label: 'O-H Bond' }]
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        const viewerContainer = document.getElementById('viewer_container');
        viewerContainer.innerHTML = '';
        
        this.viewer = $3Dmol.createViewer(viewerContainer, {
            backgroundColor: 'white',
            id: 'molecule_viewer',
            width: '100%',
            height: '100%'
        });

        document.getElementById('loadButton').addEventListener('click', () => this.loadMolecule());
        
        // Initial viewer setup
        this.viewer.setStyle({}, {
            stick: {
                colorscheme: 'Jmol',
                radius: 0.2
            }
        });

        window.requestAnimationFrame(() => {
            this.viewer.resize();
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
            this.currentMolecule = selectedMolecule;

            // Load new molecule
            const data = this.moleculeData[selectedMolecule];
            this.viewer.addModel(data, "sdf");
            
            // Set style with atoms and bonds
            this.viewer.setStyle({}, {
                stick: {
                    colorscheme: 'Jmol',
                    radius: 0.2
                },
                sphere: {
                    colorscheme: 'Jmol',
                    scale: 0.3
                }
            });

            // Add highlighting for key bonds after molecule is loaded
            this.highlightKeyBonds(selectedMolecule);

            // Ensure proper sizing and centering
            this.viewer.zoomTo();
            this.viewer.center();
            this.viewer.render();

            // Add smooth rotation animation
            this.addLoadAnimation();

            this.showMessage(`${selectedMolecule.charAt(0).toUpperCase() + selectedMolecule.slice(1)} loaded successfully!`, 'success');
        } catch (error) {
            console.error('Error loading molecule:', error);
            this.showMessage(`Error loading molecule: ${error.message}`, 'error');
        }
    }

    highlightKeyBonds(moleculeName) {
        const bonds = this.bondInfo[moleculeName];
        if (!bonds) return;

        bonds.forEach(bond => {
            // Add clickable label near the bond
            const labelPos = this.calculateBondCenter(bond.from, bond.to);
            if (labelPos) {
                this.viewer.addLabel(bond.label, {
                    position: labelPos,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    fontColor: 'white',
                    fontSize: 12,
                    borderRadius: 10,
                    padding: 5
                });
            }
        });
    }

    calculateBondCenter(fromAtom, toAtom) {
        // This is a placeholder - you'll need to calculate actual positions
        // based on your molecule's structure
        return { x: 0, y: 0, z: 0 };
    }

    addLoadAnimation() {
        let frames = 0;
        const animate = () => {
            if (frames < 30) { // Rotate for 30 frames
                this.viewer.rotate(1);
                this.viewer.render();
                frames++;
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new MoleculeViewer();
});
