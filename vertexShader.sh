    #version 300 es
    precision mediump float;
    precision mediump int;

    in vec3 aVertexPosition;
    in vec3 aVertexColor;
    in vec3 aVertexNormal;
    in vec2 aTextureCoordinate;
    

    smooth out vec4 vColor;
    smooth out vec3 vNormal;
    out vec2 vTextureCoordinate;
    uniform float uVertexPointSize;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uModelViewMatrixClean;
    uniform mat4 uNormalMatrix;
    uniform mat4 uProjectionMatrix;
    uniform int uTextureActive;
    uniform vec3 uLightPos;
    uniform vec3 uEyePos;
    uniform float uTime;  // Added for animation
    uniform float uRadius; // Radius of the orbit
    uniform float uSpeed;  // Speed of the orbit
    uniform float uKa; // Ambient coefficient
    uniform float uKd; // Diffuse coefficient
    uniform float uKs; // Specular coefficient
    uniform float uNs; // Shininess


    void main(void) {
      
      mat4 normalMatrix = inverse(uModelViewMatrix);
      normalMatrix = transpose(normalMatrix);

      float angle = uTime * uSpeed;
      vec3 offset = vec3(uRadius * cos(angle), 0.0, uRadius * sin(angle));
      vec4 pos = vec4(aVertexPosition + offset, 1.0);
      //vec4 pos = vec4(aVertexPosition,1.0);

      // Apply self-rotation
      float selfAngle = uTime * uSpeed;
      mat4 selfRotation = mat4(
          cos(selfAngle), 0.0, sin(selfAngle), 0.0,
          0.0, 1.0, 0.0, 0.0,
          -sin(selfAngle), 0.0, cos(selfAngle), 0.0,
          0.0, 0.0, 0.0, 1.0
      );
      

      vec4 normal = normalMatrix*vec4(aVertexNormal,0.0);
      vec4 light =  uModelViewMatrixClean*vec4(uLightPos,1.0);
      
      vColor = vec4(aVertexColor,1.0); 

      vec3 normalVec = normalize(vec3(normal));
      vec3 lightVec = normalize(vec3(light) - vec3(uModelViewMatrix * pos));
      vec3 eyeVec = normalize(vec3(uEyePos) - vec3(uModelViewMatrix * pos));

      

      float lambert = dot(normalVec,lightVec);
      vec4 matDiff,matSpec;

      pos = selfRotation * pos; //update rotation only after the light direction is calculated
      vec4 newPos = uProjectionMatrix*uModelViewMatrix * pos;

      //Se houver textura, o material da superficie e definido pela cor dos vertices
      if (uTextureActive==0){
        matDiff = vColor;
        matSpec = vColor;
      }
      else{// se nao é um cor branca
        matDiff = vec4(1.0,1.0,1.0,1.0);
        matSpec = vec4(1.0,1.0,1.0,1.0);
      }

      vec3 Ia; // Iluminacao ambiental
      vec3 Id; // Iluminacao Difusa
      vec3 Is; // Iluminacao Especular

      // Calculo da componente ambiental
      Ia = uKa * vec3(1.0, 1.0, 1.0);

      // Se o coeficiente de atenuacao difusa for positivo
      if (lambert > 0.0) { // multiplica o coeficiente pelo material
          vec3 refVec = reflect(lightVec, normalVec);
          float angSpec = max(0.0, dot(refVec, eyeVec));
          float specular = pow(angSpec, uNs);
          Id = uKd * vec3(lambert * matDiff);
          Is = uKs * vec3(specular * matSpec);
      } else { // senao a iluminacao difusa e zero
          Id = vec3(0.0, 0.0, 0.0);
          Is = vec3(0.0, 0.0, 0.0);
      }

      vColor = vec4(Ia + Id + Is, 1.0);

     
      gl_PointSize = 8.0;
      gl_Position = newPos;
      vTextureCoordinate = aTextureCoordinate;
      //vNormal = aVertexNormal;
    }