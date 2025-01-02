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
        // Keep the original working molecule data
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

        // Add metadata for enhanced visualization
        this.moleculeMetadata = {
            methane: {
                keyBonds: [[0, 1]], // C-H bond
                color: '0x00FF00'
            },
            ethanol: {
                keyBonds: [[0, 1], [1, 2]], // C-C and C-O bonds
                color: '0x0000FF'
            },
            water: {
                keyBonds: [[0, 1]], // O-H bond
                color: '0xFF0000'
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
        this.setupInteractions();
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
            this.currentMolecule = selectedMolecule;

            const data = this.moleculeData[selectedMolecule];
            
            // Add the model with enhanced styling
            this.viewer.addModel(data, "mol");
            
            // Apply enhanced styling
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

            // Add shine effect
            this.viewer.addSurface($3Dmol.SAS, {
                opacity: 0.3,
                color: 'white'
            });

            // Initial view setup
            this.viewer.zoomTo();
            this.viewer.center();

            // Start entrance animation
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
            if (frames < 30) {
                this.viewer.rotate(3);
                this.viewer.render();
                frames++;
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    setupInteractions() {
        // Add click handler
        this.viewer.clicked = (atom) => {
            if (atom && this.currentMolecule) {
                this.handleAtomClick(atom);
            }
        };

        // Add keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.viewer.rotate(5);
                    break;
                case 'ArrowRight':
                    this.viewer.rotate(-5);
                    break;
                case '+':
                    this.viewer.zoom(1.1);
                    break;
                case '-':
                    this.viewer.zoom(0.9);
                    break;
            }
            this.viewer.render();
        });
    }

    handleAtomClick(atom) {
        const metadata = this.moleculeMetadata[this.currentMolecule];
        if (!metadata) return;

        // Highlight clicked atom and its bonds
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

        this.viewer.setStyle({serial: atom.serial}, {
            stick: {
                color: metadata.color,
                radius: 0.3
            },
            sphere: {
                color: metadata.color,
                scale: 0.4
            }
        });

        this.viewer.render();
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        
        // Enhanced message animation
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
