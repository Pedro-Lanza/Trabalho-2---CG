#version 300 es
precision mediump float;
precision mediump int;
in vec4 vColor;
in vec3 vNormal;
in vec2 vTextureCoordinate;
out vec4 fragColor;
uniform int uTextureActive;

uniform sampler2D uSampler;

void main(void) {
    if (uTextureActive==1){
        //vec4 textureColor = texture(uSampler, vTextureCoordinate);
        //vec4 brightenedColor = textureColor * 1000.0; // Apply brightness factor
        //fragColor = brightenedColor * vColor; // Combine with vertex color
        fragColor = vColor*texture(uSampler,vTextureCoordinate) * (1.0, 1.0, 1.0, 1.0);
    }else{
        fragColor = vColor;
    }
}
