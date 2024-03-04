import { CGFobject } from '../lib/CGF.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }


    updateBuffers(complexity) {
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        
        for (let stackIndex = 0; stackIndex <= this.stacks; stackIndex++) {
            this.vertices.push(1, 0, stackIndex / this.stacks);
            this.normals.push(1, 0, 0);
        }
    
        for (let sliceIndex = 1; sliceIndex <= this.slices; sliceIndex++) {
            let angle = 2 * Math.PI * sliceIndex / this.slices;
            let x = Math.cos(angle);
            let y = Math.sin(angle);
            let normalVectorMagnitude = Math.sqrt(x * x + y * y);
    
            if (sliceIndex != this.slices) {    
                this.vertices.push(x, y, 0);
                this.normals.push(x / normalVectorMagnitude, y / normalVectorMagnitude, 0);
            }
    
            for (let stackIndex = 1; stackIndex <= this.stacks; stackIndex++) {
                if (sliceIndex != this.slices) {
                    let z = stackIndex / this.stacks;
                    this.vertices.push(x, y, z);
                    this.normals.push(x / normalVectorMagnitude, y / normalVectorMagnitude, 0);
                    
                    let totalPoints = this.vertices.length / 3;
                    let indexC = totalPoints - 2;
                    let indexD = totalPoints - 1;
                    let indexB = indexD - (this.stacks + 1);
                    let indexA = indexB - 1;
                    this.indices.push(indexA, indexC, indexD, indexA, indexD, indexB);
                } else {
                    let totalPoints = this.vertices.length / 3;
                    let indexC = stackIndex - 1;
                    let indexD = stackIndex;
                    let indexB = totalPoints - this.stacks - 1 + stackIndex;
                    let indexA = indexB - 1;
                    this.indices.push(indexA, indexC, indexD, indexA, indexD, indexB);
                }
            }
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        
        this.initGLBuffers();
    }
    
}