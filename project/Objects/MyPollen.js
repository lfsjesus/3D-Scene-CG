import { CGFobject } from '../../lib/CGF.js';
import { CGFtexture, CGFappearance } from '../../lib/CGF.js';

export class MyPollen extends CGFobject {
    constructor(scene, slices, stacks, radius, material = undefined) {
        super(scene);
        this.slicesCount = slices;
        this.stacksCount = stacks * 2;  // Multiplied by 2 to account for both hemispheres
        this.radius = radius;
        this.material = material;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];
    
        const stackAngleIncrement = Math.PI / this.stacksCount;
        const sliceAngleIncrement = (2 * Math.PI) / this.slicesCount;
    
        for (let stackIndex = 0; stackIndex <= this.stacksCount; stackIndex++) {
            let stackAngle = stackIndex * stackAngleIncrement;
    
            for (let sliceIndex = 0; sliceIndex <= this.slicesCount; sliceIndex++) {
                let sliceAngle = sliceIndex * sliceAngleIncrement;
    
                // vertex coordinates
                let x = this.radius * Math.sin(stackAngle) * Math.cos(sliceAngle);
                let y = this.radius * Math.cos(stackAngle);
                let z = this.radius * Math.sin(stackAngle) * Math.sin(-sliceAngle);
    
                // Applying different scales in YY based on the hemisphere
                if (y >= 0) {
                    y *= 1.5;  // Top hemisphere elongated
                }
    
                this.vertices.push(x, y, z);
                this.normals.push(
                    x / this.radius, 
                    y / (this.radius * (y >= 0 ? 1.5 : 1)),  // Adjust normal for elongated part
                    z / this.radius
                );
    
                // Adjusted texture coordinates
                let s = sliceIndex / this.slicesCount;
                let t = stackIndex / this.stacksCount;
                // Remap t to start and end at the poles
                t = 1 - t; 
    
                this.texCoords.push(s, t);
    
                // indices for triangles
                if (stackIndex < this.stacksCount && sliceIndex < this.slicesCount) {
                    let current = stackIndex * (this.slicesCount + 1) + sliceIndex;
                    let next = current + this.slicesCount + 1;
    
                    this.indices.push(current + 1, current, next);
                    this.indices.push(current + 1, next, next + 1);
                }
            }
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    

    display() {
        if(this.material != undefined) this.material.apply();
        this.scene.pushMatrix();
        super.display();
        this.scene.popMatrix();
    }
}
