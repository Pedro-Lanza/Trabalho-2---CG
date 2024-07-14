class Celestial{
    constructor(app, texture = null, scale = 1.0,  tRadius = 0.0, tSpeed = 1.0, rSpeed = 1.0){
        this.app = app;
        this.gl = app.gl;
        this.program = app.program;
        this.programNoise = app.programNoise;
        this.updateModelViewMatrix = app.updateModelViewMatrix;
        this.tRadius = tRadius;
        this.tSpeed = tSpeed;
        this.rSpeed = rSpeed;
        this.stack = new SimpleGLStack();
        this.pos = vec3.create();
        this.scale = vec3.create()

        vec3.set(this.scale, scale, scale, scale);
        vec3.set(this.pos, 0.0, 0.0, 0.0);

        this.sphere = new WebGLSphere(this.gl, this.program, 1.0,32,32,new Color(1.0,0.0,0.0,1.0), texture);
        this.sphereModel = this.sphere.getWebGLModel();
    }

    draw(modelViewMatrix){
        this.stack.push(mat4.clone(modelViewMatrix));
            mat4.scale(modelViewMatrix,modelViewMatrix,this.scale);
            this.updateModelViewMatrix(this.sphereModel.program,modelViewMatrix,"uModelViewMatrix");
            this.sphereModel.draw();
        modelViewMatrix = this.stack.pop();
    }
}

class Sun extends Celestial {
    constructor(app, texture = "sun-texture.png"){
        super(app, texture, 5.0, 0.0, -0.75);
        vec3.set(this.scale, 5.0, 5.0, 5,0);
    }
}

class Planet extends Celestial{
    constructor(app, texture = null, scale = 1.0, tRadius = 1.0, tSpeed = 1.0){
        super(app, texture, scale, tRadius, tSpeed);
        this.heightMap = generateHeightMap(257, 1.0); // Tamanho 257 para uma grid 256x256
        this.initBuffers();
    }

    initBuffers() {
        // Inicializa os buffers dos vértices aqui
        let vertices = [];
        let indices = [];

        for (let i = 0; i < this.heightMap.length; i++) {
            for (let j = 0; j < this.heightMap[i].length; j++) {
                let x = i / (this.heightMap.length - 1) * 2 - 1;
                let y = j / (this.heightMap[i].length - 1) * 2 - 1;
                let z = this.heightMap[i][j];
                vertices.push(x * this.radius, y * this.radius, z * this.radius);
            }
        }

        // Criar índices para desenhar os triângulos
        for (let i = 0; i < this.heightMap.length - 1; i++) {
            for (let j = 0; j < this.heightMap[i].length - 1; j++) {
                let topLeft = i * this.heightMap.length + j;
                let topRight = topLeft + 1;
                let bottomLeft = topLeft + this.heightMap.length;
                let bottomRight = bottomLeft + 1;
                indices.push(topLeft, bottomLeft, topRight);
                indices.push(topRight, bottomLeft, bottomRight);
            }
        }

        this.vertexBuffer = this.app.gl.createBuffer();
        this.app.gl.bindBuffer(this.app.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.app.gl.bufferData(this.app.gl.ARRAY_BUFFER, new Float32Array(vertices), this.app.gl.STATIC_DRAW);

        this.indexBuffer = this.app.gl.createBuffer();
        this.app.gl.bindBuffer(this.app.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.app.gl.bufferData(this.app.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.app.gl.STATIC_DRAW);

        this.numElements = indices.length;
    }

    draw(modelViewMatrix) {
        // Desenha o planeta utilizando o shader e os buffers de vértices e índices
        this.stack.push(mat4.clone(modelViewMatrix));
        mat4.translate(modelViewMatrix, modelViewMatrix, this.pos);
        mat4.scale(modelViewMatrix, modelViewMatrix, this.scale);
        this.updateModelViewMatrix(this.sphereModel.program, modelViewMatrix, "uModelViewMatrix");
        this.app.gl.bindBuffer(this.app.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.app.gl.vertexAttribPointer(this.app.program.attribShaderVariables.aVertexPosition, 3, this.app.gl.FLOAT, false, 0, 0);
        this.app.gl.enableVertexAttribArray(this.app.program.attribShaderVariables.aVertexPosition);

        this.app.gl.bindBuffer(this.app.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.app.gl.drawElements(this.app.gl.TRIANGLES, this.numElements, this.app.gl.UNSIGNED_SHORT, 0);
        modelViewMatrix = this.stack.pop();
    }

}

class Animal{

    constructor(app){
        
        this.gl = app.gl;
        this.program = app.program;
        this.programNoise = app.programNoise;
        this.updateModelViewMatrix = app.updateModelViewMatrix;

        this.stack = new SimpleGLStack();

        this.cube = new WebGLCube(this.gl,this.program,null,"ornage-fur-texture.jpg");
        this.cubeModel = this.cube.getWebGLModel();


        this.eyeBall = new WebGLSphere(this.gl,this.program,1.0,32,32,new Color(1.0,0.0,0.0,1.0),"metaldots6.jpg");
        this.eyeBallModel = this.eyeBall.getWebGLModel();

        this.furBall = new WebGLSphere(this.gl,this.programNoise,1.0,128,128,new Color(1.0,0.0,0.0,1.0),"white-fur-texture.jpg");
        this.furBallModel = this.furBall.getWebGLModel();

        this.furBall2 = new WebGLSphere(this.gl,this.programNoise,1.0,128,128,new Color(1.0,0.0,0.0,1.0),"ornage-fur-texture.jpg");
        this.furBall2Model = this.furBall2.getWebGLModel();

        this.metalBall = new WebGLSphere(this.gl,this.program,1.0,32,32,new Color(1.0,0.0,0.0,1.0),"angled-brushed-gold-texture.jpg");
        this.metalBallModel = this.metalBall.getWebGLModel();


        this.furCyl = new WebGLCylinder(this.gl,this.programNoise,2.5,4.0,128,128,new Color(1.0,0.0,0.0,1.0),"white-fur-texture.jpg");
        this.furCylModel = this.furCyl.getWebGLModel();

    }

    drawLeg(modelViewMatrix){
        var s = vec3.create();
        var t = vec3.create();


        // Leg
        this.stack.push(mat4.clone(modelViewMatrix));  
            //Upper leg
            mat4.rotateX(modelViewMatrix,modelViewMatrix, 10 * Math.PI / 180);  
            this.stack.push(mat4.clone(modelViewMatrix));
                vec3.set(s, 0.4, 0.4, 0.4);
                mat4.scale(modelViewMatrix,modelViewMatrix,s);
                this.updateModelViewMatrix(this.metalBallModel.program,modelViewMatrix,"uModelViewMatrix");
                this.metalBallModel.draw();
            modelViewMatrix = this.stack.pop();

            vec3.set(t, 0.0, -0.6, 0.0);
            mat4.translate(modelViewMatrix,modelViewMatrix,t);
            this.stack.push(mat4.clone(modelViewMatrix));
                vec3.set(s, 0.1, 0.2, 0.1);
                mat4.scale(modelViewMatrix,modelViewMatrix,s);
                mat4.rotateX(modelViewMatrix,modelViewMatrix, -90 * Math.PI / 180);      
                this.updateModelViewMatrix(this.furCylModel.program,modelViewMatrix,"uModelViewMatrix");
                this.furCylModel.draw();
            modelViewMatrix = this.stack.pop();

            //Lower leg
            vec3.set(t, 0.0, -0.6, 0.0);
            mat4.translate(modelViewMatrix,modelViewMatrix,t);
            mat4.rotateX(modelViewMatrix,modelViewMatrix, -30 * Math.PI / 180);  
            this.stack.push(mat4.clone(modelViewMatrix));
                vec3.set(s, 0.3, 0.3, 0.3);
                mat4.scale(modelViewMatrix,modelViewMatrix,s);
                this.updateModelViewMatrix(this.metalBallModel.program,modelViewMatrix,"uModelViewMatrix");
                this.metalBallModel.draw();
            modelViewMatrix = this.stack.pop();

            vec3.set(t, 0.0, -0.6, 0.0);
            mat4.translate(modelViewMatrix,modelViewMatrix,t);
            this.stack.push(mat4.clone(modelViewMatrix));
                vec3.set(s, 0.05, 0.2, 0.05);
                mat4.scale(modelViewMatrix,modelViewMatrix,s);
                mat4.rotateX(modelViewMatrix,modelViewMatrix, -90 * Math.PI / 180);      
                this.updateModelViewMatrix(this.furCylModel.program,modelViewMatrix,"uModelViewMatrix");
                this.furCylModel.draw();
            modelViewMatrix = this.stack.pop();

            vec3.set(t, 0.0, -0.5, 0.0);
            mat4.translate(modelViewMatrix,modelViewMatrix,t);
            this.stack.push(mat4.clone(modelViewMatrix));
                vec3.set(s, 0.2, 0.2, 0.2);
                mat4.scale(modelViewMatrix,modelViewMatrix,s);
                this.updateModelViewMatrix(this.metalBallModel.program,modelViewMatrix,"uModelViewMatrix");
                this.metalBallModel.draw();
            modelViewMatrix = this.stack.pop();

            vec3.set(t, 0.0, -0.3, 0.0);
            mat4.translate(modelViewMatrix,modelViewMatrix,t);
            this.stack.push(mat4.clone(modelViewMatrix));
                mat4.rotateX(modelViewMatrix,modelViewMatrix, 20 * Math.PI / 180);  
                vec3.set(s, 0.2, 0.1, 0.4);
                mat4.scale(modelViewMatrix,modelViewMatrix,s);
                this.updateModelViewMatrix(this.cubeModel.program,modelViewMatrix,"uModelViewMatrix");
                this.cubeModel.draw();
            modelViewMatrix = this.stack.pop();
   
        modelViewMatrix = this.stack.pop();

    }

    draw(modelViewMatrix){
    
        var s = vec3.create();
        var t = vec3.create();


        this.stack.push(mat4.clone(modelViewMatrix));  
            //Global position
            vec3.set(t, 0.0, 1.5, 0.0);
            mat4.translate(modelViewMatrix,modelViewMatrix,t);

            this.stack.push(mat4.clone(modelViewMatrix));
            
                mat4.rotateX(modelViewMatrix,modelViewMatrix, 0.0 * Math.PI / 180);

                //Dog body
                this.stack.push(mat4.clone(modelViewMatrix));
                    vec3.set(t, 0.0, 0.0, 1.0);
                    mat4.translate(modelViewMatrix,modelViewMatrix,t);
                    vec3.set(s, 0.9, 0.9, 1.0);
                    mat4.scale(modelViewMatrix,modelViewMatrix,s);
                    this.updateModelViewMatrix(this.furBallModel.program,modelViewMatrix,"uModelViewMatrix");
                    this.furBallModel.draw();
                modelViewMatrix = this.stack.pop();
            


                this.stack.push(mat4.clone(modelViewMatrix));
                    vec3.set(s, 1.0, 0.8, 2.0);
                    mat4.scale(modelViewMatrix,modelViewMatrix,s);
                    this.updateModelViewMatrix(this.furBallModel.program,modelViewMatrix,"uModelViewMatrix");
                    this.furBallModel.draw();
                modelViewMatrix = this.stack.pop();

         
                this.stack.push(mat4.clone(modelViewMatrix));
                    vec3.set(t, 1.0, 0.0, 1.0);
                    mat4.translate(modelViewMatrix,modelViewMatrix,t);
                    this.drawLeg(modelViewMatrix);
                modelViewMatrix = this.stack.pop();

                

                this.stack.push(mat4.clone(modelViewMatrix));
                    vec3.set(t, -1.0, 0.0, 1.0);
                    mat4.translate(modelViewMatrix,modelViewMatrix,t);
                    this.drawLeg(modelViewMatrix);
                modelViewMatrix = this.stack.pop();

                this.stack.push(mat4.clone(modelViewMatrix));
                    vec3.set(t, 1.0, 0.0, -1.0);
                    mat4.translate(modelViewMatrix,modelViewMatrix,t);
                    this.drawLeg(modelViewMatrix);
                modelViewMatrix = this.stack.pop();

                this.stack.push(mat4.clone(modelViewMatrix));
                    vec3.set(t, -1.0, 0.0, -1.0);
                    mat4.translate(modelViewMatrix,modelViewMatrix,t);
                    this.drawLeg(modelViewMatrix);
                modelViewMatrix = this.stack.pop();

            modelViewMatrix = this.stack.pop();
   
            vec3.set(t, 0.0, 1.0, 1.5);
            mat4.translate(modelViewMatrix,modelViewMatrix,t);
            mat4.rotateX(modelViewMatrix,modelViewMatrix, 10.0 * Math.PI / 180); 
            this.stack.push(mat4.clone(modelViewMatrix)); 
                vec3.set(s, 0.15, 0.15, 0.2);
                mat4.rotateX(modelViewMatrix,modelViewMatrix, -90.0 * Math.PI / 180);    
                mat4.scale(modelViewMatrix,modelViewMatrix,s);
                this.updateModelViewMatrix(this.furBallModel.program,modelViewMatrix,"uModelViewMatrix");
                this.furCylModel.draw();     
            modelViewMatrix = this.stack.pop();   


            this.stack.push(mat4.clone(modelViewMatrix));  
                //Dog face
                mat4.rotateX(modelViewMatrix,modelViewMatrix, 0.0 * Math.PI / 180);
                vec3.set(t, 0.0, 0.8, 0.3);
                mat4.translate(modelViewMatrix,modelViewMatrix,t);
                vec3.set(s, 1.0, 0.8, 1.0);
                mat4.scale(modelViewMatrix,modelViewMatrix,s);
                this.updateModelViewMatrix(this.furBallModel.program,modelViewMatrix,"uModelViewMatrix");
                this.furBallModel.draw();

                //Right Eye
                this.stack.push(mat4.clone(modelViewMatrix));  
                    vec3.set(t, 0.5, 0.5, 0.6);
                    mat4.translate(modelViewMatrix,modelViewMatrix,t);
                    vec3.set(s, 0.2, 0.2, 0.2);
                    mat4.scale(modelViewMatrix,modelViewMatrix,s);
                    this.updateModelViewMatrix(this.metalBallModel.program,modelViewMatrix,"uModelViewMatrix");
                    this.eyeBallModel.draw();     
                modelViewMatrix = this.stack.pop();      

                //Left Eye
                this.stack.push(mat4.clone(modelViewMatrix));  
                    vec3.set(t, -0.5, 0.5, 0.6);
                    mat4.translate(modelViewMatrix,modelViewMatrix,t);
                    vec3.set(s, 0.2, 0.2, 0.2);
                    mat4.scale(modelViewMatrix,modelViewMatrix,s);
                    this.updateModelViewMatrix(this.metalBallModel.program,modelViewMatrix,"uModelViewMatrix");
                    this.eyeBallModel.draw();     
                modelViewMatrix = this.stack.pop(); 
                

                //Right Ear
                this.stack.push(mat4.clone(modelViewMatrix));  
                    vec3.set(t, 0.5, 0.5, 0.0);
                    mat4.translate(modelViewMatrix,modelViewMatrix,t);
                    vec3.set(s, 0.2, 0.8, 0.2);
                    mat4.scale(modelViewMatrix,modelViewMatrix,s);
                    this.updateModelViewMatrix(this.furBallModel.program,modelViewMatrix,"uModelViewMatrix");
                    this.furBallModel.draw();     
                modelViewMatrix = this.stack.pop();      

                //Left Ear
                this.stack.push(mat4.clone(modelViewMatrix));  
                    vec3.set(t, -0.5, 0.5, 0.0);
                    mat4.translate(modelViewMatrix,modelViewMatrix,t);
                    vec3.set(s, 0.2, 0.8, 0.2);
                    mat4.scale(modelViewMatrix,modelViewMatrix,s);
                    this.updateModelViewMatrix(this.furBallModel.program,modelViewMatrix,"uModelViewMatrix");
                    this.furBallModel.draw();       
                modelViewMatrix = this.stack.pop(); 

                //Nose
                this.stack.push(mat4.clone(modelViewMatrix));  
                    vec3.set(t, 0.0, 0.0, 1.0);
                    mat4.translate(modelViewMatrix,modelViewMatrix,t);
                    vec3.set(s, 0.5, 0.5, 0.5);
                    mat4.scale(modelViewMatrix,modelViewMatrix,s);
                    this.updateModelViewMatrix(this.furBall2Model.program,modelViewMatrix,"uModelViewMatrix");
                    this.furBall2Model.draw();     
                modelViewMatrix = this.stack.pop();
            
            modelViewMatrix = this.stack.pop();

        modelViewMatrix = this.stack.pop();

    }

}

class Wall{
    
    constructor(app,l,c){
        this.gl = app.gl;
        this.program = app.program;
        this.updateModelViewMatrix = app.updateModelViewMatrix;
        this.stack = new SimpleGLStack();
        this.l = l;
        this.c = c;
        this.wall = new WebGLCube(this.gl,this.program,null,"bricks07 diffuse 1k.jpg");
        this.wallModel = this.wall.getWebGLModel();

    }

    draw(modelViewMatrix){
        var i;
        var j;

        var tv = vec3.create();
        var s = vec3.create();
        for (i=0;i<this.l;i++){
            for (j=0;j<this.c;j++){
            this.stack.push(mat4.clone(modelViewMatrix));  
                vec3.set(tv,  i*2.0, j*2.0, 0.0);
                vec3.set(s,1.0,1.0,0.5);
                
                mat4.translate(modelViewMatrix,modelViewMatrix,tv);
                this.updateModelViewMatrix(this.wallModel.program,modelViewMatrix,"uModelViewMatrix");  
                this.wallModel.draw();
            modelViewMatrix = this.stack.pop();         
            }
        }
    }
}


class Ground{
    
    constructor(app,l,c){
        this.gl = app.gl;
        this.program = app.program;
        this.updateModelViewMatrix = app.updateModelViewMatrix;
        this.stack = new SimpleGLStack();
        this.l = l;
        this.c = c;

        this.grass = new WebGLCube(this.gl,this.program,null,"grass06  diffuse 1k.jpg");
        this.grassModel = this.grass.getWebGLModel();

    }

 
    draw(modelViewMatrix){
        var i;
        var j;
        var tv = vec3.create();
        for (i=0;i<this.l;i++){
            for (j=0;j<this.c;j++){
            this.stack.push(mat4.clone(modelViewMatrix));  
                vec3.set(tv,  i*2.0, 0.0, j*2.0);
                mat4.translate(modelViewMatrix,modelViewMatrix,tv);
                this.updateModelViewMatrix(this.grassModel.program,modelViewMatrix,"uModelViewMatrix");  
                this.grassModel.draw();
            modelViewMatrix = this.stack.pop();         
            }
        }
    }

}

class Jar{
    constructor(app){
        this.gl = app.gl;
        this.program = app.program;
        this.updateModelViewMatrix = app.updateModelViewMatrix;
        this.stack = new SimpleGLStack();

        var points = new PointList();
        points.push(new Point3d(0.2, 0.0,-1.0,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.3, 0.0,-0.9,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.4, 0.0,-0.8,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.6, 0.0,-0.7,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.7, 0.0,-0.6,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.8, 0.0,-0.5,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.7, 0.0,-0.4,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.6, 0.0,-0.3,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.6, 0.0,-0.2,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.5, 0.0,-0.1,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.4, 0.0, 0.0,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.5, 0.0, 0.1,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.6, 0.0, 0.2,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.7, 0.0, 0.3,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.8, 0.0, 0.4,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.9, 0.0, 0.5,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.6, 0.0, 0.6,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.1, 0.0, 0.7,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.2, 0.0, 0.8,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.2, 0.0, 0.9,new Color(1.0,0.0,0.0)));
        points.push(new Point3d(0.3, 0.0, 1.0,new Color(1.0,0.0,0.0)));

        this.jar = new WebGLRevolutionSurface(this.gl,this.program,points,32,new Color(1.0,0.0,0.0,1.0),"metaldots6.jpg");
        this.jarModel = this.jar.getWebGLModel();
    }

    draw(modelViewMatrix){
        this.stack.push(mat4.clone(modelViewMatrix));
            mat4.rotateX(modelViewMatrix,modelViewMatrix, -90.0 * Math.PI / 180);
            this.updateModelViewMatrix(this.jarModel.program,modelViewMatrix,"uModelViewMatrix");
            this.jarModel.draw();
        modelViewMatrix = this.stack.pop();
    }
}