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
                emissiveIntensity: 0.5
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.copy(bond.position);
            ring.quaternion.copy(bond.quaternion);
            ring.rotation.x = Math.PI / 2;
            
            ring.userData.animation = {
                offset: (i / 3) * Math.PI * 2,
                speed: 1.5,
                pulseSpeed: 2
            };
            
            bondGroup.add(ring);
        }
    }

    return bondGroup;
}

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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (currentMolecule) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(currentMolecule, true);
        const bondIntersect = intersects.find(i => i.object.parent?.userData?.type === 'bond');

        document.body.style.cursor = bondIntersect && bondIntersect.object.parent.userData.key ? 'pointer' : 'default';
    }
}

function onMouseClick(event) {
    if (!currentMolecule || isZoomedIn) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(currentMolecule, true);
    const bondIntersect = intersects.find(i => i.object.parent?.userData?.type === 'bond');

    if (bondIntersect && bondIntersect.object.parent.userData.key) {
        zoomToBond(bondIntersect.object.parent);
    }
}

function zoomToBond(bondGroup) {
    isZoomedIn = true;
    controls.enabled = false;

    const bondPosition = new THREE.Vector3();
    bondGroup.getWorldPosition(bondPosition);

    const direction = camera.position.clone().sub(bondPosition).normalize();
    const targetPosition = bondPosition.clone().add(direction.multiplyScalar(2));

    new TWEEN.Tween(camera.position)
        .to(targetPosition, 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();

    new TWEEN.Tween(currentMolecule.rotation)
        .to({ y: currentMolecule.rotation.y + Math.PI * 2 }, 2000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start()
        .onComplete(() => {
            controls.enabled = true;
            controls.target.copy(bondPosition);
        });
}

function setupUI() {
    document.getElementById('molecule-select').addEventListener('change', (e) => {
        const moleculeName = e.target.value;
        if (moleculeName && molecules[moleculeName]) {
            createMolecule(molecules[moleculeName]);
        }
    });

    const helpButton = document.querySelector('.help-button');
    const helpModal = document.querySelector('.help-modal');
    
    helpButton.addEventListener('click', () => {
        helpModal.classList.toggle('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.remove('active');
        }
    });
}

function handleKeyDown(e) {
    if (e.key === 'Escape' && isZoomedIn) {
        resetCamera();
    }
}

function resetCamera() {
    isZoomedIn = false;
    controls.enabled = false;

    new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 0, z: 5 }, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();

    // Rotate molecule for better view
    new TWEEN.Tween(currentMolecule.rotation)
        .to({ y: currentMolecule.rotation.y + Math.PI * 2 }, 2000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start()
        .onComplete(() => {
            controls.enabled = true;
            controls.target.copy(bondPosition);
        });
}

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update();

    // Animate particles
    if (particleSystem) {
        particleSystem.rotation.y += 0.0001;
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time * 0.001 + positions[i]) * 0.01;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    // Animate molecule rotation
    if (currentMolecule && !isZoomedIn) {
        currentMolecule.rotation.y += 0.001;
    }

    // Animate bond rings
    if (currentMolecule) {
        currentMolecule.traverse((child) => {
            if (child.userData.animation) {
                const { offset, speed, pulseSpeed } = child.userData.animation;
                child.rotation.z = time * 0.001 * speed + offset;
                child.scale.setScalar(1 + Math.sin(time * 0.001 * pulseSpeed) * 0.1);
                if (child.material) {
                    child.material.opacity = 0.4 + Math.sin(time * 0.001 * pulseSpeed) * 0.2;
                }
            }
        });
    }

    controls.update();
    bloomComposer.render();
}

// The rest of your code remains the same...

init();

// Add background particles
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
        container.appendChild(particle container.appendChild(particle));
    }
}

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

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Add multiple point lights for dramatic effect
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

    // Enhanced controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.2;

    // Setup post-processing
    setupBloomEffect();
    
    // Create particle system
    createParticleSystem();
    
    // Create background particles
    createBackgroundParticles();

    // Raycaster setup
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click', onMouseClick, false);
    document.addEventListener('keydown', handleKeyDown);

    // UI setup with animations
    setupUI();

    // Start animation loop
    animate();

    // Fade in controls after loading
    setTimeout(() => {
        document.querySelector('.controls').classList.add('visible');
        document.querySelector('.info-panel').classList.add('visible');
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    }, 1000);
}

function handleKeyDown(e) {
    if (e.key === 'Escape' && isZoomedIn) {
        resetCamera();
    }
}

function resetCamera() {
    isZoomedIn = false;
    controls.enabled = false;

    // Reset camera with smooth animation
    new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 0, z: 5 }, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();

    // Reset controls target
    new TWEEN.Tween(controls.target)
        .to({ x: 0, y: 0, z: 0 }, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start()
        .onComplete(() => {
            controls.enabled = true;
        });
}

function setupUI() {
    // Enhanced molecule selection handler
    document.getElementById('molecule-select').addEventListener('change', (e) => {
        const moleculeName = e.target.value;
        if (moleculeName && molecules[moleculeName]) {
            // Fade out current molecule
            if (currentMolecule) {
                new TWEEN.Tween(currentMolecule.material)
                    .to({ opacity: 0 }, 500)
                    .start()
                    .onComplete(() => {
                        scene.remove(currentMolecule);
                        createMolecule(molecules[moleculeName]);
                    });
            } else {
                createMolecule(molecules[moleculeName]);
            }
        }
    });

    // Enhanced help modal
    const helpButton = document.querySelector('.help-button');
    const helpModal = document.querySelector('.help-modal');
    
    helpButton.addEventListener('click', () => {
        helpModal.classList.toggle('active');
    });

    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.remove('active');
        }
    });
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Highlight hovering effect
    if (currentMolecule) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(currentMolecule, true);
        const bondIntersect = intersects.find(i => i.object.parent?.userData?.type === 'bond');

        document.body.style.cursor = bondIntersect && bondIntersect.object.parent.userData.key ? 'pointer' : 'default';

        // Add hover effect to bonds
        currentMolecule.traverse((child) => {
            if (child.userData.type === 'bond' && child.material) {
                if (bondIntersect && bondIntersect.object.parent === child) {
                    child.material.emissiveIntensity = 0.5;
                } else {
                    child.material.emissiveIntensity = 0.2;
                }
            }
        });
    }
}

// Initialize the application
init();
