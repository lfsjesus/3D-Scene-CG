// MyTriangle.js
import { CGFobject } from '../../lib/CGF.js';

export class MyTriangle extends CGFobject {
    constructor(scene, base, height) {
        super(scene);
        this.base = base;
        this.height = height;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            0, this.height, 0,  // Top vertex
            -this.base / 2, 0, 0,  // Left vertex
            this.base / 2, 0, 0   // Right vertex
        ];

        this.indices = [
            0, 1, 2,  // Drawing the triangle
            2, 1, 0   // Drawing the triangle in clockwise order
        ];

        this.normals = [
            0, 0, 1, 
            0, 0, 1,
            0, 0, 1,
            0, 0, -1,  
            0, 0, -1,
            0, 0, -1
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
