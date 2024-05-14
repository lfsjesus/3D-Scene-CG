import { MyFlower } from "./MyFlower.js";
import { CGFobject } from "../../lib/CGF.js";

export class MyGarden extends CGFobject {
    constructor(scene, rows, cols, flowerSpacing) {
        super(scene);
        this.scene = scene;
        this.rows = rows;
        this.cols = cols;
        this.flowers = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                // Parâmetros da flor, temos de por random

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
                


                //create an array of colors
                let colors = [
                    //white
                    [1.0, 1.0, 1.0, 1.0],
                    //yellow
                    [1.0, 1.0, 0.0, 1.0],
                    //red
                    [1.0, 0.0, 0.0, 1.0],
                    //blue
                    [0.0, 0.0, 1.0, 1.0],
                    //purple
                    [1.0, 0.0, 1.0, 1.0],
                    //orange
                    [1.0, 0.5, 0.0, 1.0],
                    //pink
                    [1.0, 0.0, 0.5, 1.0],
                    
                ]

                //pick a random color for petalColor
                let petalColor = colors[Math.floor(Math.random() * colors.length)];

                //pick a random color for recepColor but only from white or yellow (first two colors)
                let recepColor = colors[Math.floor(Math.random() * 2)];

                //stem color should be green
                let stemColor = [0.0, 1.0, 0.0, 1.0];

                //leaf color should also be green
                let leafColor = [0.0, 1.0, 0.0, 1.0];
               

                let flower = new MyFlower(
                    this.scene, numPetals, flowerRadius,
                    receptacleRadius, stemRadius, numStems,
                    petalColor, recepColor, stemColor, leafColor
                );

                // Posição baseada no índice e no espaço entre as flores, 
                // also add a small random value to the position to make it look more natural
                // each flower should be placed in a random position between 0 and flowerSpacing

                let xPosition = i * flowerSpacing + Math.random() * flowerSpacing;
                let yPosition = j * flowerSpacing + Math.random() * flowerSpacing;

               
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
