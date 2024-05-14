import { CGFobject, CGFtexture, CGFappearance } from '../../lib/CGF.js';
import { MyParallelepiped } from '../Primitives/MyParallelepiped.js';

export class MyHive extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initComponents();
    }

    initComponents() {


        let woodTexture = new CGFtexture(this.scene, 'images/wooden.jpg');
        let woodenMaterial = new CGFappearance(this.scene);
        woodenMaterial.setTexture(woodTexture);
        woodenMaterial.setTextureWrap('REPEAT', 'REPEAT');
        woodenMaterial.setAmbient(1, 1, 1, 1);
        woodenMaterial.setDiffuse(1, 1, 1, 1);
        woodenMaterial.setSpecular(1, 1, 1, 1);
        woodenMaterial.setShininess(10.0);


        this.face = new MyParallelepiped(this.scene, 10, 10, 0.5, woodenMaterial);
    }

    display() {
        this.scene.pushMatrix();
        
        // Display each face with the appropriate transformations
        // Front face
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 5);
        this.face.display();
        this.scene.popMatrix();

        // Bottom face
        this.scene.pushMatrix();
        this.scene.translate(0, -5, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.face.display();
        this.scene.popMatrix();


        // Back face
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.face.display();
        this.scene.popMatrix();

        // Left face
        this.scene.pushMatrix();
        this.scene.translate(-5, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.face.display();
        this.scene.popMatrix();

        // Right face
        this.scene.pushMatrix();
        this.scene.translate(5, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.face.display();
        this.scene.popMatrix();


        // Open Top face (which is rotated)
        this.scene.pushMatrix();
        this.scene.scale(1, 0.5, 1);
        this.scene.translate(0, 13, -9);
        this.scene.rotate(- Math.PI/4 , 1, 0, 0);
        this.face.display();
        this.scene.popMatrix();

        this.scene.translate(0, 10, 0);

        this.scene.popMatrix();
    }
}
