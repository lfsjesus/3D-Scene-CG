import { CGFobject } from "../../lib/CGF";
import { MyStem } from "./MyStem";
import { MyPetal } from "./MyPetal";

export class MyFlower extends CGFobject {
    constructor(scene, slices, stacks, radius) {
        super(scene);
        this.stem = new MyStem(scene, slices, stacks, radius);
        this.petal = new MyPetal(scene);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.petal.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.stem.display();
        this.scene.popMatrix();
    }
}
