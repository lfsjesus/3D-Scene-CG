import { CGFobject } from '../../lib/CGF.js';
import { MyRock } from './MyRock.js';
import { CGFtexture } from '../../lib/CGF.js';
import { CGFappearance } from '../../lib/CGF.js';

export class MyRockSet extends CGFobject {
    constructor(scene, rockCount) {
        super(scene);
        this.rockCount = rockCount;
        this.spacing = 3;

        this.rocks = [];

        //create a new material which has a texture

        let texture1 = new CGFtexture(this.scene, 'images/rock.jpg');
        let texture2 = new CGFtexture(this.scene, 'images/rock2.jpg');
        let texture3 = new CGFtexture(this.scene, 'images/rock3.jpg');

        let textures = [texture1, texture2, texture3];



        for (let i = 0; i < this.rockCount; i++) {
            for (let j = 0; j < this.rockCount; j++) {

                // Randomize rock properties

                //radius should be a random number between 1 and 1.5
                let radius = Math.random() * 0.5 + 1;

                //displacementFactor should be a random number between 0.1 and 0.4
                let displacementFactor = Math.random() * 0.3 + 0.1;



                // Random scaling factors for non-uniform scaling
                // scaleX will give [1.1, 1.8[
                let scaleX = Math.random() * 0.7 + 1.1;



                //the scaleY should be [0.5, 0.9[
                let scaleY = Math.random() * 0.4 + 0.5;


                //the scaleZ [0.5, 1[
                let scaleZ = Math.random() * 0.5 + 0.5;


                // Random orientation
                //rotateAngle should be [-PI/4, PI/4[
                let rotateAngle = Math.random() * Math.PI / 2 - Math.PI / 4;


                let rockAppearance = new CGFappearance(this.scene);
                //set a random texture from textures array
                rockAppearance.setTexture(textures[Math.floor(Math.random() * textures.length)]);
                //i dont want texture wrap to repeat
                rockAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

                // Create and store the new rock
                let rock = new MyRock(this.scene, 16, 16, radius, displacementFactor, rotateAngle, [scaleX, scaleY, scaleZ], 0, rockAppearance);


                // Posição baseada no índice e no espaço entre as flores
                let xPosition = i * this.spacing;
                let yPosition = j * this.spacing;


                this.rocks.push({ rock: rock, position: [xPosition, yPosition] });
            }
        }
    }

    display() {
        for (let item of this.rocks) {
            this.scene.pushMatrix();
            this.scene.translate(item.position[0], 0, item.position[1]);

            // Random orientation
            this.scene.rotate(item.rock.rotateAngle, 0, 1, 0);
            // Random scaling factors for non-uniform scaling
            this.scene.scale(item.rock.scales[0], item.rock.scales[1], item.rock.scales[2]);

            item.rock.display();
            this.scene.popMatrix();
        }
    }

}