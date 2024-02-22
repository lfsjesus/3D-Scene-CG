import {CGFobject} from '../lib/CGF.js';
import {MyDiamond} from './MyDiamond.js';
import {MyTriangle} from './MyTriangle.js';
import {MyTriangleSmall} from './MyTriangleSmall.js';
import {MyTriangleBig} from './MyTriangleBig.js';
import {MyParallelogram} from './MyParallelogram.js';


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
	}

	
	display() {


			//MyDiamond
			this.scene.pushMatrix();
			//set diffuse to rgba(255,255,0,255)
			this.scene.setDiffuse(0, 1.0, 0.0, 1.0);
			let matrixTranslate = 
							  [1, 0, 0, 0,
							   0, 1, 0, 0,
							   0, 0, 1, 0,
							   0, 1, 0, 1];
	  
			this.scene.multMatrix(matrixTranslate);
			this.diamond.display();       
			this.scene.popMatrix();     
			


			// we will now use CGFscene.translate(x, y, z) , etc and CGFscene.pushMatrix() and CGFscene.popMatrix()
			//MyTriangleBig
			this.scene.pushMatrix();
			// set diffuse to rgba(255,155,0,255)
			this.scene.setDiffuse(1.0, 0.6, 0.0, 1.0);
			this.scene.translate(0.58, -1.415, 0);
			this.scene.rotate(-Math.PI/4, 0, 0, 1);
			this.triangleBig.display();
			this.scene.popMatrix();
	  
			this.scene.pushMatrix();
			// set diffuse to rgba(0,155,255,255)
			this.scene.setDiffuse(0, 0.6, 1.0, 1.0);
			this.scene.translate(0, -2.83, 0);
			this.triangleBig.display();
			this.scene.popMatrix();
	

			//MyTriangleSmall
			this.scene.pushMatrix();
			// set diffuse to rgba(150,80,190,255)
			this.scene.setDiffuse(0.6, 0.3, 0.7, 1.0);
			this.scene.translate(1, 0, 0);
			this.triangleSmall.display();
			this.scene.popMatrix();
	  
	  
			this.scene.pushMatrix();
			// set diffuse to rgba(255,27,27,255)
			this.scene.setDiffuse(1.0, 0.1, 0.1, 1.0);
			this.scene.translate(-2, -1.83, 0);
			this.scene.rotate(-Math.PI/2, 0, 0, 1);
			this.triangleSmall.display();
			this.scene.popMatrix();
			

			//MyParallelogram
			this.scene.pushMatrix();
			this.scene.setAmbient(1, 1, 0, 1.0);
			// set diffuse to rgba(255,255,255,255)
			this.scene.setDiffuse(1.0, 1.0, 0, 1.0);
			this.scene.translate(-3, 1, 0);
			this.scene.rotate(Math.PI, 1, 0, 0);
			this.parallelogram.display();
			this.scene.popMatrix();

			
			//MyTriangle
			this.scene.pushMatrix();
			// set diffuse to rgba(255,155,207,255)
			this.scene.setDiffuse(1.0, 0.6, 0.8, 1.0);
			this.scene.translate(-1, 2.415, 0);
			this.scene.rotate(Math.PI/4, 0, 0, 1);
			this.triangle.display();
			this.scene.popMatrix();


		}

		
	}



