import { MySphere } from "../Primitives/MySphere";

export class MyReceptacle extends MyReceptacle {
    constructor(scene, slices, stacks, radius) {
        super(scene);
        this.sphere = new MySphere(scene, slices, stacks, radius);
    }

    display() {
        this.sphere.display();
    }
}