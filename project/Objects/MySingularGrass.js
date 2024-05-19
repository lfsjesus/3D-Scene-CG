import { CGFobject } from '../../lib/CGF.js';
import { MyTriangle } from '../Primitives/MyTriangle.js';

export class MySingularGrass extends CGFobject {
    constructor(scene, base, height, subdivisions) {
        super(scene);
        this.base = base;
        this.height = height;
        this.subdivisions = subdivisions;
        this.triangles = [];
        this.initSubdivisions();
    }

    initSubdivisions() {
        let subHeight = this.height / this.subdivisions;
        let subBase = this.base / this.subdivisions;

        for (let i = 0; i < this.subdivisions; i++) {
            let b = this.base - (i * subBase * 0.3);
            this.triangles.push(new MyTriangle(this.scene, b, subHeight, true));
        }
    }

    display() {
        for (let i = 0; i < this.triangles.length; i++) {
            let triangle = this.triangles[i];
            let yOffset = i * this.height / this.subdivisions;

            // Display the normal triangle
            this.scene.pushMatrix();
            this.scene.translate(0, yOffset, 0);
            triangle.display();
            this.scene.popMatrix();

            // Display the upside-down triangle, connected to the first
            this.scene.pushMatrix();
            this.scene.translate(triangle.base, 0, 0);
            this.scene.translate(0, yOffset + this.height / this.subdivisions, 0);
            this.scene.rotate(Math.PI, 0, 0, 1); // Rotate 180 degrees around the Z-axis
            triangle.display();
            this.scene.popMatrix();
        }
    }
}
