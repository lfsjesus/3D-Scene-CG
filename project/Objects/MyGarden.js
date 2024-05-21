import { MyFlower } from "./MyFlower.js";
import { CGFobject, CGFappearance, CGFtexture } from "../../lib/CGF.js";

export class MyGarden extends CGFobject {
    constructor(scene, rows, cols, flowerSpacing) {
        super(scene);
        this.scene = scene;
        this.rows = rows;
        this.cols = cols;
        this.flowerSpacing = flowerSpacing;
        this.flowers = [];

        this.initFlowers();
    }

    initFlowers() {
        this.recepTextures = [
            "images/recep.jpg",
            "images/recep2.png",
        ];

        this.petalTextures = [
            "images/petal2.jpeg",
            "images/petal3.jpg",
            "images/petal4.jpg",
            "images/petal5.jpeg",
            "images/petal6.jpg",
            "images/petal7.png",
            "images/petal8.jpg",
            "images/petal9.png",
        ];

        this.stemTextures = [
            "images/stem.jpeg",
            "images/stem2.png",
            "images/stem3.jpg",
            "images/stem4.png",
        ];

        this.pollenMaterial = new CGFappearance(this.scene);
        this.pollenTexture = new CGFtexture(this.scene, 'images/pollen.jpeg');
        this.pollenMaterial.setTexture(this.pollenTexture);
        this.pollenMaterial.setTextureWrap('REPEAT', 'REPEAT');
        this.pollenMaterial.setDiffuse(0.8, 0.5, 0.1, 1);
        this.pollenMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.pollenMaterial.setShininess(10);

        // Create arrays to store the CGFtexture instances
        this.recepTexturesObj = this.recepTextures.map(path => new CGFtexture(this.scene, path));
        this.petalTexturesObj = this.petalTextures.map(path => new CGFtexture(this.scene, path));
        this.stemTexturesObj = this.stemTextures.map(path => new CGFtexture(this.scene, path));

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.createFlower(i, j, this.recepTexturesObj, this.petalTexturesObj, this.stemTexturesObj, this.pollenMaterial);
            }
        }
    }

    createFlower(i, j, recepTexturesObj, petalTexturesObj, stemTexturesObj, pollenMaterial) {
        let numPetals = Math.floor(Math.random() * 3) + 3;
        let flowerRadius = Math.random() * 2 + 1.5;
        let receptacleRadius = Math.random() * 0.3 + 0.1;
        let stemRadius = Math.random() * 0.1 + 0.05;
        let numStems = Math.floor(Math.random() * 4) + 2;

        let petalColor = new CGFappearance(this.scene);
        petalColor.setTexture(petalTexturesObj[Math.floor(Math.random() * petalTexturesObj.length)]);
        petalColor.setTextureWrap('REPEAT', 'REPEAT');
        petalColor.setShininess(10.0);

        let recepColor = new CGFappearance(this.scene);
        recepColor.setTexture(recepTexturesObj[Math.floor(Math.random() * recepTexturesObj.length)]);
        recepColor.setTextureWrap('REPEAT', 'REPEAT');
        recepColor.setShininess(10.0);

        let stemColor = new CGFappearance(this.scene);
        stemColor.setTexture(stemTexturesObj[Math.floor(Math.random() * stemTexturesObj.length)]);
        stemColor.setTextureWrap('REPEAT', 'REPEAT');
        stemColor.setShininess(10.0);

        let flower = new MyFlower(
            this.scene, numPetals, flowerRadius,
            receptacleRadius, stemRadius, numStems,
            petalColor, recepColor, stemColor, stemColor, pollenMaterial
        );

        let xPosition = i * this.flowerSpacing + Math.random() * this.flowerSpacing / 1.5;
        let yPosition = j * this.flowerSpacing + Math.random() * this.flowerSpacing / 1.5;

        this.flowers.push({ flower: flower, position: [xPosition, yPosition], row: i, col: j });
    }

    updateDimensions(newRows, newCols, newFlowerSpacing) {
        // Update flower spacing
        if (newFlowerSpacing !== this.flowerSpacing) {
            this.flowerSpacing = newFlowerSpacing;
            // Update positions of all flowers based on the new flower spacing
            for (let item of this.flowers) {
                let i = item.row;
                let j = item.col;
                item.position[0] = i * this.flowerSpacing + Math.random() * this.flowerSpacing / 1.5;
                item.position[1] = j * this.flowerSpacing + Math.random() * this.flowerSpacing / 1.5;
            }
        }

        // Filter out flowers that are within the new dimensions
        this.flowers = this.flowers.filter(flower => flower.row < newRows && flower.col < newCols);

        // Update the dimensions
        this.rows = newRows;
        this.cols = newCols;

        // Add new flowers to fill the new rows and columns
        for (let i = 0; i < newRows; i++) {
            for (let j = 0; j < newCols; j++) {
                if (!this.flowers.find(flower => flower.row === i && flower.col === j)) {
                    this.createFlower(i, j, this.recepTexturesObj, this.petalTexturesObj, this.stemTexturesObj, this.pollenMaterial);
                }
            }
        }
    }


    display() {
        for (let item of this.flowers) {
            let flower = item.flower;
            let position = item.position;

            this.scene.pushMatrix();
            this.scene.translate(position[0], 0, position[1]); // The height is the y-axis in this case
            flower.display();
            this.scene.popMatrix();
        }
    }
}
