import {CGFobject} from '../../lib/CGF.js';

export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, radius, invert = false, material = undefined) {
        super(scene);
        this.stacksCount = stacks * 2;      
        this.slicesCount = slices;           
        this.radius = radius;
        this.invert = invert;
        this.material = material;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const stackAngleIncrement = Math.PI / this.stacksCount;
        const sliceAngleIncrement = (2 * Math.PI) / this.slicesCount;

        for (let stackIndex = 0; stackIndex <= this.stacksCount; stackIndex++) {
            const stackAngle = stackIndex * stackAngleIncrement;
            for (let sliceIndex = 0; sliceIndex <= this.slicesCount; sliceIndex++) {
                const sliceAngle = sliceIndex * sliceAngleIncrement; 
                // vertex coordinates
                let x = this.radius * Math.sin(stackAngle) * Math.cos(sliceAngle);
                let y = this.radius * Math.cos(stackAngle);
                let z = this.radius * Math.sin(stackAngle) * Math.sin(-sliceAngle);
                this.vertices.push(x, y, z);

                // vertex normals: divide by radius to normalize
                let nx = x  / this.radius;               
                let ny = y  / this.radius;                 
                let nz = z  / this.radius;                 
                this.normals.push(nx, ny, nz);
                
                // text coords
                let s = sliceIndex / this.slicesCount;
                let t = stackIndex / this.stacksCount;
                this.texCoords.push(s, t);

                // indices for triangles
                if (stackIndex < this.stacksCount && sliceIndex < this.slicesCount) {
                    let current = stackIndex * (this.slicesCount + 1) + sliceIndex;         
                    let next = current + this.slicesCount + 1;          

                    if (!this.invert) {
                        this.indices.push(current + 1, current, next);
                        this.indices.push(current + 1, next, next + 1);
                    }
                    else {
                        this.indices.push(next + 1, next, current + 1);
                        this.indices.push(next, current, current + 1);
                    }
                }
            }
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
