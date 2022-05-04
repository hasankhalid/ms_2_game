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
let ground_height = 47;

let platform1;
let platform2;
let platform3;
let platform4;
let platform5;
let platform_height = 80;

let playerCollisionCateg = 0x0001; //Define collision category as bit fields. 
let playing = false; //Boolean to check if the sound files are currently playing
let soundsLoaded = false; //Boolean that checks if sound buffer is completely loaded.

let socket; //create a socket client variable.

let otherPlayers = []; //Define an array that will contain other players in the world
let platformArray = []; //Define an array that will contain platforms in this world.

let socketData;


//Declare gradient colors;
let dayColor1, dayColor2, nightColor1, nightColor2;

//Declare asset variables
let floorText, platformText, playerText, backgroundTexture_d, background_layer_cover, background_layer_cover_two, rock_grass;
let background_layer_night, background_cover_one_night, background_cover_two_night;

function preload() {
    floorText = loadImage('../assets/art/floor2.png');
    platformText = loadImage('../assets/art/platform.png');
    playerText = loadImage('../assets/art/character_me.png');
    backgroundTexture_d = loadImage('../assets/art/background_overflow.png');
    background_layer_cover = loadImage('../assets/art/first_background.png');
    background_layer_cover_two = loadImage('../assets/art/second_background.png');
    rock_grass = loadImage('../assets/art/rock_grass.png');
    background_layer_night = loadImage('../assets/art/background_night.png');
    background_cover_one_night = loadImage('../assets/art/first_background_night.png');
    background_cover_two_night = loadImage('../assets/art/second_bg_night.png');
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);
    rectMode(CENTER);
    engine = Engine.create();
    world = engine.world;

    socket = io.connect('http://localhost:3000');
    ground = new Ground(0,height/2-(ground_height*0.5), width * groundOverflowFactor,ground_height); //set camera movement to width
    player = new Player(-width/2 * (groundOverflowFactor/1.25),0,80,96, playerCollisionCateg);
    //console.log(-width/2 * (groundOverflowFactor/1.25));

    socketData = {
        x: -width/2 * (groundOverflowFactor/1.25),
        y: 0
    }
   // socket.on('position', function(data) {})


    platform1 = new Platform(-125,-50-(platform_height*0.5), 250,platform_height, track_arp); //set camera movement to width
    platform2 = new Platform(200,80-(platform_height*0.5), 250,platform_height, track_bass); //set camera movement to width
    platform3 = new Platform(-400,80-(platform_height*0.5), 250,platform_height, track_drums); //set camera movement to width
    platform4 = new Platform(500,-60-(platform_height*0.5), 250,platform_height, track_piano); //set camera movement to width
    platform5 = new Platform(900,100-(platform_height*0.5), 250,platform_height, track_vocals); //set camera movement to width

    let platforms = [platform1, platform2, platform3, platform4, platform5];
    platformArray.push(...platforms);

    // create runner
    runner = Runner.create();
    // run the engine
    Runner.run(runner, engine);

    camera = createCamera();
    camera.move((-width/2*groundOverflowFactor/2),0,0); //move the camera to the start of the scene

    //Define gradient colors;
    dayColor1 = color(168,98,82); //#A86252
    dayColor2 = color(214,124,104); //#D67C68
    nightColor1 = color(69,67,142); //#45438E
    nightColor2 = color(168,81,167); //#A851A7
}

function draw() {
    if (track_synth && track_arp && track_bass && track_drums && track_piano && track_vocals) {
        if (track_synth.loaded && track_arp.loaded && track_bass.loaded && track_drums.loaded && track_piano.loaded && track_vocals.loaded) {
            soundsLoaded = true;
        }
    }



    background(220);

   createGradientBackground('night');
    ground.show();


    for (let i = 0; i < platformArray.length; i++) { 
        platformArray[i].show(); //Loop through all all platforms and render them in space
        platformArray[i].activateColliderState(playerCollisionCateg); //Activate collider state for all platforms
        platformArray[i].checkCollision(); //Activate collider state for all platforms
    }

  /*  platform1.show();
    platform2.show();
    platform1.activateColliderState(playerCollisionCateg);
    platform2.activateColliderState(playerCollisionCateg);
    platform1.checkCollision();
    platform2.checkCollision(); */
    
    socket.emit('createAudience', socketData); //send Create Audience socket data, 
    socket.on('createAudience', createAudienceSprite); //If create audience data is received, create an audience sprite

    for (let i = 0; i < otherPlayers.length; i++) { 
        otherPlayers[i].show(); //Loop through all the other players and render them in the space
    }

    player.show(); //Show player after the other players are rendered so its on the top layer. 

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

    console.log(camera.eyeY);
    console.log(-height*0.6);

    if ((dist(player.body.position.x, player.body.position.y, player.body.position.x,-height/2) - player.h) < 40) {
        console.log();
        if (camera.eyeY > -height*0.68) {
            camera.move(0,-1.5,0); //move the camera Backward by cameraVelocity.
        }
    }
    else {
        if (camera.eyeY < 0) {
            camera.move(0, 1.5, 0)
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

function createGradientBackground(tod) {
    if (tod === 'day') {
        for (let i =-width; i < width/2 + (height/0.56); i+=(height/0.56)) {
            image(backgroundTexture_d,i,-height*1.2, (height/0.56), 1.8*height);
        }
        for (let i =-width; i < width; i+=width) {
            image(background_layer_cover,i,-75, width, 350);
            image(background_layer_cover_two,i,-60, width, 410);
            image(rock_grass,i,height/2 - 150 - ground_height + 5, width, 150);
        }
    }   
    else {
        for (let i =-width; i < width/2 + (height/0.56); i+=(height/0.56)) {
            image(background_layer_night,i,-height*1.2, (height/0.56), 1.8*height);
        }
        for (let i =-width; i < width; i+=width) {
            image(background_cover_one_night,i,-75, width, 350);
            image(background_cover_two_night,i,-60, width, 410);
            image(rock_grass,i,height/2 - 150 - ground_height + 5, width, 150);
        }
    }
}