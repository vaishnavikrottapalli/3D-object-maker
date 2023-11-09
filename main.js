const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas") });
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 5;


let isDragging = false;
let selectedObject = null;
const offset = new THREE.Vector3();

document.addEventListener("mousemove", onMouseMove, false);
document.addEventListener("mousedown", onMouseDown, false);
document.addEventListener("mouseup", onMouseUp, false);

function onMouseMove(event) {
  if (!isDragging || !selectedObject) return;

  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
  vector.unproject(camera);

  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));
  selectedObject.position.copy(pos.sub(offset));
}

function onMouseDown(event) {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
  vector.unproject(camera);

  const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    isDragging = true;
    selectedObject = intersects[0].object;
    const pos = selectedObject.position.clone();
    offset.copy(pos).sub(intersects[0].point);
  }
}

function onMouseUp() {
  isDragging = false;
  selectedObject = null;
}

function addShape(geometry) {
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const shape = new THREE.Mesh(geometry, material);

  const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
  const outline = new THREE.Mesh(geometry, outlineMaterial);
  outline.scale.set(1.1, 1.1, 1.1);

  scene.add(shape);
  scene.add(outline);
}

function addCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  addShape(geometry);
}

function addSphere() {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  addShape(geometry);
}

function addCone() {
  const geometry = new THREE.ConeGeometry(0.5, 1, 32);
  addShape(geometry);
}

function addCylinder() {
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
  addShape(geometry);
}

function addPyramid() {
  const geometry = new THREE.ConeGeometry(0.5, 1, 4);
  addShape(geometry);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
