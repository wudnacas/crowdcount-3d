import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Set up background gradient
const topColor = new THREE.Color(0xffffff);  // White
const bottomColor = new THREE.Color(0xe6e6e6);  // Light grey
const gradientTexture = createGradientTexture(topColor, bottomColor);
scene.background = gradientTexture;

// Create floor
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,  // Light grey
    roughness: 0.1,
    metalness: 0.1
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

// Set up camera position
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Function to create gradient texture
function createGradientTexture(topColor, bottomColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, bottomColor.getStyle());
    gradient.addColorStop(1, topColor.getStyle());
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 256);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// Add a box
const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 2.5, 0);  // y = 2.5 to place it on top of the floor
box.castShadow = true;
scene.add(box);

// Load and add person models
const people = [];
const loader = new GLTFLoader();
const numberOfPeople = 21; // 20 new people + 1 original

function loadPerson(index) {
    loader.load('tesla_bot_model.glb', (gltf) => {
        const person = gltf.scene;
        person.scale.set(0.5, 0.5, 0.5);
        person.position.set(0, 0, 0);
        person.castShadow = true;
        person.receiveShadow = true;
        scene.add(person);
        people.push({
            model: person,
            angle: (Math.PI * 2 / numberOfPeople) * index,
            speed: 0.01 + Math.random() * 0.01, // Randomize speed slightly
            radius: 7 + Math.random() * 3 // Randomize radius slightly
        });
    });
}

for (let i = 0; i < numberOfPeople; i++) {
    loadPerson(i);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    people.forEach(person => {
        if (person.model) {
            // Update person's position
            person.angle += person.speed;
            const x = Math.cos(person.angle) * person.radius;
            const z = Math.sin(person.angle) * person.radius;
            person.model.position.set(x, 2.5, z);
            
            // Update person's rotation to face the walking direction
            person.model.rotation.y = person.angle + Math.PI / 2;
        }
    });
    
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});