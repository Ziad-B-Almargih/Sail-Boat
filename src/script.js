import "./style.css";
import * as THREE from "three";
import { World } from "./World";
import { AmbientLight, DirectionalLight } from "three";
import { Controller } from "./Controller";
import { CameraController } from "./CameraController";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const size = {
	width: window.innerWidth,
	height: window.innerHeight,
};
//scheme
const scene = new THREE.Scene();

const loader = new RGBELoader();
loader.setDataType(THREE.UnsignedByteType); // Set the data type
loader.load(
	"kloppenheim_06_puresky_4k.hdr",
	function (texture) {
		texture.mapping = THREE.EquirectangularReflectionMapping;
		scene.background = texture;
		scene.environment = texture;
	},
	() => {
		console.log("in progses");
	},
	(error) => {
		console.log(error);
	}
);

//camera
const camera = new THREE.PerspectiveCamera(
	75,
	size.width / size.height,
	0.1,
	100
);
//render
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
	alpha: true,
	canvas,
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(size.width, size.height);
const cameraController = new CameraController(camera, scene);

const resize = function () {
	size.width = window.innerWidth;
	size.height = window.innerHeight;
	camera.aspect = size.width / size.height;
	camera.updateProjectionMatrix();
	renderer.setSize(size.width, size.height);
};

scene.add(camera);

const light = new DirectionalLight(0xa0daf9, 3.5);
light.position.x = -20;
light.position.y = 20;
light.position.z = -20;
light.castShadow = true;
scene.add(light);

const light2 = new DirectionalLight(0xa0daf9, 0.4);
light2.position.x = 20;
light2.position.y = 20;
light2.position.z = 20;
light2.castShadow = true;
scene.add(light2);


const world = new World();
await world.init(scene);

let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousemove", function (evt) {
	if (evt.buttons === 1) {
		CameraController.currentZ -= evt.x - lastX;
		CameraController.currentY += evt.y - lastY;
	}
	lastX = evt.x;
	lastY = evt.y;
});
canvas.addEventListener("wheel", function (evt) {
	if (evt.deltaY > 0) {
		CameraController.len *= 1.1;
	} else if (evt.deltaY < 0) {
		CameraController.len /= 1.1;
	}
});


const coneLoader = new GLTFLoader();
const islandGLFT = await coneLoader.loadAsync("ImageToStl.com_dream_small_tropical_island.glb");
islandGLFT.scene.traverse((node) => {
	if (node.isMesh) {
		node.material.reflectivity = 1;
		node.material.refractionRatio = 0.98;
		node.castShadow = true;
		node.receiveShadow = true;
	}
});

const island = islandGLFT.scene.children[0];
island.scale.x = 0.1;
island.scale.y = 0.1;
island.scale.z = 0.1;
island.position.x = 50;
island.position.z = 25;
island.position.y = -1;

const island3 = island.clone();
island3.position.z = -40;

const island4 = island.clone();
island4.position.z = 90;

const islandGLFT2 = await coneLoader.loadAsync("ImageToStl.com_small_tropical_island.glb");
islandGLFT2.scene.traverse((node) => {
	if (node.isMesh) {
		node.material.reflectivity = 1;
		node.material.refractionRatio = 0.98;
		node.castShadow = true;
		node.receiveShadow = true;
	}
});

const island2 = islandGLFT2.scene.children[0];
island2.scale.x = 0.1;
island2.scale.y = 0.1;
island2.scale.z = 0.1;
island2.position.x = -60;
island2.position.z = 15;
island2.position.y = -1;

const island5 = island2.clone();
island5.position.z = -40;

const island6 = island2.clone();
island6.position.z = -10;

const island7 = island2.clone();
island7.position.z = 40;
scene.add(island);
scene.add(island2);
scene.add(island3);
scene.add(island4);
scene.add(island5);
scene.add(island6);
scene.add(island7);

//Animation
const tick = () => {
	//render
	resize();
	renderer.render(scene, camera);
	const angle =
		-Controller.attributes.windAngle +
		world.boatModel.yAngle +
		CameraController.currentZ;
	document.getElementById("true-wind").style.transform = `rotate(${angle}deg)`;

	world.run(scene);
	cameraController.update(world.boatModel);
	window.requestAnimationFrame(tick);
};

tick();
