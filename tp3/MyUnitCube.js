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
			0.5, 0.5, 0.5, //7
			-0.5, -0.5, -0.5, //8
            -0.5, 0.5, -0.5, //9
            0.5, -0.5, -0.5, //10
            0.5, 0.5, -0.5, //11
            -0.5, -0.5, 0.5, //12
			-0.5, 0.5, 0.5, //13
			0.5, -0.5, 0.5, //14
			0.5, 0.5, 0.5, //15
			-0.5, -0.5, -0.5, //16
            -0.5, 0.5, -0.5, //17
            0.5, -0.5, -0.5, //18
            0.5, 0.5, -0.5, //19
            -0.5, -0.5, 0.5, //20
			-0.5, 0.5, 0.5, //21
			0.5, -0.5, 0.5, //22
			0.5, 0.5, 0.5 //23

		];


		this.normals = [
			0, 0, -1, //0
			0, 0, -1, //1
			0, 0, -1, //2
			0, 0, -1, //3
			0, 0, 1, //4
			0, 0, 1, //5
			0, 0, 1, //6
			0, 0, 1, //7
			0, -1, 0, //8
			0, 1, 0, //9
			0, -1, 0, //10
			0, 1, 0, //11
			0, -1, 0, //12
			0, 1, 0, //13
			0, -1, 0, //14
			0, 1, 0, //15
			-1, 0, 0, //16
			-1, 0, 0, //17
			1, 0, 0, //18
			1, 0, 0, //19
			-1, 0, 0, //20
			-1, 0, 0, //21
			1, 0, 0, //22
			1, 0, 0, //23




			

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

