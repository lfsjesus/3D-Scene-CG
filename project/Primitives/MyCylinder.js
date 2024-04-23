import { CGFobject } from '../../lib/CGF.js';

export class MyCylinder extends CGFobject {
    constructor(scene, slices, height, radius, material) {
        super(scene);
        this.slices = slices;
        this.height = height;
        this.radius = radius;
        this.material = material;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const angleIncrement = (2 * Math.PI) / this.slices;

        for (let slice = 0; slice < this.slices; slice++) {
            const angle = slice * angleIncrement;
            const x = this.radius * Math.cos(angle);
            const z = this.radius * Math.sin(angle);

            // Add each vertex twice to create two ends of the side surface of the cylinder
            // Bottom vertex
            this.vertices.push(x, 0, z);
            // Top vertex
            this.vertices.push(x, this.height, z);

            // Normal is the same for top and bottom vertices
            const normalX = Math.cos(angle);
            const normalZ = Math.sin(angle);
            // Bottom normal
            this.normals.push(normalX, 0, normalZ);
            // Top normal
            this.normals.push(normalX, 0, normalZ);

            // Texture coordinates
            this.texCoords.push(slice / this.slices, 0);
            this.texCoords.push(slice / this.slices, 1);

            
        }

        // Define two triangles for each surface strip of the cylinder
        for (let slice = 0; slice < this.slices; slice++) {
            const nextSlice = (slice + 1) % this.slices;

            const bottom1 = 2 * slice;
            const top1 = bottom1 + 1;
            const bottom2 = 2 * nextSlice;
            const top2 = bottom2 + 1;

            // First triangle (bottom1 -> top1 -> top2)
            this.indices.push(bottom1, top1, top2);
            // Second triangle (bottom1 -> top2 -> bottom2)
            this.indices.push(bottom1, top2, bottom2);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        if (this.material !== undefined)
            this.material.apply();
        super.display();
    }
}
