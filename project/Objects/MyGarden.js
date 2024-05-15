import { MyFlower } from "./MyFlower.js";
import { CGFobject, CGFappearance, CGFtexture } from "../../lib/CGF.js";

export class MyGarden extends CGFobject {
    constructor(scene, rows, cols, flowerSpacing) {
        super(scene);
        this.scene = scene;
        this.rows = rows;
        this.cols = cols;
        this.flowers = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {

                //using javascript random fucntion, num petals should be a random number between 3 and 6
                let numPetals = Math.floor(Math.random() * 3) + 3;

                //using javascript random function, flower radius should be a random number between 1,5 and 3,5
                let flowerRadius = Math.random() * 2 + 1.5;
                
                //using javascript random function, receptacle radius should be a random number between 0.1 and 0.4
                let receptacleRadius = Math.random() * 0.3 + 0.1;
            
                //using javascript random function, stem radius should be a random number between 0.05 and 0.15
                let stemRadius = Math.random() * 0.1 + 0.05;

                //using javascript random function, number of stems should be a random number between 2 and 5
                let numStems = Math.floor(Math.random() * 4) + 2;
                

                let recepTextures = [
                    "images/recep.jpg",
                    "images/recep2.png",
                ]

                let petalTextures = [
                    "images/petal2.jpeg",
                    "images/petal3.jpg",
                    "images/petal4.jpg",
                    "images/petal5.jpeg",
                    "images/petal6.jpg",
                    "images/petal7.png",
                    "images/petal8.jpg",
                    "images/petal9.png",
                ]

                let stemTextures = [
                    "images/stem.jpeg",
                    "images/stem2.png",
                    "images/stem3.jpg",
                    "images/stem4.png",
                ]

                //pick a random texture from petalTextures
                let petalTexture = new CGFtexture(this.scene, petalTextures[Math.floor(Math.random() * petalTextures.length)]);
                let petalColor = new CGFappearance(this.scene);
                petalColor.setTexture(petalTexture);
                petalColor.setTextureWrap('REPEAT', 'REPEAT');
                petalColor.setShininess(10.0);

                //pick a random texture from recepTextures
                let recepTexture = new CGFtexture(this.scene, recepTextures[Math.floor(Math.random() * recepTextures.length)]);
                let recepColor = new CGFappearance(this.scene);
                recepColor.setTexture(recepTexture);
                recepColor.setTextureWrap('REPEAT', 'REPEAT');
                recepColor.setShininess(10.0);

                //pick a random texture from stemTextures
                let stemTexture = new CGFtexture(this.scene, stemTextures[Math.floor(Math.random() * stemTextures.length)]);
                let stemColor = new CGFappearance(this.scene);
                stemColor.setTexture(stemTexture);
                stemColor.setTextureWrap('REPEAT', 'REPEAT');
                stemColor.setShininess(10.0);



                let flower = new MyFlower(
                    this.scene, numPetals, flowerRadius,
                    receptacleRadius, stemRadius, numStems,
                    petalColor, recepColor, stemColor, stemColor
                );

                // Posição baseada no índice e no espaço entre as flores, 
                // also add a small random value to the position to make it look more natural
                // each flower should be placed in a random position between 0 and flowerSpacing

                let xPosition = i * flowerSpacing + Math.random() * flowerSpacing / 1.5;
                let yPosition = j * flowerSpacing + Math.random() * flowerSpacing / 1.5;

               
                this.flowers.push({ flower: flower, position: [xPosition, yPosition] });

            }
        }
    }

    display() {
        for (let item of this.flowers) {
            let flower = item.flower;
            let position = item.position;

            this.scene.pushMatrix();
            this.scene.translate(position[0], 0, position[1]); //A altura é o eixo y neste caso
            flower.display();
            this.scene.popMatrix();
        }
    }
}
