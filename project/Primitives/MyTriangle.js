import { CGFobject } from '../../lib/CGF.js';

export class MyTriangle extends CGFobject {
    constructor(scene, base, height, isRightTriangle) {
        super(scene);
        this.base = base;
        this.height = height;
        this.isRightTriangle = isRightTriangle;
        this.initBuffers();
    }

    initBuffers() {
        if (this.isRightTriangle) {
            // Vertices for a right triangle
            this.vertices = [
                0, 0, 0,  // Bottom-left vertex
                this.base, 0, 0,  // Bottom-right vertex
                0, this.height, 0   // Top vertex
            ];
        } else {
            // Vertices for an equilateral triangle
            this.vertices = [
                0, this.height, 0,  // Top vertex
                -this.base / 2, 0, 0,  // Bottom-left vertex
                this.base / 2, 0, 0   // Bottom-right vertex
            ];
        }

        this.indices = [
            0, 1, 2,  // Drawing the triangle
            2, 1, 0   // Drawing the triangle in clockwise order
        ];

        this.normals = [
            0, 0, 1, 
            0, 0, 1,
            0, 0, 1
        ];

        this.texCoords = [
            0.5, 1,
            0, 0,
            1, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
