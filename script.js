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
        // Adding bond information for highlighting and interaction
        this.moleculeInfo = {
            methane: {
                keyBonds: [
                    {
                        atoms: [0, 1], // C-H bond
                        color: '0x00FF00',
                        position: { x: 0.3147, y: 0.3147, z: 0.3147 },
                        label: 'C-H Bond',
                        description: 'Carbon-Hydrogen covalent bond'
                    }
                ]
            },
            ethanol: {
                keyBonds: [
                    {
                        atoms: [0, 1], // C-C bond
                        color: '0x00FF00',
                        position: { x: 0.507, y: 0, z: 0 },
                        label: 'C-C Bond',
                        description: 'Carbon-Carbon single bond'
                    },
                    {
                        atoms: [1, 2], // C-O bond
                        color: '0xFF0000',
                        position: { x: -0.5787, y: -0.384, z: 0 },
                        label: 'C-O Bond',
                        description: 'Carbon-Oxygen bond (hydroxyl group)'
                    }
                ]
            },
            water: {
                keyBonds: [
                    {
                        atoms: [0, 1], // O-H bond
                        color: '0x0000FF',
                        position: { x: 0.3786, y: 0.2929, z: 0 },
                        label: 'O-H Bond',
                        description: 'Oxygen-Hydrogen polar bond'
                    }
                ]
            }
        };
        this.moleculeData = {
            // ... your existing molecule data ...
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
        
        // Add click handler for bond selection
        this.viewer.clicked = (atom) => {
            if (atom) {
                this.handleAtomClick(atom);
            }
        };
    }

    loadMolecule() {
        const select = document.getElementById('moleculeSelect');
        const selectedMolecule = select.value;

        if (!selectedMolecule) {
            this.showMessage('Please select a molecule first.', 'error');
            return;
        }

        try {
            this.viewer.clear();
            this.currentMolecule = selectedMolecule;

            const data = this.moleculeData[selectedMolecule];
            this.viewer.addModel(data, "sdf");
            
            // Enhanced styling for better visualization
            this.viewer.setStyle({}, {
                stick: {
                    colorscheme: 'Jmol',
                    radius: 0.2,
                    opacity: 0.8
                },
                sphere: {
                    colorscheme: 'Jmol',
                    scale: 0.3,
                    opacity: 0.9
                }
            });

            // Highlight key bonds
            this.highlightKeyBonds(selectedMolecule);

            // Smooth animation for initial view
            this.animateInitialView();

            this.showMessage(`${selectedMolecule.charAt(0).toUpperCase() + selectedMolecule.slice(1)} loaded successfully!`, 'success');
        } catch (error) {
            this.showMessage(`Error loading molecule: ${error.message}`, 'error');
        }
    }

    highlightKeyBonds(moleculeName) {
        const info = this.moleculeInfo[moleculeName];
        if (!info || !info.keyBonds) return;

        info.keyBonds.forEach(bond => {
            // Add clickable labels
            this.viewer.addLabel(bond.label, {
                position: bond.position,
                backgroundColor: 'rgba(0,0,0,0.8)',
                fontColor: 'white',
                fontSize: 12,
                borderRadius: 10,
                padding: 5,
                clickable: true
            });

            // Highlight the bond
            this.viewer.addCylinder({
                start: { x: bond.position.x - 0.1, y: bond.position.y - 0.1, z: bond.position.z - 0.1 },
                end: { x: bond.position.x + 0.1, y: bond.position.y + 0.1, z: bond.position.z + 0.1 },
                radius: 0.1,
                fromCap: true,
                toCap: true,
                color: bond.color,
                opacity: 0.5
            });
        });
    }

    handleAtomClick(atom) {
        if (!this.currentMolecule) return;

        const info = this.moleculeInfo[this.currentMolecule];
        if (!info || !info.keyBonds) return;

        const clickedBond = info.keyBonds.find(bond => 
            bond.atoms.includes(atom.serial));

        if (clickedBond) {
            this.zoomToBond(clickedBond);
            this.showBondInfo(clickedBond);
        }
    }

    zoomToBond(bond) {
        const startPos = this.viewer.getCamera().position;
        const targetPos = {
            x: bond.position.x * 2,
            y: bond.position.y * 2,
            z: bond.position.z * 2 + 5
        };

        this.animateCamera(startPos, targetPos);
    }

    animateCamera(start, end, duration = 1000) {
        const startTime = Date.now();
        
        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            
            // Smooth easing
            const eased = this.easeInOutCubic(progress);
            
            const current = {
                x: start.x + (end.x - start.x) * eased,
                y: start.y + (end.y - start.y) * eased,
                z: start.z + (end.z - start.z) * eased
            };

            this.viewer.setCamera(current);
            this.viewer.render();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    animateInitialView() {
        this.viewer.rotate(180);
        this.viewer.center();
        this.viewer.zoomTo();

        // Add a slight rotation animation
        let angle = 0;
        const rotateView = () => {
            angle += 0.02;
            if (angle <= Math.PI) {
                this.viewer.rotate(1, { x: 0, y: 1, z: 0 });
                this.viewer.render();
                requestAnimationFrame(rotateView);
            }
        };
        rotateView();
    }

    showBondInfo(bond) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'bond-info';
        infoDiv.innerHTML = `
            <h3>${bond.label}</h3>
            <p>${bond.description}</p>
        `;
        
        // Remove any existing bond info
        const existing = document.querySelector('.bond-info');
        if (existing) existing.remove();
        
        document.getElementById('viewer_container').appendChild(infoDiv);
        
        // Animate info appearance
        infoDiv.style.opacity = '0';
        requestAnimationFrame(() => {
            infoDiv.style.opacity = '1';
            infoDiv.style.transition = 'opacity 0.3s ease-in-out';
        });
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
