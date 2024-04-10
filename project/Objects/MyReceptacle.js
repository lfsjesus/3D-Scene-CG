import { CGFobject } from "../../lib/CGF.js";
import { MySphere } from "../Primitives/MySphere.js";

export class MyReceptacle extends CGFobject {
    constructor(scene, slices, stacks, radius) {
        super(scene);
        this.sphere = new MySphere(scene, slices, stacks, radius);
    }

    display() {
        this.sphere.display();
    }
}