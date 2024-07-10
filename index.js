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

// objects
const tableScale = 3
const tables = [
    {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, Math.PI / 2, 0),
        scale: new THREE.Vector3(tableScale,tableScale,tableScale)
    },
    {
        position: new THREE.Vector3(1, 0, 1),
        rotation: new THREE.Vector3(0, Math.PI / 2, 0),
        scale: new THREE.Vector3(tableScale,tableScale,tableScale)
    },
    {
        position: new THREE.Vector3(0, 0, 2),
        rotation: new THREE.Vector3(0, Math.PI / 2, 0),
        scale: new THREE.Vector3(tableScale,tableScale,tableScale)
    }
]

const monitorScale = 0.8
const monitors = [
    {
        position: new THREE.Vector3(0, 2.1, 0),
        rotation: new THREE.Vector3(0, Math.PI / 2, 0),
        scale: new THREE.Vector3(monitorScale,monitorScale,monitorScale)
    },
    {
        position: new THREE.Vector3(1, 2.1, 1),
        rotation: new THREE.Vector3(0, Math.PI / 2, 0),
        scale: new THREE.Vector3(monitorScale,monitorScale,monitorScale)
    },
    {
        position: new THREE.Vector3(0, 2.1, 2),
        rotation: new THREE.Vector3(0, Math.PI / 2, 0),
        scale: new THREE.Vector3(monitorScale,monitorScale,monitorScale)
    }
]

const tvScale = 1
const tvH =  {
        position: new THREE.Vector3(6, 0, -12),
        rotation: new THREE.Vector3(0, 90, 0),
        scale: new THREE.Vector3(tvScale,tvScale,tvScale)
    }
const tvV =    {
        position: new THREE.Vector3(8, 0, -8),
        rotation: new THREE.Vector3(0, 90, 0 ),
        scale: new THREE.Vector3(tvScale,tvScale,tvScale)
    }




// Set up background gradient
const topColor = new THREE.Color(0x00000);  // White
const bottomColor = new THREE.Color(0xD3D3D3);  // Light grey
const gradientTexture = createGradientTexture(topColor, bottomColor);
scene.background = gradientTexture;


// Create floor
const floorGeometry = new THREE.PlaneGeometry(30, 30);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x000000,  // Black
    roughness: 0.1,
    metalness: 0.1
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

// Set up camera position for top view
camera.position.set(0, 20, 0);
camera.lookAt(0, 0, 0);

// Rotate the view 90 degrees around the Z-axis
camera.up.set(1, 0, 0);

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
// const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
// const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const box = new THREE.Mesh(boxGeometry, boxMaterial);
// box.position.set(0, 2.5, 0);  // y = 2.5 to place it on top of the floor
// box.castShadow = true;
// scene.add(box);



// Load and add person models
const people = [];
const loader = new GLTFLoader();
const numberOfPeople = 5; // 20 new people + 1 original

// add a computer monitor
loader.load('monitor.glb', (gltf) => {
    const monitorModel = gltf.scene;
    monitorModel.castShadow = true;
    monitorModel.receiveShadow = true;
    
    // Change color to blue
    monitorModel.traverse((child) => {
        if (child.isMesh) {
            child.material.color.set(0xD3D3D3); // light grey color
            child.material.emissive = new THREE.Color(0xD3D3D3); // light grey emissive color
            child.material.emissiveIntensity = 0.3; // set emissive intensity to make it glow
            child.material.transparent = true; // make the material transparent
            child.material.opacity = 0.5; // set the opacity to 50%
        }
    });

    monitors.forEach(monitor => {
        const monitorClone = monitorModel.clone();
        monitorClone.position.copy(monitor.position);
        monitorClone.rotation.set(monitor.rotation.x, monitor.rotation.y, monitor.rotation.z);
        monitorClone.scale.copy(monitor.scale);
        scene.add(monitorClone);
    });
    
});

//add table
loader.load('desk.glb', (gltf) => {
    const deskModel = gltf.scene;
    deskModel.castShadow = true;
    deskModel.receiveShadow = true;

   // Change color to blue
   deskModel.traverse((child) => {
    if (child.isMesh) {
        child.material.color.set(0xD3D3D3); // light grey color
        child.material.emissive = new THREE.Color(0xD3D3D3); // light grey emissive color
        child.material.emissiveIntensity = 0.3; // set emissive intensity to make it glow
        child.material.transparent = true; // make the material transparent
        child.material.opacity = 0.5; // set the opacity to 50%
        }
    });


    tables.forEach(table => {
        const desk = deskModel.clone();
        desk.position.copy(table.position);
        desk.rotation.set(table.rotation.x, table.rotation.y, table.rotation.z);
        desk.scale.copy(table.scale);
        scene.add(desk);
    });
});

//add tv
loader.load('tv-h.glb', (gltf) => {
    const tvModel = gltf.scene;
    tvModel.castShadow = true;
    tvModel.receiveShadow = true;
    tvModel.position.copy(tvH.position);
    tvModel.rotation.set(tvH.rotation.x, tvH.rotation.y, tvH.rotation.z);
    tvModel.scale.copy(tvH.scale);


    tvModel.traverse((child) => {
        if (child.isMesh) {
            child.material.color.set(0xD3D3D3); // light grey color
            child.material.emissive = new THREE.Color(0xD3D3D3); // light grey emissive color
            child.material.emissiveIntensity = 0.3; // set emissive intensity to make it glow
            child.material.transparent = true; // make the material transparent
            child.material.opacity = 0.8; // set the opacity to 50%
            }
        });
    scene.add(tvModel);
});

loader.load('tv-v.glb', (gltf) => {
    const tvModel = gltf.scene;
    tvModel.castShadow = true;
    tvModel.receiveShadow = true;
    tvModel.position.copy(tvV.position);
    tvModel.rotation.set(tvV.rotation.x, tvV.rotation.y, tvV.rotation.z);
    tvModel.scale.copy(tvV.scale);


    tvModel.traverse((child) => {
        if (child.isMesh) {
            child.material.color.set(0xD3D3D3); // light grey color
            child.material.emissive = new THREE.Color(0xD3D3D3); // light grey emissive color
            child.material.emissiveIntensity = 0.3; // set emissive intensity to make it glow
            child.material.transparent = true; // make the material transparent
            child.material.opacity = 0.8; // set the opacity to 50%
            }
        });
    scene.add(tvModel);
});   



// function loadPerson(index) {
//     loader.load('tesla_bot_model.glb', (gltf) => {
//         const person = gltf.scene;
//         person.scale.set(0.5, 0.5, 0.5);
//         person.position.set(0, 0, 0);
//         person.castShadow = true;
//         person.receiveShadow = true;
//         scene.add(person);
//         people.push({
//             model: person,
//             angle: (Math.PI * 2 / numberOfPeople) * index,
//             speed: 0.01 + Math.random() * 0.01, // Randomize speed slightly
//             radius: 7 + Math.random() * 3 // Randomize radius slightly
//         });
//     });
// }

// for (let i = 0; i < numberOfPeople; i++) {
//     loadPerson(i);
// }

// Define the walking path
const pathPoints = [
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(10, 0, 0),
    new THREE.Vector3(10, 0, 10),
    new THREE.Vector3(-10, 0, 10),
    // new THREE.Vector3(0, 0, 0)
];
let currentPointIndex = 0;
const pathSpeed = 0.02;

// Man setting object
const manSettings = {
    scale: new THREE.Vector3(1.5, 1.5, 1.5),
    position: new THREE.Vector3(0, 0, 0),
    castShadow: true,
    receiveShadow: true,
    emissiveColor: new THREE.Color(0xD3D3D3),
    emissiveIntensity: 1.3,
    animationTimeScale: 0.8
};

// Load and add a walking man model
loader.load('alligator_walking_upright.glb', (gltf) => {
    const walkingMan = gltf.scene;
    walkingMan.scale.copy(manSettings.scale);
    walkingMan.position.copy(manSettings.position);
    walkingMan.castShadow = manSettings.castShadow;
    walkingMan.receiveShadow = manSettings.receiveShadow;
    
    // Set glow
    // walkingMan.traverse((child) => {
    //     if (child.isMesh) {
    //         child.material.emissive = manSettings.emissiveColor; // Set emissive color to light grey
    //         child.material.emissiveIntensity = manSettings.emissiveIntensity; // Set emissive intensity to make it glow
    //         child.material.needsUpdate = true; // Ensure material update
    //     }
    // });
    
    scene.add(walkingMan);
    // Add walking animation
    const mixer = new THREE.AnimationMixer(walkingMan);
    gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.timeScale = manSettings.animationTimeScale; // Slow down the animation to half speed
        action.play();
    });

    // Add to animation loop
    const clock = new THREE.Clock();
    function animateWalkingMan() {
        requestAnimationFrame(animateWalkingMan);
        const delta = clock.getDelta();
        mixer.update(delta);

        // Update walking man's position along the path
        const currentPoint = pathPoints[currentPointIndex];
        const nextPoint = pathPoints[(currentPointIndex + 1) % pathPoints.length];
        const direction = new THREE.Vector3().subVectors(nextPoint, currentPoint).normalize();
        walkingMan.position.add(direction.multiplyScalar(pathSpeed));

        // Ensure walking man stays on the plane
        walkingMan.position.y = 0;

        // Check if the walking man has reached the next point
        if (walkingMan.position.distanceTo(nextPoint) < pathSpeed) {
            currentPointIndex = (currentPointIndex + 1) % pathPoints.length;
        }

        // Adjust walking man's rotation to face the walking direction
        walkingMan.lookAt(nextPoint);

        // Ensure walking man does not go outside the boundary of floorGeometry
        const halfWidth = floorGeometry.parameters.width / 2;
        const halfHeight = floorGeometry.parameters.height / 2;
        walkingMan.position.x = Math.max(-halfWidth, Math.min(halfWidth, walkingMan.position.x));
        walkingMan.position.z = Math.max(-halfHeight, Math.min(halfHeight, walkingMan.position.z));
    }
    animateWalkingMan();

});


// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // people.forEach(person => {
    //     if (person.model) {
    //         // Update person's position
    //         person.angle += person.speed;
    //         const x = Math.cos(person.angle) * person.radius;
    //         const z = Math.sin(person.angle) * person.radius;
    //         person.model.position.set(x, 2.5, z);
            
    //         // Update person's rotation to face the walking direction
    //         person.model.rotation.y = person.angle + Math.PI / 2;
    //     }
    // });
    
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

// Create an info block
const infoBlock = document.createElement('div');
infoBlock.style.position = 'absolute';
infoBlock.style.bottom = '40px';
infoBlock.style.left = '40px';
infoBlock.style.padding = '40px';
infoBlock.style.backgroundColor = 'rgba(211, 211, 211, 0.7)';
infoBlock.style.color = 'white';
infoBlock.style.fontFamily = 'Arial, sans-serif';
infoBlock.style.fontSize = '36px';
infoBlock.style.borderRadius = '30px';
infoBlock.innerHTML = 'Crowd Count 3D Scene';
document.body.appendChild(infoBlock);


// Create an info block
const infoBlock2 = document.createElement('div');
infoBlock2.style.position = 'absolute';
infoBlock2.style.bottom = '40px';
infoBlock2.style.left = '540px';
infoBlock2.style.padding = '40px';
infoBlock2.style.backgroundColor = 'rgba(211, 211, 211, 0.7)';
infoBlock2.style.color = 'white';
infoBlock2.style.fontFamily = 'Arial, sans-serif';
infoBlock2.style.fontSize = '36px';
infoBlock2.style.borderRadius = '30px';
infoBlock2.innerHTML = 'Crowd Count 3D Scene';
document.body.appendChild(infoBlock2);


// backgrop
const additionalBoxGeometry = new THREE.BoxGeometry(15, 7, 0.2);
const additionalBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, transparent: true, opacity: 0.5 });
const additionalBox = new THREE.Mesh(additionalBoxGeometry, additionalBoxMaterial);
additionalBox.position.set(9, 3, 0);
additionalBox.rotation.y = Math.PI / 2; // Rotate 90 degrees around the z-axis
scene.add(additionalBox);
