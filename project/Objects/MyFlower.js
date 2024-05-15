import { CGFobject } from "../../lib/CGF.js";
import { CGFappearance } from "../../lib/CGF.js";
import { CGFtexture } from "../../lib/CGF.js";
import { MyStem } from "./MyStem.js";
import { MyPetal } from "./MyPetal.js";
import { MyReceptacle } from "./MyReceptacle.js"
import { MyPollen } from "./MyPollen.js";

export class MyFlower extends CGFobject {
    constructor(scene, numPetals, flowerRadius, receptacleRadius, stemRadius, numStems, petalColor, recepColor, stemColor, leafColor) {
        super(scene);
        this.flowerRadius = flowerRadius;
        this.receptacleRadius = receptacleRadius;
        this.stemRadius = stemRadius;
        this.numPetals = numPetals;
        this.numStems = numStems;
        this.petalMat = petalColor;
        this.recepMat = recepColor;
        this.stemMat = stemColor;
        this.leafColor = leafColor;



        this.receptacle = new MyReceptacle(scene, 16, 8, receptacleRadius, this.recepMat);

        //there should be a 70% chance of having a pollen in the flower
        if (Math.random() < 0.7) this.pollen = new MyPollen(scene, 16, 8, stemRadius * 2);
        else this.pollen = null;
        
        
        // array of petals with angle increment of 2*PI/numPetals
        this.petals = [];

        for (let i = 0; i < numPetals; i++) {

            let rotateAngle = 2 * Math.PI * i / numPetals;

            //curvatureAngle should be [PI/8, PI/4]
            let curvatureAngle = Math.random() * Math.PI / 4 + Math.PI / 8;
        
            //heatAngle should be [- PI/4, - PI/6]
            let heartAngle = Math.random() * Math.PI / 6 - Math.PI / 4;

            this.petals.push(new MyPetal(scene, flowerRadius, rotateAngle, curvatureAngle, heartAngle));
        }

        for (let i = 0; i < numPetals; i++) {

            let rotateAngle = 2 * Math.PI * i / numPetals;

            rotateAngle += Math.PI / numPetals;

            //curvatureAngle should be [PI/8, PI/4]
            let curvatureAngle = Math.random() * Math.PI / 4 + Math.PI / 8;
        
            //heatAngle should be [-PI/12, -PI /16]
            let heartAngle = Math.random() * Math.PI / 24 - Math.PI / 12;

            this.petals.push(new MyPetal(scene, flowerRadius, rotateAngle, curvatureAngle, heartAngle));
        }

        

        this.stems = [];

        this.pollenHeight = 0;
        this.pollenOffsetZ = 0;
        this.lastCurvature = 0;

        for (let i = 0; i < numStems; i++) {

            //the height of each stem should be random between 0.5 and 2, inclusive
            let height = Math.random() * 1 + 0.5;


            //the stems should have a random curvature angle between -PI/8 and PI/8
            let curvatureAngle = Math.random() * Math.PI / 4 - Math.PI / 8;

            this.stems.push(new MyStem(scene, 16, height, stemRadius, curvatureAngle));

            //between each pair of stems, there should be added a new stem with a petal
            if (i < numStems - 1) {
                let stemSide = Math.random() < 0.5 ? -1 : 1;
                this.stems.push(new MyStem(scene, 16, 0.05, stemRadius, curvatureAngle, true, stemSide));
            }

            this.pollenHeight += height * Math.cos(curvatureAngle);
            this.pollenOffsetZ += height * Math.sin(curvatureAngle);
            this.lastCurvature = curvatureAngle;

        }

        this.pollenHeight += 1.5

    }



    display() {
        let stemHeight = 0;
        let offsetZ = 0;


        this.scene.pushMatrix();

        this.stemMat.apply();

        for (let i = 0; i < this.stems.length; i++) {
            let stem = this.stems[i];


            this.scene.pushMatrix();

            //translate the stem to the correct height and offset
            this.scene.translate(0, stemHeight, offsetZ);

            //rotate the stem by the curvature angle
            this.scene.rotate(stem.curvatureAngle, 1, 0, 0);


            if (stem.hasPetal) {
                //add a petal to this stem
                let petal = new MyPetal(this.scene, 0.5, 0, 1, 0);
                this.scene.pushMatrix();

                
                //Stemside is used to randomly choose the side of the stem where the petal will be placed
                //this.scene.translate(stem.stemSide, stem.height, offsetZ);
                this.scene.translate(0.6* stem.stemSide, -4* stem.height, offsetZ / 20);


            
                petal.display();
                this.scene.popMatrix();
            }

            

            // Draw the stem
            stem.display();
            this.scene.popMatrix();

            // Update stemHeight with the height of this stem to position the next one correctly
            // Update offsetZ with the height of this stem to position the next one correctly

            stemHeight += stem.height * Math.cos(stem.curvatureAngle);
            offsetZ += stem.height * Math.sin(stem.curvatureAngle);
        }

        this.scene.popMatrix();

        // Now, translate everything up by the total height of the stems
        //this.scene.translate(0, stemHeight, offsetZ);
        this.scene.translate(0, stemHeight, offsetZ);

        // MyPollen

        if(this.pollen){
            this.scene.pushMatrix();
            this.scene.translate(0, 0.15, 0);
            this.pollen.display();
            this.scene.popMatrix();
        }

        this.scene.rotate(this.lastCurvature + Math.PI/2, 1, 0, 0);


        
        // MyReceptacle
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.translate(0, 0, 0.15);
        this.receptacle.display();
        this.scene.popMatrix();

        


        this.scene.pushMatrix();
        // Add petals around the top of the stem
        this.petalMat.apply();
        for (let petal of this.petals) {
            this.scene.pushMatrix();
            // Rotate the petal into position;
            this.scene.rotate(petal.rotateAngle, 0, 0, 1);
            this.scene.rotate(petal.heartAngle, 1, 0, 0);
            petal.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

}
