import {CGFobject} from '../lib/CGF.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			-0.5, -0.5, -0.5, //0
            -0.5, 0.5, -0.5, //1
            0.5, -0.5, -0.5, //2
            0.5, 0.5, -0.5, //3
            -0.5, -0.5, 0.5, //4
			-0.5, 0.5, 0.5, //5
			0.5, -0.5, 0.5, //6
			0.5, 0.5, 0.5 //7
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			// Lower face
			2, 0, 1,
			1, 3, 2,
			// Upper face
			6, 5, 4,
			6, 7, 5,
			// Front face
			2, 7, 6,
			2, 3, 7,
			// Back face
			0, 4, 5,
			0, 5, 1,
			// Left face
			2, 6, 4,
			2, 4, 0,
			// Right Face
			3, 5, 7,
			3, 1, 5,
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

