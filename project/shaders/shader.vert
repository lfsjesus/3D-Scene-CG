attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float normScale;

void main() {
    vec3 offset=vec3(0.0,0.0,0.0);
    
    vTextureCoord = aTextureCoord;
    float height = 5.0;
    float windFactor = 0.8;
    
    if(aVertexPosition.y > 0.0){
        float ratio = (aVertexPosition.y / height) * (aVertexPosition.y / height);

        offset = vec3(0.0, 0.0, windFactor * ratio * sin (timeFactor));
        
    }

    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}