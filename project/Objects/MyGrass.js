import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyTriangle } from '../Primitives/MyTriangle.js';

export class MyGrass extends CGFobject {
    constructor(scene, width, height, numBlades) {
        super(scene);
        this.width = width;
        this.height = height;
        this.numBlades = numBlades;
        this.blades = [];
        this.initGrass();
        this.initMaterials();
    }

    initMaterials() {
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(0.0, 0.5, 0.0, 1.0);
        this.material.setDiffuse(0.0, 0.8, 0.0, 1.0);
        this.material.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.material.setShininess(10.0);
    }

    initGrass() {
        for (let i = 0; i < this.numBlades; i++) {
            // Randomize the position of each blade within the given width and height
            let x = Math.random() * this.width - this.width / 2;
            let z = Math.random() * this.height - this.height / 2;

            // Randomize the size of each blade
            let base = 0.05 + Math.random() * 0.1;
            let bladeHeight = 2.0 + Math.random() * 1.0; // Taller grass blades

            // Create a new blade and add it to the blades array
            let blade = new MyTriangle(this.scene, base, bladeHeight);
            this.blades.push({ blade, x, z, rotation: Math.random() * Math.PI * 2 });
        }
    }

    display() {
        this.scene.pushMatrix();
        this.material.apply();
        this.scene.translate(0, 0.01, 0); // Slightly above ground level to avoid z-fighting
        for (let { blade, x, z, rotation } of this.blades) {
            this.scene.pushMatrix();
            this.scene.translate(x, 0, z);
            this.scene.rotate(rotation, 0, 1, 0); // Random rotation for static display
            blade.display();
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }
}
