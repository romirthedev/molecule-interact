import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import TWEEN from '@tweenjs/tween.js';

let scene, camera, renderer, controls;
let currentMolecule = null;
let raycaster, mouse;
let selectedBond = null;
let isZoomedIn = false;

// Molecule data
const molecules = {
    water: {
        name: 'Water (H₂O)',
        description: 'A molecule of water consists of two hydrogen atoms covalently bonded to a single oxygen atom.',
        atoms: [
            { element: 'O', pos: [0, 0, 0], radius: 0.3, color: 0xff0000 },
            { element: 'H', pos: [0.8, 0.6, 0], radius: 0.2, color: 0xffffff },
            { element: 'H', pos: [-0.8, 0.6, 0], radius: 0.2, color: 0xffffff }
        ],
        bonds: [
            { atoms: [0, 1], key: true },
            { atoms: [0, 2], key: true }
        ]
    },
    methane: {
        name: 'Methane (CH₄)',
        description: 'Methane is a tetrahedral molecule with four C-H bonds.',
        atoms: [
            { element: 'C', pos: [0, 0, 0], radius: 0.3, color: 0x808080 },
            { element: 'H', pos: [0.8, 0.8, 0.8], radius: 0.2, color: 0xffffff },
            { element: 'H', pos: [-0.8, -0.8, 0.8], radius: 0.2, color: 0xffffff },
            { element: 'H', pos: [0.8, -0.8, -0.8], radius: 0.2, color: 0xffffff },
            { element: 'H', pos: [-0.8, 0.8, -0.8], radius: 0.2, color: 0xffffff }
        ],
        bonds: [
            { atoms: [0, 1], key: true },
            { atoms: [0, 2], key: false },
            { atoms: [0, 3], key: false },
            { atoms: [0, 4], key: false }
        ]
    },
    ethanol: {
        name: 'Ethanol (C₂H₅OH)',
        description: 'Ethanol is an alcohol with a hydroxyl group (-OH) bonded to a carbon atom.',
        atoms: [
            { element: 'C', pos: [0, 0, 0], radius: 0.3, color: 0x808080 },
            { element: 'C', pos: [1.2, 0, 0], radius: 0.3, color: 0x808080 },
            { element: 'O', pos: [2.4, 0, 0], radius: 0.3, color: 0xff0000 },
            { element: 'H', pos: [-0.5, 0.9, 0], radius: 0.2, color: 0xffffff },
            { element: 'H', pos: [-0.5, -0.9, 0], radius: 0.2, color: 0xffffff },
            { element: 'H', pos: [1.7, 0.9, 0], radius: 0.2, color: 0xffffff },
            { element: 'H', pos: [1.7, -0.9, 0], radius: 0.2, color: 0xffffff },
            { element: 'H', pos: [2.9, 0, 0], radius: 0.2, color: 0xffffff }
        ],
        bonds: [
            { atoms: [0, 1], key: true },
            { atoms: [1, 2], key: true },
            { atoms: [0, 3], key: false },
            { atoms: [0, 4], key: false },
            { atoms: [1, 5], key: false },
            { atoms: [1, 6], key: false },
            { atoms: [2, 7], key: false }
        ]
    }
};

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a1929);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x2d5a9f, 2);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x2d5a9f, 1);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Camera position
    camera.position.z = 5;

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Raycaster setup
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click', onMouseClick, false);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isZoomedIn) {
            resetCamera();
        }
    });

    // UI setup
    setupUI();

    // Start animation loop
    animate();

    // Remove loading screen
    setTimeout(() => {
        document.querySelector('.loading-screen').style.display = 'none';
    }, 1000);
}
 // Create molecule geometry
        function createMolecule(moleculeData) {
            if (currentMolecule) {
                scene.remove(currentMolecule);
            }

            currentMolecule = new THREE.Group();

            // Create atoms
            moleculeData.atoms.forEach((atom, index) => {
                const geometry = new THREE.SphereGeometry(atom.radius, 32, 32);
                const material = new THREE.MeshPhongMaterial({
                    color: atom.color,
                    specular: 0x444444,
                    shininess: 30
                });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(...atom.pos);
                sphere.userData = { type: 'atom', index: index, element: atom.element };
                currentMolecule.add(sphere);
            });

            // Create bonds
            moleculeData.bonds.forEach((bond, index) => {
                const start = new THREE.Vector3(...moleculeData.atoms[bond.atoms[0]].pos);
                const end = new THREE.Vector3(...moleculeData.atoms[bond.atoms[1]].pos);
                const bondGroup = createBond(start, end, bond.key);
                bondGroup.userData = { type: 'bond', index: index, key: bond.key };
                currentMolecule.add(bondGroup);
            });

            scene.add(currentMolecule);
            updateMoleculeInfo(moleculeData);
        }

        // Create a single bond with optional highlight ring
        function createBond(start, end, isKey) {
            const bondGroup = new THREE.Group();
            
            // Main bond cylinder
            const direction = end.clone().sub(start);
            const length = direction.length();
            const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 12);
            const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const bond = new THREE.Mesh(bondGeometry, bondMaterial);

            // Position and rotate bond
            bond.position.copy(start.clone().add(end).multiplyScalar(0.5));
            bond.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                direction.normalize()
            );

            bondGroup.add(bond);

            // Add highlight ring for key bonds
            if (isKey) {
                const ringGeometry = new THREE.TorusGeometry(0.3, 0.02, 16, 100);
                const ringMaterial = new THREE.MeshPhongMaterial({
                    color: 0x00ff00,
                    transparent: true,
                    opacity: 0.7
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.position.copy(bond.position);
                ring.quaternion.copy(bond.quaternion);
                ring.rotation.x = Math.PI / 2;

                // Animate ring
// Animation for the ring
                const ringAnimation = {
                    update: function(time) {
                        ring.scale.x = 1 + Math.sin(time * 2) * 0.1;
                        ring.scale.y = 1 + Math.sin(time * 2) * 0.1;
                        ringMaterial.opacity = 0.5 + Math.sin(time * 2) * 0.2;
                    }
                };
                ring.userData = { animation: ringAnimation };
                bondGroup.add(ring);
            }

            return bondGroup;
        }

        // Animation loop
        function animate(time) {
            requestAnimationFrame(animate);

            // Update controls
            controls.update();

            // Animate key bond rings
            if (currentMolecule) {
                currentMolecule.traverse((child) => {
                    if (child.userData?.animation) {
                        child.userData.animation.update(time * 0.001);
                    }
                });
            }

            renderer.render(scene, camera);
        }

        // Handle window resizing
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // Mouse move handler
        function onMouseMove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Update raycaster
            raycaster.setFromCamera(mouse, camera);

            if (currentMolecule) {
                const intersects = raycaster.intersectObject(currentMolecule, true);
                const bondIntersect = intersects.find(i => i.object.parent?.userData?.type === 'bond');

                if (bondIntersect && bondIntersect.object.parent.userData.key) {
                    document.body.style.cursor = 'pointer';
                } else {
                    document.body.style.cursor = 'default';
                }
            }
        }

        // Mouse click handler
        function onMouseClick(event) {
            if (!currentMolecule || isZoomedIn) return;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(currentMolecule, true);
            const bondIntersect = intersects.find(i => i.object.parent?.userData?.type === 'bond');

            if (bondIntersect && bondIntersect.object.parent.userData.key) {
                zoomToBond(bondIntersect.object.parent);
            }
        }

        // Zoom to specific bond
        function zoomToBond(bondGroup) {
            isZoomedIn = true;
            controls.enabled = false;

            const bondPosition = new THREE.Vector3();
            bondGroup.getWorldPosition(bondPosition);

            const startRotation = currentMolecule.rotation.clone();
            const endRotation = new THREE.Euler(0, Math.PI / 2, 0);

            const startPos = camera.position.clone();
            const endPos = bondPosition.clone().add(new THREE.Vector3(0, 0, 2));

            // Create animation
            new TWEEN.Tween({ pos: startPos, rot: startRotation })
                .to({ pos: endPos, rot: endRotation }, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(function(obj) {
                    camera.position.copy(obj.pos);
                    currentMolecule.rotation.copy(obj.rot);
                })
                .onComplete(() => {
                    controls.enabled = true;
                })
                .start();
        }

        // Reset camera position
        function resetCamera() {
            isZoomedIn = false;
            controls.enabled = false;

            new TWEEN.Tween(camera.position)
                .to({ x: 0, y: 0, z: 5 }, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onComplete(() => {
                    controls.enabled = true;
                })
                .start();
        }

        // Update molecule information panel
        function updateMoleculeInfo(moleculeData) {
            const infoPanel = document.getElementById('molecule-info');
            infoPanel.innerHTML = `
                <h4>${moleculeData.name}</h4>
                <p>${moleculeData.description}</p>
                <p>Atoms: ${moleculeData.atoms.length}</p>
                <p>Bonds: ${moleculeData.bonds.length}</p>
                <p>Key bonds: ${moleculeData.bonds.filter(b => b.key).length}</p>
            `;
        }

        // Setup UI event handlers
        function setupUI() {
            // Molecule selection
            document.getElementById('molecule-select').addEventListener('change', (e) => {
                const moleculeName = e.target.value;
                if (moleculeName && molecules[moleculeName]) {
                    createMolecule(molecules[moleculeName]);
                }
            });

            // Help modal
            const helpButton = document.querySelector('.help-button');
            const helpModal = document.querySelector('.help-modal');
            
            helpButton.addEventListener('click', () => {
                helpModal.classList.toggle('active');
            });

            // Close modal on click outside
            window.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    helpModal.classList.remove('active');
                }
            });
        }
init();
  
