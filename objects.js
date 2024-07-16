class Celestial {
    constructor(app, texture = null, scale = 1.0, tRadius = 0.0, tSpeed = 1.0, rSpeed = 1.0) {
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
        this.scale = vec3.create();

        vec3.set(this.scale, scale, scale, scale);
        vec3.set(this.pos, 0.0, 0.0, 0.0);

        this.sphere = new WebGLSphere(this.gl, this.program, 1.0, 32, 32, new Color(1.0, 0.0, 0.0, 1.0), texture);
        this.sphereModel = this.sphere.getWebGLModel();
    }

    draw(modelViewMatrix) {
        this.stack.push(mat4.clone(modelViewMatrix));
        mat4.scale(modelViewMatrix, modelViewMatrix, this.scale);
        this.updateModelViewMatrix(this.sphereModel.program, modelViewMatrix, "uModelViewMatrix");
        this.sphereModel.draw();
        modelViewMatrix = this.stack.pop();
    }
}

class Sun extends Celestial {
    constructor(app, texture = "sun-texture.png") {
        super(app, texture, 5.0, 0.0, -0.75);
        vec3.set(this.scale, 5.0, 5.0, 5.0);
    }
}

class Planet extends Celestial {
    constructor(app, texture = null, scale = 1.0, tRadius = 1.0, tSpeed = 1.0) {
        super(app, texture, scale, tRadius, tSpeed);
        this.moons = [];
        this.position = vec3.create();
    }

    draw(modelViewMatrix) {
        this.stack.push(mat4.clone(modelViewMatrix));
        
        // Calculate planet's position in orbit around the sun
        let angle = this.app.time * this.tSpeed;
        this.position[0] = this.tRadius * Math.cos(angle);
        this.position[1] = this.tRadius * Math.sin(angle);
        this.position[2] = 0.0; // Assuming orbit in the XY plane

        mat4.translate(modelViewMatrix, modelViewMatrix, this.position);
        
        // Draw the planet
        mat4.scale(modelViewMatrix, modelViewMatrix, this.scale);
        this.updateModelViewMatrix(this.sphereModel.program, modelViewMatrix, "uModelViewMatrix");
        this.sphereModel.draw();

        // Draw the moons relative to the planet's position
        for (let moon of this.moons) {
            this.stack.push(mat4.clone(modelViewMatrix));
            
            // Calculate moon's position in orbit around the planet
            let moonAngle = this.app.time * moon.tSpeed;
            let moonX = moon.tRadius * Math.cos(moonAngle);
            let moonY = moon.tRadius * Math.sin(moonAngle);
            let moonPosition = [moonX, moonY, 0.0];
            
            mat4.translate(modelViewMatrix, modelViewMatrix, moonPosition);
            
            // Scale and draw the moon
            mat4.scale(modelViewMatrix, modelViewMatrix, moon.scale);
            this.updateModelViewMatrix(moon.sphereModel.program, modelViewMatrix, "uModelViewMatrix");
            moon.sphereModel.draw();
            
            modelViewMatrix = this.stack.pop();
        }
        
        modelViewMatrix = this.stack.pop();
    }
}


class Moon extends Celestial {
    constructor(app, texture = null, scale = 0.5, tRadius = 1.0, tSpeed = 1.0) {
        super(app, texture, scale, tRadius, tSpeed);
    }
}
