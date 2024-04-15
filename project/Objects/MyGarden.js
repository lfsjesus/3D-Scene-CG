import { MyFlower } from "./MyFlower.js";
import { CGFobject } from "../../lib/CGF.js";

export class MyGarden extends CGFobject {
    constructor(scene, rows, cols, flowerSpacing) {
        super(scene);
        this.flowers = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                // Parâmetros da flor, ajuste conforme a necessidade
                let numPetals = 6;
                let flowerRadius = 1;
                let receptacleRadius = 0.3;
                let stemRadius = 0.1;
                let numStems = 3;
                // Cores podem ser definidas aqui ou dentro da classe MyFlower
                let petalColor = [1.0, 0.0, 0.0, 1.0]; // Exemplo de cor vermelha
                let recepColor, stemColor, leafColor; // Defina como desejar

                let flower = new MyFlower(
                    this.scene, numPetals, flowerRadius,
                    receptacleRadius, stemRadius, numStems,
                    petalColor, recepColor, stemColor, leafColor
                );

                // Posição baseada no índice e no espaçamento entre as flores
                let xPosition = i * flowerSpacing;
                let yPosition = j * flowerSpacing;

                // Salva a flor e sua posição
                this.flowers.push({ flower: flower, position: [xPosition, yPosition] });
            }
        }
    }

    display() {
        for (let item of this.flowers) {
            let flower = item.flower;
            let position = item.position;

            this.scene.pushMatrix();
            this.scene.translate(position[0], 0, position[1]); // Ajuste a altura (eixo y) conforme necessário
            flower.display();
            this.scene.popMatrix();
        }
    }
}
