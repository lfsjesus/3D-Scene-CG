import {CGFobject} from '../lib/CGF.js';
import {MyQuad} from './MyQuad.js';

export class MyUnitCubeQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.quad = new MyQuad(scene);
    }

    display() {
        this.scene.setDiffuse(1.0, 1.0, 1.0, 0.5);
        // Front face
        this.scene.pushMatrix();
        this.scene.setDiffuse(1.0, 1.0, 1.0, 0.5);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        this.scene.popMatrix();
        

        // Back face
        this.scene.pushMatrix();
        this.scene.setDiffuse(1.0, 1.0, 1.0, 0.5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        this.scene.popMatrix();

        
        // Left face
        this.scene.pushMatrix();
        this.scene.setDiffuse(1.0, 1.0, 1.0, 0.5);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        this.scene.popMatrix();
        
        // Right face
        this.scene.pushMatrix();
        this.scene.setDiffuse(1.0, 1.0, 1.0, 0.5);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        this.scene.popMatrix();

        // Top face
        this.scene.pushMatrix();
        this.scene.setDiffuse(1.0, 1.0, 1.0, 0.5);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        this.scene.popMatrix();

        // Bottom face
        this.scene.pushMatrix();
        this.scene.setDiffuse(1.0, 1.0, 1.0, 0.5);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        
        this.scene.popMatrix();
        
    }
}
