attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D waterMap;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;
    vec3 offset = aVertexNormal * 0.1 * texture2D(waterMap, vTextureCoord).b;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}

