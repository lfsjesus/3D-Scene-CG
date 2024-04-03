import { CGFobject } from '../../lib/CGF.js';

export class MySphere extends CGFobject {

    constructor(scene, radius, slices, stacks, inside=false, north=1, south=1) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.inside = inside ? -1 : 1;
        this.north = north;
        this.south = south;
        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];



        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}