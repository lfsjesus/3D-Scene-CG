import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
import {MyDiamond} from '../tp4/MyDiamond.js';
import {MyTriangle} from '../tp4/MyTriangle.js';
import {MyTriangleSmall} from '../tp4/MyTriangleSmall.js';
import {MyTriangleBig} from '../tp4/MyTriangleBig.js';
import {MyParallelogram} from '../tp4/MyParallelogram.js';
import {MyTriangleSmall2} from '../tp4/MyTriangleSmall2.js';
import {MyTriangleBig2} from '../tp4/MyTriangleBig2.js';
/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */

//this class will call each of the previous classes to draw the tangram as we did in MyScene.js with the transformations

export class MyTangram extends CGFobject {
	constructor(scene) {
		super(scene);
		this.diamond = new MyDiamond(this.scene);
		this.triangle = new MyTriangle(this.scene);
		this.triangleSmall = new MyTriangleSmall(this.scene);
		this.triangleBig = new MyTriangleBig(this.scene);
		this.parallelogram = new MyParallelogram(this.scene);
		this.MyTriangleSmall2 = new MyTriangleSmall2(this.scene);
		this.MyTriangleBig2 = new MyTriangleBig2(this.scene);
		this.initMaterials();
	}


	initMaterials() {

		this.diamondMaterial = new CGFappearance(this.scene);
		this.diamondMaterial.setAmbient(0, 1.0, 0.0, 1.0);
		this.diamondMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
		this.diamondMaterial.setShininess(10.0);

		this.triangleBig1Material = new CGFappearance(this.scene);
		this.triangleBig1Material.setAmbient(1.0, 0.6, 0.0, 1.0);
		this.triangleBig1Material.setSpecular(0.9, 0.9, 0.9, 1.0);
		this.triangleBig1Material.setShininess(10.0);

		this.triangleBig2Material = new CGFappearance(this.scene);
		this.triangleBig2Material.setAmbient(0, 0.6, 1.0, 1.0);
		this.triangleBig2Material.setSpecular(0.9, 0.9, 0.9, 1.0);
		this.triangleBig2Material.setShininess(10.0);

		this.triangleSmall1Material = new CGFappearance(this.scene);
		this.triangleSmall1Material.setAmbient(0.6, 0.3, 0.7, 1.0);
		this.triangleSmall1Material.setSpecular(0.9, 0.9, 0.9, 1.0);
		this.triangleSmall1Material.setShininess(10.0);

		this.triangleSmall2Material = new CGFappearance(this.scene);
		this.triangleSmall2Material.setAmbient(1, 0.1, 0.1, 1.0);
		this.triangleSmall2Material.setSpecular(0.9, 0.9, 0.9, 1.0);
		this.triangleSmall2Material.setShininess(10.0);

		this.parallelogramMaterial = new CGFappearance(this.scene);
		this.parallelogramMaterial.setAmbient(1, 1, 0, 1.0);
		this.parallelogramMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
		this.parallelogramMaterial.setShininess(10.0);

		this.triangleMaterial = new CGFappearance(this.scene);
		this.triangleMaterial.setAmbient(1.0, 0.6, 0.8, 1.0);
		this.triangleMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
		this.triangleMaterial.setShininess(10.0);

		// Tangram texture
		this.tangramTexture = new CGFappearance(this.scene);
		this.tangramTexture.setAmbient(0.1, 0.1, 0.1, 1);
		this.tangramTexture.setDiffuse(0.9, 0.9, 0.9, 1);
		this.tangramTexture.setShininess(10.0);
		this.tangramTexture.loadTexture('images/tangram.png');

 
	}
	
	display() {


			//MyDiamond
			this.scene.pushMatrix();
			let matrixTranslate = 
							  [1, 0, 0, 0,
							   0, 1, 0, 0,
							   0, 0, 1, 0,
							   0, 1, 0, 1];
	  
			this.scene.multMatrix(matrixTranslate);
			this.tangramTexture.apply();
			this.diamond.display(); 
			this.diamond.enableNormalViz();      
			this.scene.popMatrix();     
			


			// we will now use CGFscene.translate(x, y, z) , etc and CGFscene.pushMatrix() and CGFscene.popMatrix()
			//MyTriangleBig
			this.scene.pushMatrix();
			this.scene.translate(0.58, -1.415, 0);
			this.scene.rotate(-Math.PI/4, 0, 0, 1);
			this.tangramTexture.apply();
			this.triangleBig.display();
			this.triangleBig.enableNormalViz();
			this.scene.popMatrix();
								
			//MyTriangleBig2
			this.scene.pushMatrix();
			this.scene.translate(0, -2.83, 0);
			this.tangramTexture.apply();
			this.MyTriangleBig2.display();
			this.MyTriangleBig2.enableNormalViz();
			this.scene.popMatrix();
	

			//MyTriangleSmall
			this.scene.pushMatrix();
			this.scene.translate(1, 0, 0);
			this.tangramTexture.apply();
			this.triangleSmall.display();
			this.triangleSmall.enableNormalViz();
			this.scene.popMatrix();
	  
			//MyTriangleSmall2					
			this.scene.pushMatrix();
			this.scene.translate(-2, -1.83, 0);
			this.scene.rotate(-Math.PI/2, 0, 0, 1);
			this.tangramTexture.apply();
			this.MyTriangleSmall2.display();
			this.MyTriangleSmall2.enableNormalViz();
			this.scene.popMatrix();
			

			//MyParallelogram
			this.scene.pushMatrix();
			this.scene.translate(-3, 1, 0);
			this.scene.rotate(Math.PI, 1, 0, 0);
			this.tangramTexture.apply();
			this.parallelogram.display();
			this.parallelogram.enableNormalViz();
			this.scene.popMatrix();

			
			//MyTriangle
			this.scene.pushMatrix();
			this.scene.translate(-1, 2.415, 0);
			this.scene.rotate(Math.PI/4, 0, 0, 1);
			this.tangramTexture.apply();
			this.triangle.display();
			this.triangle.enableNormalViz();
			this.scene.popMatrix();


		}

		
	}



