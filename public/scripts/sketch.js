let Engine = Matter.Engine,  //Module alias
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Collision = Matter.Collision,
    Composite = Matter.Composite;

//camera
let camera;
let cameraVelocity = 1.7;

//matter.js variables below
let engine;
let world;
let runner;

//body variables below.
let player; 
let playerVelocity = 2.5;
let playerJumpVelocity = 3.5;
let ground;
let groundOverflowFactor = 2; //This factor determines the rate at which the ground will overflow the screen

let platform1;
let platform2;
let platform_height = 10;

let playerCollisionCateg = 0x0001; //Define collision category as bit fields. 

let playing = false; //Boolean to check if the sound files are currently playing
let soundsLoaded = false; //Boolean that checks if sound buffer is completely loaded.

let socket; //create a socket client variable.

let otherPlayers = [];

let socketData;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);
    rectMode(CENTER);
    engine = Engine.create();
    world = engine.world;

    socket = io.connect('http://localhost:3000');

    let ground_height = 20;
    ground = new Ground(0,height/2-(ground_height*0.5), width * groundOverflowFactor,ground_height); //set camera movement to width
    player = new Player(-width/2 * (groundOverflowFactor/1.25),0,80,80, playerCollisionCateg);
    //console.log(-width/2 * (groundOverflowFactor/1.25));

    socketData = {
        x: -width/2 * (groundOverflowFactor/1.25),
        y: 0
    }
   // socket.on('position', function(data) {})


    platform1 = new Platform(-125,-50-(platform_height*0.5), 200,platform_height, track_arp); //set camera movement to width
    platform2 = new Platform(200,80-(platform_height*0.5), 150,platform_height, track_bass); //set camera movement to width

    // create runner
    runner = Runner.create();
    // run the engine
    Runner.run(runner, engine);

    camera = createCamera();
    camera.move((-width/2*groundOverflowFactor/2),0,0); //move the camera to the start of the scene
}

function draw() {
    background(200);

    if (track_synth && track_arp && track_bass && track_drums) {
        if (track_synth.loaded && track_arp.loaded && track_bass.loaded && track_drums.loaded) {
            soundsLoaded = true;
        }
    }

    ground.show();

    platform1.show();
    platform2.show();
    platform1.activateColliderState(playerCollisionCateg);
    platform2.activateColliderState(playerCollisionCateg);
    platform1.checkCollision();
    platform2.checkCollision();
    
    player.show();

    socket.emit('createAudience', socketData);
    socket.on('createAudience', createAudienceSprite);

    for ( let i = 0; i < otherPlayers.length; i++) {
        otherPlayers[i].show();
    }

    socket.on('position', moveAudienceElem);

    if (keyIsPressed) {
        movePlayer(keyCode);
    }

    if (soundsLoaded) {
        if (!playing) {
            track_synth.start();
            track_arp.start();
            track_bass.start();
            track_drums.start();
            playing = true;
        }
    }

    if ((dist(player.body.position.x, player.body.position.y, 0,-height/2) - player.h) < 150) {
        camera.move(0,-1,0); //move the camera Backward by cameraVelocity.
    }
    else {
        if (camera.eyeY < 0) {
            camera.move(0, 1, 0)
        } 
    }

    //map ground movement to filter on synth here.
    let playerXpos = player.body.position.x;
    let minimumXpos = floor(-width/2*groundOverflowFactor + player.w/2);
    let maximumXpos = width/2*groundOverflowFactor - player.w/2;
    let freqMapping = map(playerXpos, minimumXpos, maximumXpos, 0, 22000);
    freqMapping > 0 ? freqMapping = freqMapping : freqMapping = 0;

    synth_filter.frequency.rampTo(freqMapping,2);
}

function keyPressed() {
    if (keyCode === 32) {
        player.jump();
    }
}

function movePlayer(code) {
    if (code === 39) {
        player.move('forward', playerVelocity, playerJumpVelocity);
        let edgeDistance = dist(width*groundOverflowFactor, 0, camera.eyeX+width, 0) - (width*groundOverflowFactor/4);
        if (edgeDistance > 5) {
            camera.move(cameraVelocity,0,0); //move the camera Forward by forward Velocity
        }
    }
    if (code === 37) {
        player.move('backward', playerVelocity, playerJumpVelocity);
        let edgeDistance = dist(0, 0, camera.eyeX, 0) - (width*groundOverflowFactor/4);
        if (edgeDistance < -4) {
            camera.move(-cameraVelocity,0,0); //move the camera Backward by cameraVelocity.
        }
    }
}

function createAudienceSprite(data) {
    let checkComponent = otherPlayers.filter(obj => {
        return obj.id === data.id
    });

    if (checkComponent.length === 0) {
        let audience = new Audience(data.x,data.y,80,80, playerCollisionCateg, data.id);
        otherPlayers.push(audience);
    }
}

function moveAudienceElem(data) {
    let audience = otherPlayers.filter(obj => {
        return obj.id === data.id
    });
    audience = audience[0];
    if (audience && audience.shown) {
        audience.move(data.x, data.y)
    }
}
