import { CGFobject } from '../../lib/CGF.js';

export class MySingularGrass extends CGFobject {
    constructor(scene, base, height, subdivisions, material = undefined) {
        super(scene);
        this.base = base;
        this.height = height;
        this.subdivisions = subdivisions;
        this.material = material;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let top = [0, this.height, 0];
        let bottomLeft = [-this.base / 2, 0, 0];
        let bottomRight = [this.base / 2, 0, 0];

        // Function to add a triangular section for front face
        const addTriangle = (v1, v2, v3) => {
            let index = this.vertices.length / 3;
            this.vertices.push(...v1, ...v2, ...v3);
            this.indices.push(index, index + 1, index + 2);
            this.normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
            this.texCoords.push(0, 0, 1, 0, 0.5, 1);
        };

        // Function to add a triangular section for back face
        const addTriangleBack = (v1, v2, v3) => {
            let index = this.vertices.length / 3;
            this.vertices.push(...v1, ...v2, ...v3);
            this.indices.push(index, index + 1, index + 2);
            this.normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
            this.texCoords.push(0, 0, 1, 0, 0.5, 1);
        };

        // Add the first large triangle
        addTriangle(top, bottomLeft, bottomRight);
        addTriangleBack(top, bottomRight, bottomLeft);

        // Subdivisions
        for (let i = 1; i <= this.subdivisions; i++) {
            let ratio = i / this.subdivisions;

            let newLeft = [-this.base / 2 * (1 - ratio), this.height * ratio, 0];
            let newRight = [this.base / 2 * (1 - ratio), this.height * ratio, 0];

            addTriangle(newLeft, bottomLeft, bottomRight);
            addTriangle(newLeft, bottomRight, newRight);
            addTriangleBack(newLeft, bottomRight, bottomLeft);
            addTriangleBack(newRight, bottomRight, newLeft);
            
            bottomLeft = newLeft;
            bottomRight = newRight;
        }

        // Add the final isosceles triangle at the top
        addTriangle(top, bottomLeft, bottomRight);
        addTriangleBack(top, bottomRight, bottomLeft);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display(){
        if (this.material) {
            this.material.apply();
        }
        super.display();
    }
}
