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
            translate(position.x, position.y); //translate to position;
          //  rect(0,0, this.w, this.h); 
            imageMode(CENTER)
          //  image(floorText,0,0, 333, this.h);
            for (let i =-this.w/2; i < this.w/2 + 333; i+=333) {
                image(floorText,i,0, 333, this.h); 
            }
        pop();
    }
}

function Platform(x,y,w,h) {
    let options = {
        isStatic: true,
        collisionFilter: {
            mask: null,
        }
    }
    this.body = Bodies.rectangle(x,y,w,h, options);
    this.w = w;
    this.h = h;

    this.numberofStars = random([2,3]);
    this.coins = [];

    //add our body to the world so that this body has physics applied to it.
    Composite.add(world, [this.body]);

    this.show = function() {
        let position = this.body.position;

        push(); //Use push and pop to assign the body its own layer.
            translate(position.x, position.y); //translate to position;
            imageMode(CENTER)
            image(platformText,0,-this.h/4.2, 275, this.h); 

            //render coins for this paltform
            for (let i = 0; i < this.coins.length; i++) {
                this.coins[i].show();
                this.coins[i].checkCollision(position.x, position.y);
            } 
        pop();
    }

    this.createCoins = function() {
        let spreadCoinsOver = 230;
        //We are centered therefore we are removing half of spreadcounter distance. Otherwise coins will start at the center of platform. 
        let stepSize = spreadCoinsOver/this.numberofStars;
        let df = this.numberofStars === 3 ? 75 : 55;  
        for (let i = 0; i < this.numberofStars; i++) {
            this.coins.push(new Coin(stepSize*i, y, 55, 55, df));
        }
    }

    this.activateColliderState = function(category) {
        if (player.body.velocity.y > 0) {
            this.body.collisionFilter.mask = category
        }
        else {
            this.body.collisionFilter.mask = null
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
            group: -1
        }
    }
    this.body = Bodies.rectangle(x,y,w,h, options);
    this.w = w;
    this.h = h;
    this.visible = false;

    //add our body to the world so that this body has physics applied to it.
    Composite.add(world, [this.body]);


    this.show = function() {
        let position = this.body.position;
        
        push(); //Use push and pop to assign the body its own layer.
            translate(position.x, position.y); //translate to position;
          //  rect(0,0, this.w, this.h); 
            imageMode(CENTER)
            image(playerText,0,0, this.w, this.h); 
        pop();
        this.visible = true;
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
        else if (Matter.Collision.collides(this.body, platform3.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform3.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform4.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform4.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform5.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform5.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform6.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform6.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform7.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform7.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform8.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform8.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform9.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform9.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform10.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform10.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform11.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform11.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform12.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform12.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform_lead.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform_lead.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform_zen.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform_zen.body).collided;
        }
        return isGrounded;
    }

    this.jump = function() {
        if (player.visible) {
            if (this.grounded()) {
                Body.setVelocity(this.body, { x: 0, y: -16 });
            }
            if (this.platformGrounded()) {
                Body.setVelocity(this.body, { x: 0, y: -13.7 });
            }
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
            group: -1
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
        else if (Matter.Collision.collides(this.body, platform3.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform3.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform4.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform4.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform5.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform5.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform6.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform6.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform7.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform7.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform8.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform8.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform9.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform9.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform10.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform10.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform11.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform11.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform12.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform12.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform_lead.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform_lead.body).collided;
        }
        else if (Matter.Collision.collides(this.body, platform_zen.body)) {
            isGrounded = Matter.Collision.collides(this.body, platform_zen.body).collided;
        }
        return isGrounded;
    }

    this.jump = function() {
        if (this.grounded()) {
            Body.setVelocity(this.body, { x: 0, y: -14 });
        }
        console.log(this.platformGrounded());
        if (this.platformGrounded()) {
            Body.setVelocity(this.body, { x: 0, y: -12.5 });
        }
    }

    this.move = function(x, y) {
        Body.setPosition(this.body, { x: x, y: y });
    } 
}

function Coin(x,y,w,h, df) {
    this.w = w;
    this.h = h;
    this.variant = random(['red', 'blue']);
    this.x = x;
    this.startX = x;
    this.df = df; //df is defined as difference factor. Based on the number of collectables on a platform ( it will check how much needs to be substracted from the x value to bring the element into the center of the platform)
    this.df_h = random([1.5, 3, 3.25, 3.7]); //defined as the difference of height for the coin.
    this.respawnStatus = false;
    this.maxrespawn = random([2,3,4,5,6,7]);
    this.respawnCount = 0;
    this.respawnDuration = random([6000,7000,9000,11000]);
    this.myProb = random();
    this.currentCoinTotal = 0;

    this.show = function() {
        push(); //Use push and pop to assign the body its own layer.
            imageMode(CENTER);
            this.variant === 'red' ? image(coin1, this.x - this.df,-this.df_h*this.h, this.w, this.h) : image(coin2,this.x - this.df,-this.df_h*this.h, this.w, this.h); 
        pop();
    }

    this.checkCollision = function (platform_xoff, platform_yoff) {
        let x_off = platform_xoff + (this.x - df); 
        let y_off = platform_yoff + (-this.df_h*this.h);
        let player_y = player.body.position.y + player.h/2;
        let player_x = player.body.position.x + player.w/2;

        if ((player_x > x_off && player_x < (x_off + this.w)) && (player_y > y_off && (player_y < (y_off + this.h)))) {
            this.x = -5*width;
            this.variant === 'red' ? redCoinCount++ : blueCoinCount++;
            this.respawnStatus = true;
            this.respawnCount++;
            this.myProb = random();
            if (this.myProb > 0.3 && this.respawnCount < this.maxrespawn) {
                console.log('Red: ' + redCoinTotal);
                console.log('Blue: ' + blueCoinTotal);
                this.variant === 'red' ? redCoinTotal++ : blueCoinTotal++;
            }
        }

        if (this.x === -5*width && this.respawnStatus && this.respawnCount < this.maxrespawn) {
            const parent = this;
            setTimeout(function () {
                if (parent.myProb > 0.3) {
                    parent.x = parent.startX;
                    parent.respawnDuration = random([6000,7000,9000,11000]);
                    parent.variant === 'red' ? renderTotalRed = redCoinTotal : renderTotalBlue = blueCoinTotal;
                }
            }, this.respawnDuration);
            this.respawnStatus = false;
        }
    } 
}

function Ghost(x,y,w,h, category, variant) {
    let options = {
        isStatic: true,
        friction: 1, //hinderance in movement in space
        restitution: 0, //restitution will control the bounciness of the body.
        inertia: Infinity,
        collisionFilter: {
            category: category,
            group: -1
        }
    }
    this.prevGhostCollisionState = null;
    this.body = Bodies.rectangle(x,y,w,h, options);
    this.w = w * 0.5;
    this.h = h;
    this.x = x;
    this.y = y;
    this.ghostDirection = random([1, -1]);
    this.movementFactor = variant === 'restrict' ? 20 : 50;

    //add our body to the world so that this body has physics applied to it.
    Composite.add(world, [this.body]);


    this.show = function() {
        let position = this.body.position;
        
        push(); //Use push and pop to assign the body its own layer.
            translate(position.x, position.y); //translate to position;
            imageMode(CENTER)
            image(ghost,0,0, this.w * 2, this.h); 
        pop();
    }


    this.move = function() {
        let movement = sin(frameCount * 0.03) * this.movementFactor;
        this.body.position.x = this.x + movement * this.ghostDirection;

        if (this.prevGhostCollisionState === null) {
            if ((Matter.Collision.collides(this.body, player.body))) {
                this.prevGhostCollisionState = (Matter.Collision.collides(this.body, player.body));
                ghostSceneEnable === false ? ghostSceneEnable = true : ghostSceneEnable = false;
                ghostSceneEnable === false ? currentTheme = theme : currentTheme = 'ghost';
                console.log((Matter.Collision.collides(this.body, player.body)));
            }
        }
        else {
            if ((Matter.Collision.collides(this.body, player.body)) === null) {
                this.prevGhostCollisionState = null;
            }
        }
    }
}

function PlatformLead(x,y,w,h, variant) {
    let options = {
        isStatic: true,
        collisionFilter: {
            mask: null,
        }
    }
    this.body = Bodies.rectangle(x,y,w,h, options);
    this.w = w;
    this.h = h;
    this.variant = variant;

    this.numberofStars = random([2,3]);

    //add our body to the world so that this body has physics applied to it.
    Composite.add(world, [this.body]);

    this.show = function() {
        let position = this.body.position;

        push(); //Use push and pop to assign the body its own layer.
            translate(position.x, position.y); //translate to position;
            imageMode(CENTER)
            image(platformLead,0,-this.h/4.2, 275, this.h); 
            push(); //Use push and pop to assign the body its own layer.
                imageMode(CENTER);
                this.variant === 'dj' ? image(dj, 0,-80, 100, 80) : image(zen, 0,-80, 80, 90); 
            pop();
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

    this.checkCollision = function() {
        if (leadCollisionState === null) {
            if ((Matter.Collision.collides(this.body, player.body))) {
                leadCollisionState = (Matter.Collision.collides(this.body, player.body));
                leadTrackEnable === false ? leadTrackEnable = true : leadTrackEnable = false;
            }
        }
        else {
            if ((Matter.Collision.collides(this.body, player.body)) === null) {
                leadCollisionState = null;
            }
        }
    }

    this.zenCollision = function() {
        if (zenCollisionState === null) {
            if ((Matter.Collision.collides(this.body, player.body))) {
                zenCollisionState = (Matter.Collision.collides(this.body, player.body));
                zenMode === false ? zenMode = true : zenMode = false;
            }
        }
        else {
            if ((Matter.Collision.collides(this.body, player.body)) === null) {
                zenCollisionState = null;
            }
        }
    }
}

function Amp(x,y,w,h, category) {
    let options = {
        isStatic: true,
        friction: 1, //hinderance in movement in space
        restitution: 0, //restitution will control the bounciness of the body.
        inertia: Infinity,
        collisionFilter: {
            category: category,
            group: -1
        }
    }
    this.prevGhostCollisionState = null;
    this.body = Bodies.rectangle(x,y,w,h, options);
    this.w = w * 0.5;
    this.h = h;
    this.x = x;
    this.y = y;

    //add our body to the world so that this body has physics applied to it.
    Composite.add(world, [this.body]);


    this.show = function() {
        let position = this.body.position;
        
        push(); //Use push and pop to assign the body its own layer.
            translate(position.x, position.y); //translate to position;
            imageMode(CENTER);
            melodyVariantEnable === false ? image(amp,0,0, this.w * 2, this.h) : image(ampFilled,0,0, this.w * 2, this.h);
            ; 
        pop();
    }


    this.checkCollision = function() {
        if (this.prevGhostCollisionState === null) {
            if ((Matter.Collision.collides(this.body, player.body))) {
                this.prevGhostCollisionState = (Matter.Collision.collides(this.body, player.body));
                melodyVariantEnable === false ? melodyVariantEnable = true : melodyVariantEnable = false;
            }
        }
        else {
            if ((Matter.Collision.collides(this.body, player.body)) === null) {
                this.prevGhostCollisionState = null;
            }
        }
    }
}