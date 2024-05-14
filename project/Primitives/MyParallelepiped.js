import { CGFobject } from '../../lib/CGF.js';

export class MyParallelepiped extends CGFobject {
    constructor(scene, width, height, depth, material = undefined) {
        super(scene);
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.material = material;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            // Front face
            -0.5, -0.5, 0.5,  // 0 Bottom Left
            0.5, -0.5, 0.5,   // 1 Bottom Right
            0.5, 0.5, 0.5,    // 2 Top Right
            -0.5, 0.5, 0.5,   // 3 Top Left

            // Back face
            -0.5, -0.5, -0.5, // 4
            0.5, -0.5, -0.5,  // 5
            0.5, 0.5, -0.5,   // 6
            -0.5, 0.5, -0.5,  // 7

        ];

        this.indices = [
            // Front face
            0, 1, 2,
            2, 3, 0,

            // Back face
            4, 6, 5,
            4, 7, 6,

            // Top face
            3, 2, 6,
            3, 6, 7,

            // Bottom face
            0, 5, 1,
            0, 4, 5,

            // Right face
            1, 5, 2,
            2, 5, 6,

            // Left face
            0, 3, 7,
            0, 7, 4,
           
        ];

        this.texCoords = [
            //Front face
            0, 1,
            1, 1,
            1, 0,
            0, 0,

            //Back face
            0, 1,
            1, 1,
            1, 0,
            0, 0,

            //Top face
            0,0,
            1,0,
            1,1,
            0,1,

            //Bottom face
            0,1,
            1,1,
            1,0,
            0,0,

            //Right face
            0,0,
            1,0,
            1,1,
            0,1,

            //Left face
            0,0,
            1,0,
            1,1,
            0,1,
            
        ];

        this.normals = [
            // Front face
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            // Back face
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Top face
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            // Bottom face
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            // Right face
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            // Left face
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
        ];




        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        this.scene.pushMatrix();
        if (this.material) {
            this.material.apply();
        }
        this.scene.scale(this.width, this.height, this.depth);
        super.display();
        this.scene.popMatrix();
    }
}
