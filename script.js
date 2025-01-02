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

        // Modern color schemes for molecules
        this.moleculeStyles = {
            methane: {
                stickColor: '0x4a90e2',    // Modern blue
                sphereColors: {
                    C: '0x34495e',         // Dark gray for carbon
                    H: '0x95a5a6'          // Light gray for hydrogen
                }
            },
            ethanol: {
                stickColor: '0x2ecc71',    // Modern green
                sphereColors: {
                    C: '0x34495e',         // Dark gray for carbon
                    H: '0x95a5a6',         // Light gray for hydrogen
                    O: '0xe74c3c'          // Modern red for oxygen
                }
            },
            water: {
                stickColor: '0x3498db',    // Light blue
                sphereColors: {
                    O: '0xe74c3c',         // Modern red for oxygen
                    H: '0x95a5a6'          // Light gray for hydrogen
                }
            }
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
        
        if (typeof($) === 'undefined' || typeof($3Dmol) === 'undefined') {
            console.error('Required libraries not loaded');
            this.showMessage('Error: Required libraries not loaded', 'error');
            return;
        }

        this.viewer = $3Dmol.createViewer(viewerContainer, {
            backgroundColor: 'rgb(240, 242, 245)',
            id: 'molecule_viewer',
            width: '100%',
            height: '100%',
            renderStyle: "stick"
        });

        if (!this.viewer) {
            console.error('Failed to create viewer');
            this.showMessage('Error: Failed to create viewer', 'error');
            return;
        }

        this.setupEventListeners();
        console.log('Viewer created successfully');
    }

    setupEventListeners() {
        document.getElementById('loadButton').addEventListener('click', () => this.loadMolecule());
        
        document.addEventListener('keydown', (e) => {
            if (!this.currentMolecule) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.viewer.rotate(5);
                    break;
                case 'ArrowRight':
                    this.viewer.rotate(-5);
                    break;
                case 'ArrowUp':
                    this.viewer.zoom(1.1);
                    break;
                case 'ArrowDown':
                    this.viewer.zoom(0.9);
                    break;
                case 'r':
                    this.resetView();
                    break;
            }
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
            console.log(`Loading molecule: ${selectedMolecule}`);
            this.viewer.clear();
            this.currentMolecule = selectedMolecule;

            const data = this.moleculeData[selectedMolecule];
            const style = this.moleculeStyles[selectedMolecule];

            // Add model and create bonds
            let model = this.viewer.addModel(data, "mol");
            model.connect(model.selectedAtoms());

            // Base style for bonds and atoms
            this.viewer.setStyle({}, {
                stick: {
                    radius: 0.15,
                    color: style.stickColor,
                    opacity: 1
                },
                sphere: {
                    radius: 0.5,
                    scale: 0.3,
                    opacity: 1
                }
            });

            // Specific atom styles
            Object.entries(style.sphereColors).forEach(([atom, color]) => {
                this.viewer.setStyle({atom: atom}, {
                    sphere: {
                        color: color,
                        scale: atom === 'H' ? 0.25 : 0.4
                    }
                });
            });

            // Position molecule
            this.viewer.zoomTo();
            this.viewer.center();
            this.viewer.render();

            // Entrance animation
            this.playEntranceAnimation();

            this.showMessage(`${selectedMolecule.charAt(0).toUpperCase() + selectedMolecule.slice(1)} loaded successfully!`, 'success');
        } catch (error) {
            console.error('Error loading molecule:', error);
            this.showMessage(`Error loading molecule: ${error.message}`, 'error');
        }
    }

    playEntranceAnimation() {
        let frames = 0;
        const animate = () => {
            if (frames < 45) {
                this.viewer.rotate(1.5);
                if (frames < 15) {
                    this.viewer.zoom(1.01);
                }
                this.viewer.render();
                frames++;
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    resetView() {
        if (!this.currentMolecule) return;
        
        this.viewer.zoomTo();
        this.viewer.center();
        this.viewer.render();
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-20px)';
        messageDiv.style.display = 'block';
        
        requestAnimationFrame(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
            messageDiv.style.transition = 'all 0.3s ease-out';
        });
        
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(20px)';
            messageDiv.style.transition = 'all 0.3s ease-in';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 300);
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new MoleculeViewer();
});
