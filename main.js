let scene, camera, renderer, molecule;
let currentMolecule = null;
let rotationAnimation = true;

function init() {
    // Setup scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x1a202c);
    document.querySelector('.canvas-container').appendChild(renderer.domElement);

    // Setup lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 5;

    // Setup controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (molecule && rotationAnimation) {
            molecule.rotation.y += 0.005;
        }
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function createMoleculeGeometry(moleculeData) {
    if (molecule) {
        scene.remove(molecule);
    }

    molecule = new THREE.Group();

    // Create atoms
    moleculeData.atoms.forEach(atom => {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: atom.color,
            specular: 0x444444,
            shininess: 30
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(...atom.position);
        molecule.add(sphere);
    });

    // Create bonds
    moleculeData.bonds.forEach(bond => {
        const start = new THREE.Vector3(...moleculeData.atoms[bond.from].position);
        const end = new THREE.Vector3(...moleculeData.atoms[bond.to].position);
        const direction = end.clone().sub(start);
        const length = direction.length();

        const bondGeometry = new THREE.CylinderGeometry(0.05, 0.05, length, 8);
        const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const bondMesh = new THREE.Mesh(bondGeometry, bondMaterial);

        // Position and rotate bond
        bondMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
        bondMesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );

        molecule.add(bondMesh);
    });

    scene.add(molecule);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Setup UI
function setupUI() {
    const container = document.createElement('div');
    container.className = 'search-container';
    
    const input = document.createElement('input');
    input.className = 'search-input';
    input.placeholder = 'Search molecules...';
    
    const list = document.createElement('div');
    list.className = 'molecule-list';
    
    container.appendChild(input);
    container.appendChild(list);
    document.body.appendChild(container);

    input.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredMolecules = moleculeDatabase.filter(mol => 
            mol.name.toLowerCase().includes(searchTerm)
        );
        
        list.innerHTML = '';
        filteredMolecules.forEach(mol => {
            const item = document.createElement('div');
            item.className = 'molecule-item';
            item.textContent = mol.name;
            item.addEventListener('click', () => {
                createMoleculeGeometry(mol);
                currentMolecule = mol;
                list.innerHTML = '';
                input.value = mol.name;
            });
            list.appendChild(item);
        });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    document.body.appendChild(canvasContainer);
    
    init();
    setupUI();
});
