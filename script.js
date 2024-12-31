class MoleculeViewer {
    constructor() {
        this.viewer = null;
        this.currentMolecule = null;
        this.moleculeData = {
            methane: {
                structure: `Methane
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
                bonds: [
                    {
                        atoms: [0, 1],
                        label: 'C-H Bond',
                        description: 'Single covalent bond between carbon and hydrogen',
                        position: { x: 0.3147, y: 0.3147, z: 0.3147 }
                    },
                    {
                        atoms: [0, 2],
                        label: 'C-H Bond',
                        description: 'Single covalent bond between carbon and hydrogen',
                        position: { x: -0.3147, y: -0.3147, z: 0.3147 }
                    }
                ],
                info: {
                    formula: 'CH₄',
                    description: 'Methane is the simplest hydrocarbon, consisting of one carbon atom bonded to four hydrogen atoms.',
                    properties: ['Colorless', 'Odorless', 'Highly flammable']
                }
            },
            ethanol: {
                structure: `Ethanol
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
                bonds: [
                    {
                        atoms: [0, 1],
                        label: 'C-C Bond',
                        description: 'Single covalent bond between two carbon atoms',
                        position: { x: 0.507, y: 0, z: 0 }
                    },
                    {
                        atoms: [1, 2],
                        label: 'C-O Bond',
                        description: 'Single covalent bond between carbon and oxygen (hydroxyl group)',
                        position: { x: -0.5787, y: -0.384, z: 0 }
                    }
                ],
                info: {
                    formula: 'C₂H₅OH',
                    description: 'Ethanol is an organic compound with a hydroxyl group (-OH) bound to a carbon atom.',
                    properties: ['Colorless liquid', 'Volatile', 'Flammable', 'Commonly found in alcoholic beverages']
                }
            },
            water: {
                structure: `Water
  MOL    0

  3  2  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 O   0  0  0  0  0
    0.7572    0.5858    0.0000 H   0  0  0  0  0
   -0.7572    0.5858    0.0000 H   0  0  0  0  0
  1  2  1  0  0  0
  1  3  1  0  0  0
M  END`,
                bonds: [
                    {
                        atoms: [0, 1],
                        label: 'O-H Bond',
                        description: 'Polar covalent bond between oxygen and hydrogen',
                        position: { x: 0.3786, y: 0.2929, z: 0 }
                    },
                    {
                        atoms: [0, 2],
                        label: 'O-H Bond',
                        description: 'Polar covalent bond between oxygen and hydrogen',
                        position: { x: -0.3786, y: 0.2929, z: 0 }
                    }
                ],
                info: {
                    formula: 'H₂O',
                    description: 'Water is a polar inorganic compound that is essential for all known forms of life.',
                    properties: ['Colorless liquid', 'No odor', 'High surface tension', 'Universal solvent']
                }
            }
        };

        this.animationSettings = {
            duration: 750,
            zoomLevel: 2.5,
            rotationSpeed: 0.005
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
        
        console.log('Initializing enhanced viewer...');
        
        if (typeof($) === 'undefined' || typeof($3Dmol) === 'undefined') {
            console.error('Required libraries not loaded');
            this.showMessage('Error: Required libraries not loaded', 'error');
            return;
        }

        this.viewer = $3Dmol.createViewer(viewerContainer, {
            backgroundColor: 'transparent',
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
        this.viewer.clicked = (target) => this.handleMoleculeClick(target);
        this.startAmbientRotation();
        this.addInteractiveFeatures();
        this.addVisualEffects();
        
        console.log('Enhanced viewer created successfully');
    }

    startAmbientRotation() {
        let angle = 0;
        const animate = () => {
            if (this.currentMolecule) {
                angle += this.animationSettings.rotationSpeed;
                this.viewer.rotate(0.2 * Math.sin(angle), {x: 0, y: 1, z: 0});
                this.viewer.render();
            }
            requestAnimationFrame(animate);
        };
        animate();
    }

    handleMoleculeClick(target) {
        if (!target.clickLabel) return;
        const bond = this.findBondByLabel(target.clickLabel);
        if (bond) {
            this.zoomToBond(bond);
            this.showBondInfo(bond);
        }
    }

    findBondByLabel(label) {
        const moleculeInfo = this.moleculeData[this.currentMolecule];
        return moleculeInfo.bonds.find(bond => bond.label === label);
    }

    zoomToBond(bond) {
        const {position} = bond;
        const currentPos = this.viewer.getCamera().position;
        const targetPos = {
            x: position.x * this.animationSettings.zoomLevel,
            y: position.y * this.animationSettings.zoomLevel,
            z: position.z * this.animationSettings.zoomLevel + 10
        };
        this.animateCamera(currentPos, targetPos);
    }

    animateCamera(start, end) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.animationSettings.duration, 1);
            const eased = this.easeInOutCubic(progress);
            const newPos = {
                x: start.x + (end.x - start.x) * eased,
                y: start.y + (end.y - start.y) * eased,
                z: start.z + (end.z - start.z) * eased
            };
            this.viewer.setCamera(newPos);
            this.viewer.render();
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    showBondInfo(bond) {
        const infoContainer = document.getElementById('info_container');
        infoContainer.innerHTML = `
            <div class="bond-info">
                <h3>${bond.label}</h3>
                <p>${bond.description}</p>
            </div>
        `;
        infoContainer.style.opacity = '0';
        requestAnimationFrame(() => {
            infoContainer.style.opacity = '1';
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
            console.log(`Loading enhanced molecule: ${selectedMolecule}`);
            this.viewer.clear();

            const moleculeInfo = this.moleculeData[selectedMolecule];
            this.currentMolecule = selectedMolecule;

            this.viewer.addModel(moleculeInfo.structure, "mol");
            
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

            moleculeInfo.bonds.forEach(bond => {
                this.viewer.addLabel(bond.label, {
                    position: bond.position,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    fontColor: 'white',
                    fontSize: 12,
                    borderRadius: 10,
                    padding: 5
clickable: true
                });
            });

            this.showMoleculeInfo(moleculeInfo.info);
            this.viewer.zoomTo();
            this.viewer.center();
            
            const viewerElement = document.getElementById('viewer_container');
            viewerElement.style.opacity = '0';
            
            window.requestAnimationFrame(() => {
                this.viewer.render();
                viewerElement.style.opacity = '1';
                viewerElement.style.transition = 'opacity 0.5s ease-in-out';
            });

            this.showMessage(`${selectedMolecule.charAt(0).toUpperCase() + selectedMolecule.slice(1)} loaded successfully!`, 'success');
        } catch (error) {
            console.error('Error loading molecule:', error);
            this.showMessage(`Error loading molecule: ${error.message}`, 'error');
        }
    }

    showMoleculeInfo(info) {
        const infoContainer = document.getElementById('info_container');
        infoContainer.innerHTML = `
            <div class="molecule-info">
                <h2 class="formula">${info.formula}</h2>
                <p class="description">${info.description}</p>
                <div class="properties">
                    ${info.properties.map(prop => `<span class="property-tag">${prop}</span>`).join('')}
                </div>
            </div>
        `;
        
        const elements = infoContainer.getElementsByTagName('*');
        Array.from(elements).forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.transition = 'all 0.5s ease-out';
            }, index * 100);
        });
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        
        messageDiv.style.transform = 'translateY(20px)';
        messageDiv.style.opacity = '0';
        messageDiv.style.display = 'block';
        
        requestAnimationFrame(() => {
            messageDiv.style.transform = 'translateY(0)';
            messageDiv.style.opacity = '1';
            messageDiv.style.transition = 'all 0.3s ease-out';
        });
        
        setTimeout(() => {
            messageDiv.style.transform = 'translateY(-20px)';
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'all 0.3s ease-in';
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 300);
        }, 3000);
    }

    addInteractiveFeatures() {
        document.getElementById('viewer_container').addEventListener('dblclick', () => {
            this.resetView();
        });

        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'r':
                    this.resetView();
                    break;
                case '+':
                case '=':
                    this.viewer.zoom(1.1);
                    this.viewer.render();
                    break;
                case '-':
                    this.viewer.zoom(0.9);
                    this.viewer.render();
                    break;
            }
        });
    }

    resetView() {
        this.viewer.zoomTo();
        this.viewer.center();
        
        if (this.currentMolecule) {
            this.showMoleculeInfo(this.moleculeData[this.currentMolecule].info);
        }
    }

    addVisualEffects() {
        this.viewer.addSphere({
            center: {x: 0, y: 0, z: 0},
            radius: 0.5,
            color: 'white',
            opacity: 0.2
        });
        
        let time = 0;
        const animate = () => {
            time += 0.01;
            const scale = 1 + 0.05 * Math.sin(time);
            
            if (this.currentMolecule) {
                this.viewer.setStyle({}, {
                    stick: {
                        radius: 0.2 * scale
                    },
                    sphere: {
                        scale: 0.3 * scale
                    }
                });
                this.viewer.render();
            }
            
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// Initialize the application with all enhanced features
document.addEventListener('DOMContentLoaded', () => {
    new MoleculeViewer();
});
