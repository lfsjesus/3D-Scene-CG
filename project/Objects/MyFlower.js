import { CGFobject } from "../../lib/CGF.js";
import { CGFappearance } from "../../lib/CGF.js";
import { MyStem } from "./MyStem.js";
import { MyPetal } from "./MyPetal.js";
import { MyReceptacle } from "./MyReceptacle.js"

export class MyFlower extends CGFobject {
    constructor(scene, numPetals, flowerRadius, receptacleRadius, stemRadius, numStems, petalColor, recepColor, stemColor, leafColor) {
        super(scene);
        this.flowerRadius = flowerRadius;
        this.receptacleRadius = receptacleRadius;
        this.stemRadius = stemRadius;
        this.numPetals = numPetals;
        this.numStems = numStems;
        this.petalColor = petalColor;
        this.recepColor = recepColor;
        this.stemColor = stemColor;
        this.leafColor = leafColor;
        this.receptacle = new MyReceptacle(scene, 16, 8, receptacleRadius);

        // array of petals with angle increment of 2*PI/numPetals
        this.petals = [];

        for (let i = 0; i < numPetals; i++) {

            let rotateAngle = 2 * Math.PI * i / numPetals;

            let curvatureAngle = Math.random() * Math.PI / 2 - Math.PI / 4;

            let heartAngle = Math.random() * Math.PI / 4 - Math.PI / 8;

            this.petals.push(new MyPetal(scene, flowerRadius, rotateAngle, curvatureAngle, heartAngle));
        }

        this.stems = [];

        for (let i = 0; i < numStems; i++) {

            //the height of each stem should be random between 0.5 and 2, inclusive
            let height = Math.random() * 1 + 0.5;


            //the stems should have a random curvature angle between -PI/8 and PI/8
            let curvatureAngle = Math.random() * Math.PI / 4 - Math.PI / 8;

            this.stems.push(new MyStem(scene, 16, height, stemRadius, curvatureAngle));

            //between each pair of stems, there should be added a new stem with a petal new MyStem(scene, 16, 0.1, radius, curvatureAngle, true)
            if (i < numStems - 1) {
                let stemSide = Math.random() < 0.5 ? -1 : 1;
                this.stems.push(new MyStem(scene, 16, 0.05, stemRadius, curvatureAngle, true, stemSide));
            }


        }
        console.log(this.stems);


        //MATERIALS FOR THE FLOWER

        this.stemMat = new CGFappearance(this.scene);
        this.stemMat.setAmbient(stemColor[0], stemColor[1], stemColor[2], stemColor[3]);
        this.stemMat.setDiffuse(stemColor[0], stemColor[1], stemColor[2], stemColor[3]);
        this.stemMat.setSpecular(stemColor[0], stemColor[1], stemColor[2], stemColor[3]);
        this.stemMat.setShininess(10.0);

        this.recepMat = new CGFappearance(this.scene);
        this.recepMat.setAmbient(recepColor[0], recepColor[1], recepColor[2], recepColor[3]);
        this.recepMat.setDiffuse(recepColor[0], recepColor[1], recepColor[2], recepColor[3]);
        this.recepMat.setSpecular(recepColor[0], recepColor[1], recepColor[2], recepColor[3]);
        this.recepMat.setShininess(10.0);

        this.petalMat = new CGFappearance(this.scene);
        this.petalMat.setAmbient(petalColor[0], petalColor[1], petalColor[2], petalColor[3]);
        this.petalMat.setDiffuse(petalColor[0], petalColor[1], petalColor[2], petalColor[3]);
        this.petalMat.setSpecular(petalColor[0], petalColor[1], petalColor[2], petalColor[3]);
        this.petalMat.setShininess(10.0);


    }

    display() {
        let stemHeight = 0;
        let offsetZ = 0;
        let lastCurvature = 0;

        this.scene.pushMatrix();

        this.stemMat.apply();

        for (let i = 0; i < this.stems.length; i++) {
            let stem = this.stems[i];


            this.scene.pushMatrix();

            //translate the stem to the correct height and offset
            this.scene.translate(0, stemHeight, offsetZ);


            this.scene.rotate(stem.curvatureAngle, 1, 0, 0);

            if (stem.hasPetal) {
                //add a petal to this stem
                let petal = new MyPetal(this.scene, 0.5, 0, 1, 0);
                this.scene.pushMatrix();

                //get a random number which is either -1 or 1

                this.scene.translate(0.5 * stem.stemSide, -20 * stem.height, offsetZ / 20);

            
                petal.display();
                this.scene.popMatrix();
            }

            // Draw the stem
            stem.display();

            this.scene.popMatrix();

            // Update stemHeight with the height of this stem to position the next one correctly
            stemHeight += stem.height * Math.cos(stem.curvatureAngle);
            offsetZ += stem.height * Math.sin(stem.curvatureAngle);
            lastCurvature = stem.curvatureAngle;
        }

        this.scene.popMatrix();

        // Now, translate everything up by the total height of the stems
        this.scene.pushMatrix();
        this.scene.translate(0, stemHeight, offsetZ);
        this.scene.rotate(lastCurvature + 2, 1, 0, 0);

        // MyReceptacle
        this.recepMat.apply();
        this.receptacle.display();




        // Add petals around the top of the stem
        this.petalMat.apply();
        for (let petal of this.petals) {
            this.scene.pushMatrix();
            // Rotate the petal into position
            this.scene.rotate(petal.rotateAngle, 0, 0, 1);
            this.scene.rotate(petal.heartAngle, 1, 0, 0);
            petal.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

}
