import { CGFobject } from "../../lib/CGF.js";
import { MyStem } from "./MyStem.js";
import { MyPetal } from "./MyPetal.js";
import { MyReceptacle } from "./MyReceptacle.js"

export class MyFlower extends CGFobject {
    constructor(scene, numPetals, flowerRadius, receptacleRadius, stemRadius, stemHeight,  petalColor, recepColor, stemColor, leafColor) {
        super(scene);
        this.receptacle = new MyReceptacle(scene, 16, 8, receptacleRadius);

        // array of petals with angle increment of 2*PI/numPetals
        this.petals = [];

        for (let i = 0; i < numPetals; i++) {
            
            let rotateAngle = 2 * Math.PI * i/numPetals;
            
            let curvatureAngle = Math.random() * Math.PI/2 - Math.PI/4;

            let heartAngle = Math.random() * Math.PI/4 - Math.PI/8;

            this.petals.push(new MyPetal(scene, flowerRadius, rotateAngle, curvatureAngle, heartAngle));
        }

        this.stems = [];

        for (let i = 0; i < stemHeight; i++) {
            this.stems.push(new MyStem(scene, 16, 1, stemRadius));
        }
        
    }

    display() {
        /*
        // MyReceptacle
        this.scene.pushMatrix();
        this.receptacle.display();
        this.scene.popMatrix();


        // Add petals
        this.scene.pushMatrix();
        
        for (let petal of this.petals) {

            this.scene.pushMatrix();
            //Rotate the petal by rotateAngle and heartAngle
            this.scene.rotate(petal.heartAngle, 1, 0, 0);
            this.scene.rotate(petal.rotateAngle, 0, 0, 1);
            petal.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
        */
        // Add stems
        this.scene.pushMatrix();

        for (let stem of this.stems) {
            stem.display();
            this.scene.translate(0, 0, 1);
        }

    }
}
