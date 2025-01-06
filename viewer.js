import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import TWEEN from '@tweenjs/tween.js';

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

    // Setup effects
    setupBloomEffect();
    createParticleSystem();
    createBackgroundParticles();

    // Raycaster setup
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click', onMouseClick, false);
    document.addEventListener('keydown', handleKeyDown);

    // Setup UI and start animation
    setupUI();
    animate();

    // Remove loading screen
    setTimeout(() => {
        document.querySelector('.loading-screen').style.opacity = '0';
        document.querySelector('.controls').classList.add('visible');
        document.querySelector('.info-panel').classList.add('visible');
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
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
    const sizes = new Float32Array(particles);

    for (let i = 0; i < particles; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        sizes[i] = Math.random() * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

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

function createBond(start, end, isKey) {
    const bondGroup = new THREE.Group();
    
    const direction = end.clone().sub(start);
    const length = direction.length();
    
    const bondGeometry = new THREE.CylinderGeometry(0.08, 0.08, length, 16);
    const bondMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.2,
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
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.TorusGeometry(0.25, 0.02, 16, 100);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: 0x38bdf8,
                transparent: true,
                opacity: 0.6,
                                emissive: 0x38bdf8,
                emissiveIntensity: 0.4
            });

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.copy(bond.position);
            ring.rotation.x = Math.PI / 2;
            ring.position.y += (i - 1) * 0.15; // Space out the rings
            bondGroup.add(ring);
        }
    }

    scene.add(bondGroup);
    return bondGroup;
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
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.atomIndex !== undefined) {
            highlightAtom(object.userData.atomIndex);
        } else if (object.userData.bondIndex !== undefined) {
            selectBond(object.userData.bondIndex);
        }
    }
}

function handleKeyDown(event) {
    if (event.key === 'z') {
        toggleZoom();
    } else if (event.key === 'h') {
        toggleHighlight();
    }
}

function toggleZoom() {
    if (!isZoomedIn) {
        const target = currentMolecule.center.clone();
        const tween = new TWEEN.Tween(camera.position)
            .to(
                {
                    x: target.x + 1.5,
                    y: target.y + 1.5,
                    z: target.z + 1.5
                },
                1000
            )
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    } else {
        const tween = new TWEEN.Tween(camera.position)
            .to({ x: 0, y: 0, z: 5 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }
    isZoomedIn = !isZoomedIn;
}

function toggleHighlight() {
    if (selectedBond) {
        selectedBond.material.color.set(0xffffff); // Reset color
        selectedBond = null;
    }
}

function setupUI() {
    const moleculeList = document.querySelector('.molecule-list');
    Object.keys(molecules).forEach((key) => {
        const item = document.createElement('button');
        item.textContent = molecules[key].name;
        item.addEventListener('click', () => loadMolecule(key));
        moleculeList.appendChild(item);
    });
}

function loadMolecule(name) {
    if (currentMolecule) {
        scene.clear();
    }
    const molecule = molecules[name];
    currentMolecule = molecule;

    molecule.atoms.forEach((atom, index) => {
        const geometry = new THREE.SphereGeometry(atom.radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: atom.color });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(...atom.pos);
        mesh.userData = { atomIndex: index };
        scene.add(mesh);
    });

    molecule.bonds.forEach((bond) => {
        const start = new THREE.Vector3(...molecule.atoms[bond.atoms[0]].pos);
        const end = new THREE.Vector3(...molecule.atoms[bond.atoms[1]].pos);
        createBond(start, end, bond.key);
    });

    camera.position.set(0, 0, 5);
    controls.reset();
    document.querySelector('.info-panel .title').textContent = molecule.name;
    document.querySelector('.info-panel .description').textContent = molecule.description;
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    TWEEN.update();

    particleSystem.rotation.y += 0.001;
    bloomComposer.render();
}

// Start the application
init();
