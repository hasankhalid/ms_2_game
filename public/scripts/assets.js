function Ground(x,y,w,h) {
    let options = {
        isStatic: true
    }
    this.body = Bodies.rectangle(x,y,w,h, options);
    this.w = w;
    this.h = h;

    //add our body to the world so that this body has physics applied to it.
    Composite.add(world, [this.body]);

    this.show = function() {
        let position = this.body.position;

        push(); //Use push and pop to assign the body its own layer.
            noStroke();
            fill(50);
            translate(position.x, position.y); //translate to position;
            rect(0,0, this.w, this.h); 
        pop();
    }
}

function Platform(x,y,w,h, audio_var) {
    let options = {
        isStatic: true,
        collisionFilter: {
            mask: null,
        }
    }
    this.body = Bodies.rectangle(x,y,w,h, options);
    this.w = w;
    this.h = h;
    this.audio_var = audio_var;

    //add our body to the world so that this body has physics applied to it.
    Composite.add(world, [this.body]);

    this.show = function() {
        let position = this.body.position;

        push(); //Use push and pop to assign the body its own layer.
            noStroke();
            fill(50);
            translate(position.x, position.y); //translate to position;
            rect(0,0, this.w, this.h); 
        pop();
    }

    this.activateColliderState = function(category) {
        if (player.body.velocity.y > 0) {
            this.body.collisionFilter.mask = category
        }
        else {
            this.body.collisionFilter.mask = null
        }
    }

    this.checkCollision = function () { //Work on this function it is not correctly implemented
        let collisionState = Collision.collides(this.body, player.body);
        if (collisionState) {
            if (collisionState.collided) {
                if (keyIsPressed) {
                    if (keyCode === 65) {
                        this.audio_var.volume.value = lerp(this.audio_var.volume.value, 0, 0.05);
                    }
                    else if (keyCode === 83) {
                        this.audio_var.volume.value = lerp(this.audio_var.volume.value, -100, 0.005);
                    }
                }
            }
        }
    }
}

function Player(x,y,w,h, category) {
    let options = {
        friction: 0.1, //hinderance in movement in space
        restitution: 0, //restitution will control the bounciness of the body.
        inertia: Infinity,
        collisionFilter: {
            category: category,
        }
    }
    this.body = Bodies.rectangle(x,y,w,h, options);
    this.w = w;
    this.h = h;

    //add our body to the world so that this body has physics applied to it.
    Composite.add(world, [this.body]);

    this.show = function() {
        let position = this.body.position;
        let angle = this.body.angle;
        
        push(); //Use push and pop to assign the body its own layer.
        //    rotate(angle);
            translate(position.x, position.y); //translate to position;
            rect(0,0, this.w, this.h); 
        pop();
    }

    this.grounded = function() {
        let isGrounded = false;
        if (Matter.Collision.collides(this.body, ground.body)) {
            isGrounded = Matter.Collision.collides(this.body, ground.body).collided;
        }
        return isGrounded;
    }

    this.platformGrounded = function() {
        let isGrounded = false;
        if (Matter.Collision.collides(this.body, platform1.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform1.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform2.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform2.body).collided;
        }
        return isGrounded;
    }

    this.jump = function() {
        if (this.grounded()) {
            Body.setVelocity(this.body, { x: 0, y: -15 });
        }
        if (this.platformGrounded()) {
            Body.setVelocity(this.body, { x: 0, y: -13 });
        }
    }

    this.move = function(direction, velocityStand, jumpVelocity) {
        let currPos = this.body.position
        let velocity;
        this.grounded() ? velocity = velocityStand : velocity = jumpVelocity; //if the object is jumping make it move forward with higher velocity
        if (direction === 'forward') {
            let allowedToMove = currPos.x + (this.w/2) < groundOverflowFactor * (0.5*width);
            if (allowedToMove) {
                Body.setPosition(this.body, { x: currPos.x + velocity, y: currPos.y }); //Add velocity if moving forward
                
                let socketData = {
                    x: currPos.x + velocity,
                    y: currPos.y
                }
                socket.emit('position', socketData);
            }
        }
        else {
            let allowedToMove = currPos.x - (this.w/2) > groundOverflowFactor * (0.5*width* -1);
            if (allowedToMove) {
                Body.setPosition(this.body, { x: currPos.x - velocity, y: currPos.y });  //Decrease velocity if moving backward
                let socketData = {
                    x: currPos.x + velocity,
                    y: currPos.y
                }
                socket.emit('position', socketData);
            }
        }
    }
}


function Audience(x,y,w,h, category, id) {
    let options = {
        friction: 0.1, //hinderance in movement in space
        restitution: 0, //restitution will control the bounciness of the body.
        inertia: Infinity,
        collisionFilter: {
            category: category,
        }
    }
    this.id = id;
    this.body = Bodies.rectangle(x,y,w,h, options);
    this.w = w;
    this.h = h;
    this.shown = false;

    //add our body to the world so that this body has physics applied to it.
    Composite.add(world, [this.body]);

    this.show = function() {

            let position = this.body.position;
            push(); //Use push and pop to assign the body its own layer.
                fill("#222");
                translate(position.x, position.y); //translate to position;
                rect(0,0, this.w, this.h); 
            pop();
            this.shown = true;
    }

    this.grounded = function() {
        let isGrounded = false;
        if (Matter.Collision.collides(this.body, ground.body)) {
            isGrounded = Matter.Collision.collides(this.body, ground.body).collided;
        }
        return isGrounded;
    }

    this.platformGrounded = function() {
        let isGrounded = false;
        if (Matter.Collision.collides(this.body, platform1.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform1.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform2.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform2.body).collided;
        }
        return isGrounded;
    }

    this.jump = function() {
        if (this.grounded()) {
            Body.setVelocity(this.body, { x: 0, y: -15 });
        }
        if (this.platformGrounded()) {
            Body.setVelocity(this.body, { x: 0, y: -13 });
        }
    }

    this.move = function(x, y) {
        Body.setPosition(this.body, { x: x, y: y });
    } 
}