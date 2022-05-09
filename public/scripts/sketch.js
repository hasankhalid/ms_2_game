let Engine = Matter.Engine,  //Module alias
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Collision = Matter.Collision,
    Composite = Matter.Composite;

//camera
let camera;
let cameraVelocity = 1.9;

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
let platform6;
let platform7;
let platform8;
let platform9;
let platform10;
let platform11;
let platform_height = 80;

let playerCollisionCateg = 0x0001; //Define collision category as bit fields. 
let playing = false; //Boolean to check if the sound files are currently playing
let soundsLoaded = false; //Boolean that checks if sound buffer is completely loaded.

let socket; //create a socket client variable.

let otherPlayers = []; //Define an array that will contain other players in the world
let platformArray = []; //Define an array that will contain platforms in this world.

let socketData;

//Declare asset variables
let floorText, platformText, playerText, backgroundTexture_d, background_layer_cover, background_layer_cover_two, rock_grass;
let background_layer_night, background_cover_one_night, background_cover_two_night, sun, moon;
let dayLoad, nightLoad, dayClick, nightClick, ghost, dj, zen, ghostCharacter, platformLead;
let ghostSceneEnable = false;
let prevGhostCollisionState = null;
let platform_lead;

let redCoinTotal = 0; 
let blueCoinTotal = 0;

let redCoinCount = 0;
let blueCoinCount = 0;

let font;

let theme = 'night';
let currentTheme;

let menuY;

let melodyPlaying = true;
let melodyVariantEnable = false;

let leadCollisionState = null;
let leadTrackEnable = false;
let zenCollisionState = null;
let zenMode;

let amp, ampFilled;
let melodyAmp;

let ghostsArray = [];

function preload() {
    floorText = loadImage('../assets/art/floor2.png');
    platformText = loadImage('../assets/art/platform.png');
    platformLead = loadImage('../assets/art/lead_platform.png')
    playerText = loadImage('../assets/art/character_me.png');
    backgroundTexture_d = loadImage('../assets/art/background_overflow.png');
    background_layer_cover = loadImage('../assets/art/first_background.png');
    background_layer_cover_two = loadImage('../assets/art/second_background.png');
    rock_grass = loadImage('../assets/art/rock_grass.png');
    background_layer_night = loadImage('../assets/art/background_night.png');
    background_cover_one_night = loadImage('../assets/art/first_background_night.png');
    background_cover_two_night = loadImage('../assets/art/second_bg_night.png');
    background_layer_ghost = loadImage('../assets/art/ghost_bg.png');
    background_cover_one_ghost = loadImage('../assets/art/ghost_bg_1.png');
    background_cover_two_ghost = loadImage('../assets/art/ghost_bg_2.png');
    sun = loadImage('../assets/art/sun.png');
    moon = loadImage('../assets/art/moon.png');
    coin1 = loadImage('../assets/art/speaker1.png');
    coin2 = loadImage('../assets/art/speaker2.png');
    font = loadFont("../assets/type/Raleway-SemiBold.ttf");
    dayLoad = loadImage('../assets/art/load/LoadDay.png');
    nightLoad = loadImage('../assets/art/load/LoadNight.png');
    dayClick = loadImage('../assets/art/load/ClickDay.png');
    nightClick = loadImage('../assets/art/load/ClickNight.png');
    ghost = loadImage('../assets/art/ghost.png');
    dj = loadImage('../assets/art/dj.png');
    zen = loadImage('../assets/art/zen.png');
    amp = loadImage('../assets/art/effectPedal.png');
    ampFilled = loadImage('../assets/art/effectPedalEnable.png');
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);
    rectMode(CENTER);
    ellipseMode(CENTER);
    engine = Engine.create();
    world = engine.world;

    socket = io.connect('http://localhost:3000');
    ground = new Ground(0,height/2-(ground_height*0.5), width * groundOverflowFactor,ground_height); //set camera movement to width
    player = new Player(-width/2 * (groundOverflowFactor/1.25),0,80,96, playerCollisionCateg);
    ghostCharacter = new Ghost(width/2 * (groundOverflowFactor/1.35),height/2-85,70,74.29, playerCollisionCateg, 'mover');
    melodyAmp = new Amp(0,height/2-85,70,93, playerCollisionCateg);

    socketData = {
        x: -width/2 * (groundOverflowFactor/1.25),
        y: 0
    }
   // socket.on('position', function(data) {})


    platform1 = new Platform(-900,100-(platform_height*0.5), 250,platform_height); //set camera movement to width
    platform2 = new Platform(-520,-120-(platform_height*0.5), 250,platform_height); //set camera movement to width
    platform3 = new Platform(-200,-300-(platform_height*0.5), 250,platform_height); //set camera movement to width
    platform4 = new Platform(-150,150-(platform_height*0.5), 250,platform_height); //set camera movement to width
    platform5 = new Platform(160,-550-(platform_height*0.5), 250,platform_height); //set camera movement to width
    platform6 = new Platform(550,60-(platform_height*0.5), 250,platform_height); //set camera movement to width
    platform7 = new Platform(960,-120-(platform_height*0.5), 250,platform_height); //set camera movement to width
    platform8 = new Platform(930,-370-(platform_height*0.5), 250,platform_height); //set camera movement to width
    platform9 = new Platform(300,-130-(platform_height*0.5), 250,platform_height); //set camera movement to width
    platform10 = new Platform(-1050,-140-(platform_height*0.5), 250,platform_height); //set camera movement to width
    platform11 = new Platform(1100,75-(platform_height*0.5), 250,platform_height); //set camera movement to width
    platform12 = new Platform(-150,-730-(platform_height*0.5), 250,platform_height); //set camera movement to width
    platform_lead = new PlatformLead(-520,-850-(platform_height*0.5), 250,platform_height, 'dj');
    platform_zen = new PlatformLead(200,-975-(platform_height*0.5), 250,platform_height, 'zen');

   // platform5 = new Platform(500,-60-(platform_height*0.5), 250,platform_height, track_piano); //set camera movement to width

    let platforms = [platform1, platform2, platform3, platform4, platform5, platform6, platform7, platform8, platform9, platform10, platform11, platform12];
    platformArray.push(...platforms);

    for (let i = 0; i < platformArray.length; i++) { 
        platformArray[i].createCoins();
    }

    for (let i = 0; i < platformArray.length; i++) {
        redCoinTotal += platformArray[i].coins.filter((obj) => obj.variant === 'red').length;
        blueCoinTotal += platformArray[i].coins.filter((obj) => obj.variant === 'blue').length;
        let noCoinsOnFloor = platformArray[i].coins.filter((obj) => obj.df_h < 3);
        console.log(noCoinsOnFloor);
        if (noCoinsOnFloor.length === 0) {
            if (random() < 0.3) {
                let bodyC = platformArray[i].body.position;
                let heightP = platformArray[i].h;
                ghostsArray.push(new Ghost(bodyC.x,bodyC.y - (0.5*heightP) - 42 ,70,74.29, playerCollisionCateg, 'restrict'));
            }
        } 
    }

    renderTotalRed = redCoinTotal;
    renderTotalBlue = blueCoinTotal;

    // create runner
    runner = Runner.create();
    // run the engine
    Runner.run(runner, engine);

    camera = createCamera();
    camera.move((-width/2*groundOverflowFactor/2),0,0); //move the camera to the start of the scene

    textFont(font);

    theme = random(['day', 'night']);
    currentTheme = theme;

    menuY = -height/2;
    sceneClicked = false;
}

function draw() {
    createGradientBackground(currentTheme);
    ground.show();

    for (let i = 0; i < platformArray.length; i++) { 
        platformArray[i].show(); //Loop through all all platforms and render them in space
        platformArray[i].activateColliderState(playerCollisionCateg); //Activate collider state for all platforms
    }

    platform_lead.show();
    platform_lead.activateColliderState(playerCollisionCateg);
    platform_lead.checkCollision();

    platform_zen.show();
    platform_zen.activateColliderState(playerCollisionCateg);
    platform_zen.zenCollision();

    socket.emit('createAudience', socketData); //send Create Audience socket data, 
    socket.on('createAudience', createAudienceSprite); //If create audience data is received, create an audience sprite

    for (let i = 0; i < otherPlayers.length; i++) { 
        otherPlayers[i].show(); //Loop through all the other players and render them in the space
    }

    if (!soundsLoaded || !sceneClicked || menuY < 0.5*height) {
        for (let i =-width; i < width/2 + (height/0.56); i+=(height/0.56)) {
            if (!soundsLoaded) { 
                push(); 
                    theme === 'night' ? image(nightLoad,i,menuY, 1.7858*height, height) : image(dayLoad,i,menuY, 1.7858*height, height);
                pop();
            }
            else {
                push(); 
                    theme === 'night' ? image(nightClick,i,menuY, 1.7858*height, height) : image(dayClick,i,menuY, 1.7858*height, height);
                pop(); 
            }
        }
    }
    else {
        ghostCharacter.show();
        ghostCharacter.move();

        melodyAmp.show();
        melodyAmp.checkCollision();

        if (ghostsArray.length > 0) {
            for (let i = 0; i < ghostsArray.length; i++) {
                ghostsArray[i].show();
                ghostsArray[i].move();
            }
        } 

        player.show(); //Show player after the other players are rendered so its on the top layer. 

        socket.on('position', moveAudienceElem);
    
        if (keyIsPressed) {
            movePlayer(keyCode);
        }

        if (!playing) {
            audio_tracks.forEach(track => track.start()); //Start playing all tracks once loaded
            playing = true;
        }
    }

    if (sceneClicked) {
        Tone.start();
        menuY = lerp(menuY, 0.85*height, 0.025);
        let redString = 'Red: ' + redCoinCount + '/' + renderTotalRed;
        let blueString = 'Blue: ' + blueCoinCount + '/' + renderTotalBlue; 
        text(redString, camera.eyeX - width/2.2, camera.eyeY - height/2.2);
        text(blueString, camera.eyeX  - width/2.2, camera.eyeY - height/2.35);
    }

    //Updated camera follow with lerp
    if (camera.eyeY <= 1) {
            let lerpedPosition = lerp(camera.eyeY, player.body.position.y, 0.08);
            if (lerpedPosition < 1) {
                camera.setPosition(camera.eyeX, lerpedPosition, camera.eyeZ);
            }
    }

    //map ground movement to filter on synth here.
    let playerXpos = player.body.position.x;
    let minimumXpos = floor(-width/2*groundOverflowFactor + player.w/2);
    let maximumXpos = width/2*groundOverflowFactor - player.w/2;
    let freqMapping = map(playerXpos, minimumXpos, maximumXpos, 0, 22000);
    let synthVerbMapping = map(playerXpos, minimumXpos, maximumXpos, 1, 0);
    freqMapping > 0 ? freqMapping = freqMapping : freqMapping = 0;

    synth_filter.frequency.rampTo(floor(freqMapping),2);
    synthVerbMapping > 1 ? synthVerbMapping = 1 : synthVerbMapping = synthVerbMapping;
    synthVerbMapping < 0 ? synthVerbMapping = 0 : synthVerbMapping = synthVerbMapping;
    synth_verb.wet.value = synthVerbMapping;


    let totalProgress = (blueCoinCount + redCoinCount) / (blueCoinTotal + redCoinTotal);
    let melodyVolumeMapping = totalProgress < 0.7 ? map(totalProgress, 0, 0.7, -50, 0) : 0;
    let melodyVerbMapping = totalProgress < 0.7 ? map(totalProgress, 0, 0.7, 1, 0) : 0;
    let melodyDelayMapping = totalProgress < 0.7 ? map(totalProgress, 0, 0.7, 1, 0) : 0;
    let lerpedMelodyVolume = lerp(backgroundArp.volume.value, melodyVolumeMapping, 0.05);
    bg_arp_verb.wet.value = melodyVerbMapping;
    bg_arp_delay.wet.value = melodyDelayMapping;
    backgroundArp.volume.value = lerpedMelodyVolume;

    let bassVolumeMapping = totalProgress < 0.7 ? map(totalProgress, 0, 0.7, -75, 0) : 0;
    let lerpedBassVolume = lerp(bass.volume.value, bassVolumeMapping, 0.05);
    bass.volume.value = lerpedBassVolume;


    let drumVolumeMapping = totalProgress < 1 ? map(totalProgress, 0, 1, -80, 0) : 0;
    let drumFilterMapping = totalProgress < 0.7 ? map(totalProgress, 0, 0.7, 22000, 0) : 0;
    drums_filter.frequency.rampTo(floor(drumFilterMapping),2);
    let drumVerbMapping = totalProgress < 0.7 ? map(totalProgress, 0, 0.7, 1, 0) : 0;
    drums_verb.wet.value = drumVerbMapping;
    let lerpedDrumVolume = lerp(drums.volume.value, drumVolumeMapping, 0.05);
    drums.volume.value = lerpedDrumVolume;


    if (melodyPlaying) {
        let track, trackHigh, trackLow;
        melodyVariantEnable === true ? trackHigh = melodyVariantHigh : trackHigh = melodyLeadHigh;
        melodyVariantEnable === true ? trackLow = melodyVariantLow : trackLow = melodyLeadLow;
        melodyVariantEnable === true ? track = melodyVariant : track = melodyLeadNormal;

        let highMapping = map(player.body.position.y, -0.9*height, -height*0.1, 0, -70);
        highMapping > 0 ? highMapping = 0 : highMapping = highMapping;
        highMapping < -70 ? highMapping = -70 : highMapping = highMapping;
        trackHigh.volume.value = highMapping;
    
        let normalMapping;
        if (player.body.position.y < -height * 0.7) {
            normalMapping = map(player.body.position.y, -height*1.4, -height*0.7, -70, 0);
        }
        else {
            normalMapping = map(player.body.position.y, -height*0.7, height*0.4, 0, -40);
        }
        normalMapping > 0 ? normalMapping = 0 : normalMapping = normalMapping;
        normalMapping < -70 ? normalMapping = -70 : normalMapping = normalMapping;
        track.volume.value = normalMapping;
    
        let lowMapping = map(player.body.position.y, -height*1.2, height/2 - 100, -30, 0);
        lowMapping > 0 ? lowMapping = 0 : lowMapping = lowMapping;
        lowMapping < -70 ? lowMapping = -70 : lowMapping = lowMapping;
        trackLow.volume.value = lowMapping;
    }

 //   let lerpedMelodyVolume = lerp(backgroundArp.volume.value, melodyVolumeMapping, 0.05);


}

function keyPressed() {
    if (keyCode === 32) {
        player.jump();
        if (!sceneClicked) {
            sceneClicked = true;
            console.log(sceneClicked);
        }
    }
}

function movePlayer(code) {
    if (code === 39) {
        player.move('forward', playerVelocity, playerJumpVelocity);
        let edgeDistanceR = dist(width*groundOverflowFactor, 0, camera.eyeX+width, 0) - (width*groundOverflowFactor/4);
        let edgeDistanceL = (width*groundOverflowFactor/4) - dist(0, 0, player.body.position.x, 0);
        if (edgeDistanceR > 0 && edgeDistanceL > -28) {
          //  camera.move(cameraVelocity,0,0); //move the camera Forward by forward Velocity
                let lerpedPosition = lerp(camera.eyeX, player.body.position.x, 0.08);
                camera.setPosition(lerpedPosition, camera.eyeY, camera.eyeZ);
                
        } 

    }
    if (code === 37) {
        player.move('backward', playerVelocity, playerJumpVelocity);
      //  let edgeDistance = (width*groundOverflowFactor/4) - dist(0, 0, camera.eyeX, 0);
        let edgeDistanceR = (width*groundOverflowFactor/4) - dist(0, 0, player.body.position.x, 0);
        if (edgeDistanceR > -28) {
         //   camera.move(-cameraVelocity,0,0); //move the camera Backward by cameraVelocity.
            let lerpedPosition = lerp(camera.eyeX, player.body.position.x, 0.08);
            camera.setPosition(lerpedPosition, camera.eyeY, camera.eyeZ);
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
        background('#8B5043');
        for (let i =-width; i < width/2 + (height/0.56); i+=(height/0.56)) {
            image(backgroundTexture_d,i,-height*1.2, (height/0.56), 1.8*height);

        }
        image(sun, -125, -525, 275,275);
        for (let i =-width; i < width; i+=width) {
            image(background_layer_cover,i,-75, width, 350);
            image(background_layer_cover_two,i,-60, width, 410);
            image(rock_grass,i,height/2 - 150 - ground_height + 5, width, 150);
        }
    }   
    else if (tod === 'night') {
        background('#693168');
        for (let i =-width; i < width/2 + (height/0.56); i+=(height/0.56)) {
            image(background_layer_night,i,-height*1.2, (height/0.56), 1.8*height);
        }
        image(moon, 0, -425, 150,150);
        for (let i =-width; i < width; i+=width) {
            image(background_cover_one_night,i,-75, width, 350);
            image(background_cover_two_night,i,-60, width, 410);
            image(rock_grass,i,height/2 - 150 - ground_height + 5, width, 150);
        }
    }
    else {
        background('#2F162F');
        for (let i =-width; i < width/2 + (height/0.56); i+=(height/0.56)) {
            image(background_layer_ghost,i,-height*1.2, (height/0.56), 1.8*height);
        }
        image(moon, 0, -425, 150,150);
        for (let i =-width; i < width; i+=width) {
            image(background_cover_one_ghost,i,-75, width, 350);
            image(background_cover_two_ghost,i,-60, width, 410);
            image(rock_grass,i,height/2 - 150 - ground_height + 5, width, 150);
        }
    }
}

function renderMenu() {

}