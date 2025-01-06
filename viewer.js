import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import TWEEN from '@tweenjs/tween.js';

let scene, camera, renderer, controls;
let currentMolecule = null;
let raycaster, mouse;
let selectedBond = null;
let isZoomedIn = false;
let bloomComposer;
let particleSystem;

// Add Bloom Effect
function setupBloomEffect() {
    const params = {
        exposure: 1,
        bloomStrength: 1.5,
        bloomThreshold: 0,
        bloomRadius: 0.8
    };

    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, 0.4, 0.85
    );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    bloomComposer = new THREE.EffectComposer(renderer);
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);
}

// Create particle system for background
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

function createBond(start, end, isKey) {
    const bondGroup = new THREE.Group();
    
    const direction = end.clone().sub(start);
    const length = direction.length();
    
    // Create main bond cylinder with glow effect
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
        // Create animated rings for key bonds
        const ringCount = 3;
        for (let i = 0; i < ringCount; i++) {
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
            
            // Custom animation properties
            ring.userData.animation = {
                offset: (i / ringCount) * Math.PI * 2,
                speed: 1.5,
                pulseSpeed: 2
            };
            
            bondGroup.add(ring);
        }
    }

    return bondGroup;
}

function zoomToBond(bondGroup) {
    isZoomedIn = true;
    controls.enabled = false;

    const bondPosition = new THREE.Vector3();
    bondGroup.getWorldPosition(bondPosition);

    // Calculate target position for dramatic zoom
    const direction = camera.position.clone().sub(bondPosition).normalize();
    const targetPosition = bondPosition.clone().add(direction.multiplyScalar(2));

    // Create smooth camera movement
    new TWEEN.Tween(camera.position)
        .to(targetPosition, 1000)
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
        container.appendChild(particle container.appendChild(particle);
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
