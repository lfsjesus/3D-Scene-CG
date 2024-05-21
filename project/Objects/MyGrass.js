// MyGrass.js
import { CGFobject, CGFappearance , CGFtexture} from '../../lib/CGF.js';
import { MySingularGrass } from './MySingularGrass.js';


export class MyGrass extends CGFobject {
    constructor(scene, width, height, numBlades, subdivisions) {
        super(scene);
        this.width = width;
        this.height = height;
        this.numBlades = numBlades;
        this.subdivisions = subdivisions;
        this.blades = [];
        this.initGrass();
        this.initMaterials();
    }

    initMaterials() {
        this.material = new CGFappearance(this.scene);
        this.grassTexture = new CGFtexture(this.scene, 'images/singleGrass.png');
        this.material.setTexture(this.grassTexture);
        this.material.setTextureWrap('REPEAT', 'REPEAT');
        this.material.setShininess(10.0);
    }

    initGrass() {
        for (let i = 0; i < this.numBlades; i++) {
            // Randomize the position of each blade within the given width and height
            let x = Math.random() * this.width - this.width / 2;
            let z = Math.random() * this.height - this.height / 2;

            // Randomize the size of each blade
            let base = 0.2 + Math.random() * 0.1;
            let bladeHeight = 2.0 + Math.random() * 5.0; // Taller grass blades

            // Create a new subdivided blade and add it to the blades array
            let blade = new MySingularGrass(this.scene, base, bladeHeight, this.subdivisions, this.material);
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
