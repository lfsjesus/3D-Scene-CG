import { CGFobject } from '../../lib/CGF.js';

export class MySingularGrass extends CGFobject {
    constructor(scene, base, height, subdivisions) {
        super(scene);
        this.base = base;
        this.height = height;
        this.subdivisions = subdivisions;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Function to add a triangular section
        const addTriangle = (v1, v2, v3) => {
            let index = this.vertices.length / 3;
            this.vertices.push(...v1, ...v2, ...v3);
            this.indices.push(index, index + 1, index + 2);
            this.normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
            this.texCoords.push(0, 0, 1, 0, 0.5, 1);
        };

        // Create a large triangle with smaller triangular sections
        let top = [0, this.height, 0];
        let left = [-this.base / 2, 0, 0];
        let right = [this.base / 2, 0, 0];

        addTriangle(top, left, right);

        // Add subdivisions within the main triangle
        const createSubdivisions = (v1, v2, v3, level) => {
            if (level <= 0) return;
            let mid1 = [(v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2, 0];
            let mid2 = [(v2[0] + v3[0]) / 2, (v2[1] + v3[1]) / 2, 0];
            let mid3 = [(v3[0] + v1[0]) / 2, (v3[1] + v1[1]) / 2, 0];

            addTriangle(mid1, v2, mid2);
            addTriangle(mid1, mid2, mid3);
            addTriangle(mid3, v3, mid2);

            createSubdivisions(v1, mid1, mid3, level - 1);
            createSubdivisions(mid1, v2, mid2, level - 1);
            createSubdivisions(mid3, mid2, v3, level - 1);
        };

        createSubdivisions(top, left, right, this.subdivisions);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
