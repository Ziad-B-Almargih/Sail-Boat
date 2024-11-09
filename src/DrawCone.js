import {Maths} from "./Math";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Controller} from "./Controller";
import {SeaModel} from "./SeaModel";

export class DrawCone {

	coneMesh;
	async init(scene,coneModel, posX,posZ) {

		const coneLoader = new GLTFLoader();
		const coneGltf = await coneLoader.loadAsync("cone.glb");
		coneGltf.scene.traverse((node) => {
			if (node.isMesh) {
				node.material.reflectivity = 1;
				node.material.refractionRatio = 0.98;
				node.castShadow = true;
				node.receiveShadow = true;
			}
		});

		this.coneMesh = coneGltf.scene.children[0];
		this.coneMesh.position.x = posX;
		this.coneMesh.position.z = posZ;
		this.coneMesh.scale.x = 0.0005;
		this.coneMesh.scale.y = 0.0005;
		this.coneMesh.scale.z = 0.0005;
		this.coneMesh.rotation.y = Math.PI;
		scene.add(this.coneMesh);
	}

	async run(model, x, z) {
		 this.coneMesh.rotation.x = Maths.toRad(model.xAngle - 90);
		 this.coneMesh.position.x = x;
		 this.coneMesh.position.z = z;
		const clk = Controller.clock.getElapsedTime();
		this.coneMesh.position.y = SeaModel.calcY(z, x, clk) + 1;
	}
}
