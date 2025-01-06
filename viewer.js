import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import * as TWEEN from '@tweenjs/tween.js';

let scene, camera, renderer, controls;
let currentMolecule = null;
let raycaster, mouse;
let selectedBond = null;
let isZoomedIn = false;
let bloomComposer;
let particleSystem;

// Molecule data
const molecules = {
    water: {
        name: 'Water (H₂O)',
        description: 'A molecule of water consists of two hydrogen atoms covalently bonded to a single oxygen atom.',
        atoms: [
            { element: 'O', pos: [0, 0, 0], radius: 0.3, color: 0xff4444 },  // Bright red for oxygen
            { element: 'H', pos: [0.8, 0.6, 0], radius: 0.2, color: 0x00ffff },  // Cyan for hydrogen
            { element: 'H', pos: [-0.8, 0.6, 0], radius: 0.2, color: 0x00ffff }  // Cyan for hydrogen
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
            { element: 'C', pos: [0, 0, 0], radius: 0.3, color: 0x00ff00 },  // Bright green for carbon
            { element: 'H', pos: [0.8, 0.8, 0.8], radius: 0.2, color: 0xff00ff },  // Magenta for hydrogen
            { element: 'H', pos: [-0.8, -0.8, 0.8], radius: 0.2, color: 0xff00ff },
            { element: 'H', pos: [0.8, -0.8, -0.8], radius: 0.2, color: 0xff00ff },
            { element: 'H', pos: [-0.8, 0.8, -0.8], radius: 0.2, color: 0xff00ff }
        ],
        bonds: [
            { atoms: [0, 1], key: true },
            { atoms: [0, 2], key: false },
            { atoms: [0, 3], key: false },
            { atoms: [0, 4], key: false }
        ]
    }
};

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const lights = [
        { color: 0x38bdf8, intensity: 2, pos: [10, 10, 10] },
        { color: 0x0ea5e9, intensity: 1, pos: [-10, -10, -10] },
        { color: 0x7dd3fc, intensity: 1.5, pos: [0, 15, 0] }
    ];

    lights.forEach(light => {
        const pointLight = new THREE.PointLight(light.color, light.intensity);
        pointLight.position.set(...light.pos);
        scene.add(pointLight);
    });

    // Camera position
    camera.position.z = 5;

    // Controls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.2;

    // Setup raycaster
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click', onMouseClick, false);
    document.addEventListener('keydown', handleKeyDown, false);

    // Setup UI elements
    setupUI();
    setupBloomEffect();
    createParticleSystem();
    createBackgroundParticles();

    // Start animation
    animate();

    // Remove loading screen
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        const controls = document.querySelector('.controls');
        const infoPanel = document.querySelector('.info-panel');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        if (controls) controls.classList.add('visible');
        if (infoPanel) infoPanel.classList.add('visible');
    }, 1000);
}

function setupBloomEffect() {
    bloomComposer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, 0.4, 0.85
    );
    bloomComposer.addPass(renderPass);
    bloomComposer.addPass(bloomPass);
}

function createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const particles = 1000;
    const positions = new Float32Array(particles * 3);

    for (let i = 0; i < particles * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function createBackgroundParticles() {
    const container = document.createElement('div');
    container.className = 'background-particles';
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.setProperty('--translateX', `${Math.random() * 400 - 200}px`);
        particle.style.setProperty('--translateY', `${Math.random() * 400 - 200}px`);
        particle.style.animationDelay = `-${Math.random() * 20}s`;
        container.appendChild(particle);
    }
}

function setupUI() {
    const select = document.getElementById('molecule-select');
    if (select) {
        select.addEventListener('change', (e) => {
            if (e.target.value) {
                loadMolecule(e.target.value);
            }
        });
    }

    const helpButton = document.querySelector('.help-button');
    const helpModal = document.querySelector('.help-modal');
    
    if (helpButton && helpModal) {
        helpButton.addEventListener('click', () => {
            helpModal.classList.add('active');
        });

        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.classList.remove('active');
            }
        });
    }
}

function loadMolecule(name) {
    // Clear existing scene elements except lights and particles
    const objectsToRemove = [];
    scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Group) {
            if (object !== particleSystem) {
                objectsToRemove.push(object);
            }
        }
    });
    objectsToRemove.forEach(object => scene.remove(object));

    const molecule = molecules[name];
    if (!molecule) return;

    currentMolecule = {
        ...molecule,
        center: new THREE.Vector3(0, 0, 0)
    };

    // Create atoms
    molecule.atoms.forEach((atom, index) => {
        const geometry = new THREE.SphereGeometry(atom.radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: atom.color,
            shininess: 100
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...atom.pos);
        mesh.userData = { atomIndex: index };
        scene.add(mesh);
    });

    // Create bonds
    molecule.bonds.forEach((bond, index) => {
        const start = new THREE.Vector3(...molecule.atoms[bond.atoms[0]].pos);
        const end = new THREE.Vector3(...molecule.atoms[bond.atoms[1]].pos);
        const bondObject = createBond(start, end, bond.key);
        bondObject.userData = { bondIndex: index };
    });

    // Update info panel
    const infoPanel = document.querySelector('.info-panel');
    if (infoPanel) {
        infoPanel.innerHTML = `
            <h4>${molecule.name}</h4>
            <p>${molecule.description}</p>
        `;
    }

    // Reset camera and controls
    camera.position.set(0, 0, 5);
    controls.reset();
}

function createBond(start, end, isKey) {
    const bondGroup = new THREE.Group();
    
    const direction = end.clone().sub(start);
    const length = direction.length();
    
    const bondGeometry = new THREE.CylinderGeometry(0.05, 0.05, length, 16);
    const bondMaterial = new THREE.MeshPhongMaterial({
        color: 0xffff00,  // Yellow for bonds
        emissive: 0xff9500,  // Orange emissive
        emissiveIntensity: 0.3,
        shininess: 100
    });
    
    const bond = new THREE.Mesh(bondGeometry, bondMaterial);
    
    bond.position.copy(start.clone().add(end).multiplyScalar(0.5));
    bond.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
    );
    
    bondGroup.add(bond);

    if (isKey) {
        // Add decorative rings for key bonds with new colors
        const ringRadius = 0.15;
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.TorusGeometry(ringRadius, 0.02, 16, 32);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: 0xff9500,  // Orange for rings
                transparent: true,
                opacity: 0.8,
                emissive: 0xff9500,
                emissiveIntensity: 0.6
            });

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.copy(bond.position);
            ring.rotation.x = Math.PI / 2;
            ring.position.y += (i - 1) * 0.2;
            bondGroup.add(ring);
        }
    }

    scene.add(bondGroup);
    return bondGroup;
}

// Update the selectBond function for new highlight colors
function selectBond(bondObject) {
    if (selectedBond) {
        selectedBond.material.emissive.setHex(0xff9500);  // Reset to orange
        selectedBond.material.emissiveIntensity = 0.3;
    }
    
    selectedBond = bondObject;
    if (selectedBond) {
        selectedBond.material.emissive.setHex(0x00ff00);  // Green highlight
        selectedBond.material.emissiveIntensity = 0.8;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.bondIndex !== undefined) {
            selectBond(object);
        }
    }
}

function selectBond(bondObject) {
    if (selectedBond) {
        selectedBond.material.emissive.setHex(0x38bdf8);
        selectedBond.material.emissiveIntensity = 0.2;
    }
    
    selectedBond = bondObject;
    if (selectedBond) {
        selectedBond.material.emissive.setHex(0x00ff00);
        selectedBond.material.emissiveIntensity = 0.5;
    }
}

function handleKeyDown(event) {
    if (event.key === 'Escape') {
        camera.position.set(0, 0, 5);
        controls.reset();
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    if (particleSystem) {
        particleSystem.rotation.y += 0.0005;
    }
    
    controls.update();
    TWEEN.update();
    
    bloomComposer.render();
}

// Initialize the application
init();
