import { CGFobject } from '../../lib/CGF.js';

export class MyDisc extends CGFobject {
    constructor(scene, slices, radius, material) {
        super(scene);
        this.slices = slices;
        this.radius = radius;
        this.material = material;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        // Center point
        this.vertices.push(0, 0, 0); // center point
        this.normals.push(0, 0, 1); // normal pointing out of the screen

        const angleIncrement = (2 * Math.PI) / this.slices;
        for (let i = 0; i <= this.slices; i++) {
            const angle = i * angleIncrement;
            const x = Math.cos(angle) * this.radius;
            const y = Math.sin(angle) * this.radius;

            // Edge points
            this.vertices.push(x, y, 0); // edge point
            
            this.normals.push(0, 0, 1); // normal pointing out of the screen
            this.texCoords.push(0.5 + 0.5 * Math.cos(angle), 0.5 - 0.5 * Math.sin(angle));
        }

        // Triangle fan indices
        for (let i = 1; i <= this.slices; i++) {
            this.indices.push(0, i, i + 1);
            this.indices.push(i + 1, i, 0);
        }
        // Closing the disc
        this.indices.push(0, this.slices, 1);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        this.scene.pushMatrix();
        if (this.material !== undefined) {
            this.material.apply();
        }
        super.display();
        this.scene.popMatrix();
    }
}
