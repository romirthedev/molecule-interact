class MoleculeViewer {
    constructor() {
        this.viewer = null;
        this.moleculeData = {
            methane: `Methane (CH4)\n  CHEMDOOD08070920033D 0   0.00000     0.00000     0\n\n  5  4  0  0  0  0  0  0  0  0999 V2000\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.6294    0.6294    0.6294 H   0  0  0  0  0  0  0  0  0  0  0  0\n    -0.6294   -0.6294    0.6294 H   0  0  0  0  0  0  0  0  0  0  0  0\n    -0.6294    0.6294   -0.6294 H   0  0  0  0  0  0  0  0  0  0  0  0\n    0.6294   -0.6294   -0.6294 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  0  0  0  0\n  1  5  1  0  0  0  0\nM  END`,
            ethanol: `Ethanol (C2H5OH)\n  CHEMDOOD08070920033D 0   0.00000     0.00000     0\n\n  9  8  0  0  0  0  0  0  0  0999 V2000\n    1.2304   -0.2164    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.2164    0.2164    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.9410   -0.9845    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8584    0.6796    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    1.3889   -0.8124    0.8900 H   0  0  0  0  0  0  0  0  0  0  0  0\n    1.3889   -0.8124   -0.8900 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.3750    0.8124    0.8900 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.3750    0.8124   -0.8900 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.8584   -0.6796    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  1  4  1  0  0  0  0\n  1  5  1  0  0  0  0\n  1  6  1  0  0  0  0\n  2  7  1  0  0  0  0\n  2  8  1  0  0  0  0\n  3  9  1  0  0  0  0\nM  END`,
            water: `Water (H2O)\n  CHEMDOOD08070920033D 0   0.00000     0.00000     0\n\n  3  2  0  0  0  0  0  0  0  0999 V2000\n    0.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7572    0.5858    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.7572    0.5858    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  1  3  1  0  0  0  0\nM  END`
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
        this.viewer = $3Dmol.createViewer(viewerContainer, {
            backgroundColor: 'white',
            id: 'molecule_viewer',
            width: '100%',
            height: '100%'
        });

        document.getElementById('loadButton').addEventListener('click', () => this.loadMolecule());
        
        this.viewer.setStyle({}, {
            stick: {
                colorscheme: 'Jmol',
                radius: 0.2
            }
        });

        window.requestAnimationFrame(() => {
            this.viewer.resize();
            this.viewer.render();
            console.log('Initial viewer setup complete');
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

            const data = this.moleculeData[selectedMolecule];
            console.log('Molecule data:', data);
            
            this.viewer.addModel(data, "sdf");
            
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
            this.viewer.render();
            console.log('Molecule rendered successfully');

            this.showMessage(`${selectedMolecule.charAt(0).toUpperCase() + selectedMolecule.slice(1)} loaded successfully!`, 'success');
        } catch (error) {
            console.error('Error loading molecule:', error);
            this.showMessage(`Error loading molecule: ${error.message}`, 'error');
        }
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message
