import {CGFobject, CGFappearance} from "../../lib/CGF.js";
import { MySphere } from "../Primitives/MySphere.js";

export class MyPanorama extends CGFobject {
    constructor(scene, texture, radius) {
        super(scene);
        this.texture = texture;
        this.radius = radius;
        this.initBuffers();
    }

    initBuffers() {
        this.sphere = new MySphere(this.scene, 16, 8, this.radius, true);
        this.panorama = new CGFappearance(this.scene);
        this.panorama.setEmission(1, 1, 1, 1);
        this.panorama.setTexture(this.texture);
        this.panorama.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.scene.camera.position[0],this.scene.camera.position[1],this.scene.camera.position[2]);
        this.panorama.apply();
        this.sphere.display();
        this.scene.popMatrix();
    }
}