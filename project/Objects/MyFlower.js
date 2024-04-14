import { CGFobject } from "../../lib/CGF.js";
import { MyStem } from "./MyStem.js";
import { MyPetal } from "./MyPetal.js";
import { MyReceptacle } from "./MyReceptacle.js"

export class MyFlower extends CGFobject {
    constructor(scene, numPetals, petalColor, recepColor, stemColor, leafColor, flowerRadius, receptacleRadius, stemRadius, stemHeight) {
        super(scene);
        this.stem = new MyStem(scene, 16, stemHeight, stemRadius); 
        this.receptacle = new MyReceptacle(scene, 16, 8, receptacleRadius);

        // array of petals with angle increment of 2*PI/numPetals
        this.petals = [];

        for (let i = 0; i < numPetals; i++) {
            
            let rotateAngle = 2 * Math.PI * i/numPetals;
            
            //curvatureAngle = Math.random() * Math.PI/2 - Math.PI/4;
            let curvatureAngle = -Math.PI/6;

            this.petals.push(new MyPetal(scene, rotateAngle, curvatureAngle));
        }
        
    }

    display() {
        // MyReceptacle
        this.scene.pushMatrix();
        this.receptacle.display();
        this.scene.popMatrix();


        // Add petals
        this.scene.pushMatrix();
        
        for (let petal of this.petals) {
            petal.display();
        }

        this.scene.popMatrix();



    }
}
