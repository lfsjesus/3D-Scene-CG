import { CGFobject } from "../../lib/CGF.js";
import { MySphere } from "../Primitives/MySphere.js";
import { MyDisc} from "../Primitives/MyDisc.js";

export class MyReceptacle extends CGFobject {
    constructor(scene, slices, stacks, radius, material = undefined) {
        super(scene);        
        this.circle = new MyDisc(scene, slices, radius, material);
    }

    display() {
        this.circle.display();
    }
}