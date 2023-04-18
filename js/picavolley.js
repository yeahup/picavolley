'use strict';

var objects = [];
var matched_cnt = 0;
var content_groups = [];
var personal = null;

var ring_left = null;
var ring_right = null;
var bottom_tail = null;
var agreement_content = null;
var participate_btn = null;
var start_btn = null;

var state = CONSTANTS.CONFIGS.STATE_WAIT;

var nos = [];

var graphics_cover;

var start_enable = true;
var check_enable = true;

/** @type {number} game fps */
var normalFPS = 25;
/** @type {number} fps for slow motion */
var slowMotionFPS = 5;

/** @constant @type {number} ground width */
const GROUND_WIDTH = 432;
/** @constant @type {number} ground half-width, it is also the net pillar x coordinate */
const GROUND_HALF_WIDTH = GROUND_WIDTH / 2;
/** @constant @type {number} player (Pikachu) length: width = height = 64 */
const PLAYER_LENGTH = 64;
/** @constant @type {number} player half length */
const PLAYER_HALF_LENGTH = PLAYER_LENGTH / 2;
/** @constant @type {number} player's y coordinate when they are touching ground */
const PLAYER_TOUCHING_GROUND_Y_COORD = 244;
/** @constant @type {number} ball's radius */
const BALL_RADIUS = 20;
/** @constant @type {number} ball's y coordinate when it is touching ground */
const BALL_TOUCHING_GROUND_Y_COORD = 252;
/** @constant @type {number} net pillar's half width (this value is on this physics engine only, not on the sprite pixel size) */
const NET_PILLAR_HALF_WIDTH = 25;
/** @constant @type {number} net pillar top's top side y coordinate */
const NET_PILLAR_TOP_TOP_Y_COORD = 176;
/** @constant @type {number} net pillar top's bottom side y coordinate (this value is on this physics engine only) */
const NET_PILLAR_TOP_BOTTOM_Y_COORD = 192;

const NUM_OF_CLOUDS = 10;

var modified_delta = 0;

var fps = normalFPS;
var half_counter = 0;
var quad_counter = 0;

var current_serve_team = 1;

var team_score = [0,0];

var score_to_win = 15; //설정값 필요

var resourceLoaded = false;
		
class SoundFactory {
	
	constructor() {
		this.soundPack = {};
		
		this.soundPack['pipikachu'] = new Howl({
		 src: [SOUNDS.PIPIKACHU]
		});
		this.soundPack['bgm'] = new Howl({
		 src: [SOUNDS.BGM],
		 loop: true
		});
		this.soundPack['pika'] = new Howl({
		 src: [SOUNDS.PIKA]
		});
		this.soundPack['chu'] = new Howl({
		 src: [SOUNDS.CHU]
		});
		this.soundPack['pi'] = new Howl({
		 src: [SOUNDS.PI]
		});
		this.soundPack['powerhit'] = new Howl({
		 src: [SOUNDS.POWERHIT]
		});
		this.soundPack['balltouchground'] = new Howl({
		 src: [SOUNDS.BALLTOUCHESGROUND]
		});
	}
	
	play(key){
		this.soundPack[key].play();
	}
	
	stop(key){
		this.soundPack[key].stop();
	}
	
}

var soundFactory = new SoundFactory();

class PicaWaitRoom extends Phaser.Scene {
	constructor() {
        super('picaWaitRoom');
		this.tilebackground = null;
	}
	
	init ()
    {
		
    }
	
    start ()
    {
        //this.scene.start('game');
    }
	
	preload(){
	
		t = this;
		
		if(!resourceLoaded)
		{
			//this.load.image('hl3', './images/hl_3.png');
			
			//console.log(TEXTURES.PIKACHU);
			this.load.atlas('img pack', ASSETS_PATH.SPRITE_RESOURCE, ASSETS_PATH.SPRITE_SHEET);
			
			this.load.image("null", "./images/null.png");
			this.load.image("mushroom2", "./images/mushroom2.png");
			
			// this.load.atlas('img pack', './images/sprite_sheet.png', './images/sprite_sheet.json');
			
			// this.load.atlas('atlas', './images/megaset-2.png', './images/megaset-2.json');
			
			
			this.resourceLoaded = true;
		}
		
	}
	
	create(){
		
		this.tilebackground = t.add.tileSprite(0, 0, CONSTANTS.CONFIGS.FRAME_WIDTH_OUT, CONSTANTS.CONFIGS.FRAME_HEIGHT_OUT, 'img pack', TEXTURES.SITTING_PIKACHU);
		this.tilebackground.setOrigin(0)
		//this.tilebackground.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
		console.log(TEXTURES.SITTING_PIKACHU);
		this.tilebackground.setInteractive({ cursor: 'pointer' });

		this.tilebackground.on('pointerdown', () => {
			t.scene.start('picaGame');
		});
	}
	
	update(time, delta){
		
		var frame_time = 1000/fps;
		
		modified_delta -= delta;

		if(modified_delta > 0)
		{
			return;
		}

		modified_delta = frame_time;
		
		this.tilebackground.tilePositionX += 2;
		this.tilebackground.tilePositionY += 2;
	}
}

class PicaGame extends Phaser.Scene {
	
	constructor() {
        super('picaGame');
		this.half_counter = 0;
		this.quad_counter = 0;
	}
	
	init ()
    {
		
    }
	
    start ()
    {
        this.scene.start('game');
    }
	
	preload(){
	
		t = this;
		
		if(!resourceLoaded)
		{
			//this.load.image('hl3', './images/hl_3.png');
			
			//console.log(TEXTURES.PIKACHU);
			this.load.atlas('img pack', ASSETS_PATH.SPRITE_RESOURCE, ASSETS_PATH.SPRITE_SHEET);
			
			this.load.image("null", "./images/null.png");
			this.load.image("mushroom2", "./images/mushroom2.png");
			
			// this.load.atlas('img pack', './images/sprite_sheet.png', './images/sprite_sheet.json');
			
			// this.load.atlas('atlas', './images/megaset-2.png', './images/megaset-2.json');
			
			
			this.resourceLoaded = true;
		}
		
		
		this.keyboardArray = [
		  new PikaKeyboard('KeyD', 'KeyG', 'KeyR', 'KeyV', 'KeyZ', 'KeyF'), // for player1
		  new PikaKeyboard( // for player2
			'ArrowLeft',
			'ArrowRight',
			'ArrowUp',
			'ArrowDown',
			'Enter'
		  ),
		];
		
		team_score = [0,0];
	}
	
	create(){
		picaVolley.player1 = null;
		picaVolley.player2 = null;
		picaVolley.ball = null;
		picaVolley.team = 1;
		
		// this.image1 = this.add.image(400, 150, 'atlas', 'atari400');
		// this.image2 = this.add.image(400, 400, 'atlas', 'hotdog');

		//  Set the tint like this (topLeft, topRight, bottomLeft, bottomRight)
		//this.image1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

		//this.image2.setTint(0x0000ff, 0xff0000, 0xff00ff, 0xffff00);
		
		
		picaVolley.container = makeBGContainer();
		
		picaVolley.cloudContainer = makeCloudContainer();
		picaVolley.waveContainer = makeWaveContainer();
		
		picaVolley.cloudArray = [];
		for (let i = 0; i < NUM_OF_CLOUDS; i++) {
		  picaVolley.cloudArray.push(new Cloud());
		}
		picaVolley.wave = new Wave();
		
		picaVolley.scoreBoards = [
		  makeScoreBoardSprite(),
		  makeScoreBoardSprite(),
		];
		
		picaVolley.scoreBoards[0].x = 14; // score board is 14 pixel distant from boundary
		picaVolley.scoreBoards[0].y = 10;
		picaVolley.scoreBoards[1].x = 432 - 32 - 32 - 14; // 32 pixel is for number (32x32px) width; one score board has tow numbers
		picaVolley.scoreBoards[1].y = 10;
		
		
		
		picaVolley.messages = {
		  pokemon: makeSpriteWithAnchorXY(TEXTURES.POKEMON, 0, 0),
		  pikachuVolleyball: makeSpriteWithAnchorXY(
			TEXTURES.PIKACHU_VOLLEYBALL,
			0,
			0
		  ),
		  withWho: [
			makeSpriteWithAnchorXY(TEXTURES.WITH_COMPUTER, 0, 0),
			makeSpriteWithAnchorXY(TEXTURES.WITH_FRIEND, 0, 0),
		  ],
		  sachisoft: makeSpriteWithAnchorXY(TEXTURES.SACHISOFT, 0, 0),
		  fight: makeSpriteWithAnchorXY(TEXTURES.FIGHT, 0, 0),
		  
		  gameStart: makeSpriteWithAnchorXY(TEXTURES.GAME_START, 0, 0),
		  ready: makeSpriteWithAnchorXY(TEXTURES.READY, 0, 0),
		  gameEnd: makeSpriteWithAnchorXY(TEXTURES.GAME_END, 0, 0),
		};
		
		
		
		
		// Animation set
		drawGameStartMessage();
		setAnimations();
		 
		soundFactory.play("bgm");
		
		 getWait();
		 setBall();
		 startGame();
		 setStart(true);
		 fade(false, 0);
		 fade(true, 2000, function(){
			picaVolley.ball.object.body.setAllowGravity(true)
			state = CONSTANTS.CONFIGS.STATE_PLAYING;
		 });
	}
	
	update(time, delta){
		
		var frame_time = 1000/fps;
		
		modified_delta -= delta;

		if(modified_delta > 0)
		{
			return;
		}

		modified_delta = frame_time;
		
		
		this.half_counter = (this.half_counter+1)%2;
		this.quad_counter = (this.quad_counter+1)%4;
		
		
		t.keyboardArray[0].getInput();
		t.keyboardArray[1].getInput();
		
		picaVolley.ball.setShadow();
		picaVolley.player1.setShadow();
		picaVolley.player2.setShadow();
		
		drawCloudsAndWave();
		
		switch(state)
		{
			case CONSTANTS.CONFIGS.STATE_WAIT: //Before players are matched
				
				
				break;
			case CONSTANTS.CONFIGS.STATE_PAUSE: //When game is paused during playing
			
				break;
			case CONSTANTS.CONFIGS.STATE_PLAYING: //Game is now playing
				checkBallCollision(picaVolley.player1, picaVolley.player2, picaVolley.ball, t.keyboardArray[0]);
				checkBallCollision(picaVolley.player2, picaVolley.player1, picaVolley.ball, t.keyboardArray[1]);
				setPlayerPosition(picaVolley.player1, picaVolley.player2, t.keyboardArray[0], 0);
				setPlayerPosition(picaVolley.player2, picaVolley.player1, t.keyboardArray[1], 1);
				
				drawCloudsAndWave();
			case CONFIGS.STATE_GAMESET_WAIT:
				
				if(this.half_counter == 0)
				{
					this.halfUpdate();
				}
				
				break;
			case CONFIGS.STATE.STATE_CLEAR:
			
				break;
		}
		
		if(this.quad_counter == 0)
		{
			this.quadUpdate();
		}
	}
	
	

	halfUpdate(){
		picaVolley.ball.setTrailMotion();
	}

	quadUpdate(){		
		if(picaVolley.messages.ready.visible)
		{
			toggleReadyMessage();
		}
	}
}


var config = {
audio: {
    disableWebAudio: true
},
type: Phaser.AUTO,
parent: 'game-area',
input : {
  touch : {
    capture : false
  }
},
scene: [PicaWaitRoom, PicaGame],
scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    parent: 'game-area',
    autoCenter: Phaser.Scale.CENTER_BOTH,
	width: CONSTANTS.CONFIGS.FRAME_WIDTH_OUT,
	height: CONSTANTS.CONFIGS.FRAME_HEIGHT_OUT
},
backgroundColor: '#2d2d2d',
physics: {
	default: "arcade",
	arcade: {
		debug: true,
		debugShowBody: true,
		debugShowStaticBody: true,
		debugShowVelocity: true,
		debugVelocityColor: 0xffff00,
		debugBodyColor: 0x0000ff,
		debugStaticBodyColor: 0xffffff,
		gravity: { y: 550 },
		fps: 60
	},
}
//transparent: true
};



// var putup = new Howl({
 // src: ['./sounds/putup.mp3']
// });

// var put_success = new Howl({
 // src: ['./sounds/put_success.mp3']
// });

// var clear = new Howl({
 // src: ['./sounds/clear.mp3']
// });


//const TEXTURES = ASSETS_PATH.TEXTURES;

var game = new Phaser.Game(config);
var t;

var picaVolley = {};


function setAnimations(){
	
	t.anims.create({
            key: 'pica walk',
            frames: getPicaFrames(0,5),
            //frameRate: 6,
			duration:1000,
            yoyo: true,
            repeat: -1,
            //repeatDelay: 300
	 });
	 
	 t.anims.create({
            key: 'pica jump',
            frames: getPicaFrames(1,5),
            //frameRate: 6,
			duration:300,
            yoyo: true,
            repeat: -1,
            //repeatDelay: 300
	 });
	 
	 t.anims.create({
            key: 'pica angry',
            frames: getPicaFrames(2,5),
            //frameRate: 6,
			duration:300,
            yoyo: true,
            repeat: 0,
            //repeatDelay: 300
	 });
	 
	 t.anims.create({
            key: 'pica diving',
            frames: getPicaFrames(3,2),
            //frameRate: 6,
			duration:700,
            yoyo: false,
            repeat: 0,
            //repeatDelay: 300
	 });
	 
	 t.anims.create({
            key: 'pica diving end',
            frames: getPicaFrames(4,1),
            //frameRate: 6,
			duration:700,
            yoyo: false,
            repeat: 0,
            //repeatDelay: 300
	 });
	 
	 t.anims.create({
            key: 'pica winner',
            frames: getPicaFrames(5,5),
            //frameRate: 6,
			duration:500,
            yoyo: false,
            repeat: 0,
            //repeatDelay: 300
	 });
	 
	 t.anims.create({
            key: 'pica loser',
            frames: getPicaFrames(6,5),
            //frameRate: 6,
			duration:500,
            yoyo: false,
            repeat: 0,
            //repeatDelay: 300
	 });
	 
	 
	 t.anims.create({
            key: 'ball normal',
            frames: getBallFrames(5, false),
            //frameRate: 6,
			duration:300,
            yoyo: false,
            repeat: -1,
            //repeatDelay: 300
	 });
	 
	 
	 t.anims.create({
            key: 'ball normal reverse',
            frames: getBallFrames(5, true),
            //frameRate: 6,
			duration:300,
            yoyo: false,
            repeat: -1,
            //repeatDelay: 300
	 });
	 
	 
	 t.anims.create({
            key: 'ball hyper',
            frames: [{
				key : 'img pack',
				frame : TEXTURES.BALL_TRAIL,
				isKeyFrame : false 
			}],
            //frameRate: 6,
			duration:300,
            yoyo: true,
            repeat: -1,
            //repeatDelay: 300
	 });
	 
	 
	 t.anims.create({
            key: 'ball punch',
            frames: [{
				key : 'img pack',
				frame : TEXTURES.BALL_PUNCH,
				isKeyFrame : false 
			}],
            //frameRate: 6,
			duration:300,
            yoyo: true,
            repeat: -1,
            //repeatDelay: 300
	 });
	 
	 
	 t.anims.create({
            key: 'cloud',
            frames: [{
				key : 'img pack',
				frame : TEXTURES.CLOUD,
				isKeyFrame : false 
			}],
            //frameRate: 6,
			duration:300,
            yoyo: true,
            repeat: -1,
            //repeatDelay: 300
	 });
	 
	 
	 t.anims.create({
            key: 'wave',
            frames: [{
				key : 'img pack',
				frame : TEXTURES.WAVE,
				isKeyFrame : false 
			}],
            //frameRate: 6,
			duration:300,
            yoyo: true,
            repeat: -1,
            //repeatDelay: 300
	 });
}

function setTimeScale(timeScale){
	
	t.tweens.timeScale = timeScale;
	t.timeScale = timeScale;
	t.anims.timeScale = timeScale;
	
	picaVolley.player1.object.anims.timeScale = timeScale;
	picaVolley.player2.object.anims.timeScale = timeScale;
	//t.anims.setTimeScale(timeScale);
	//console.log(timeScale);
	fps = normalFPS * timeScale;
	t.physics.world.timeScale = 1/timeScale;
}

function getPicaFrames(i,j){
	
	var frames = [];
	 
	 for(var k = 0; k < j; k++){
		 var frame = {
			key : 'img pack',
			frame : TEXTURES.PIKACHU(i,k),
			isKeyFrame : false 
		 };
		 
		frames.push(frame);
	 }
	 
	 return frames;
	 
}

function getBallFrames(j, reverse){
	
	var frames = [];
	 
	 if(reverse)
	 {
		 for(var k = j-1; k >= 0; k--){
			 var frame = {
				key : 'img pack',
				frame : TEXTURES.BALL(k),
				isKeyFrame : false 
			 };
			 
			frames.push(frame);
		 }
	 }
	 else
	 {
		 for(var k = 0; k < j; k++){
			 var frame = {
				key : 'img pack',
				frame : TEXTURES.BALL(k),
				isKeyFrame : false 
			 };
			 
			frames.push(frame);
		 }
	 }
	 
	 return frames;
	
}

function halfUpdate(){
	picaVolley.ball.setTrailMotion();
}

function quadUpdate(){		
	if(picaVolley.messages.ready.visible)
	{
		toggleReadyMessage();
	}
}

function getWait(){
	
	//picaVolley.player1 = t.add.sprite(50, 50, 'img pack', TEXTURES.MOUNTAIN);
	var player = t.physics.add.sprite(GROUND_HALF_WIDTH * 1/4, PLAYER_TOUCHING_GROUND_Y_COORD, 'img pack', TEXTURES.PIKACHU(0,0)).setOrigin(0.5);
	
	var player_shadow = t.add.sprite(GROUND_HALF_WIDTH * 1/4, PLAYER_TOUCHING_GROUND_Y_COORD + PLAYER_HALF_LENGTH - 2, 'img pack', TEXTURES.SHADOW);
	
	picaVolley.player1 = new Player(false, 1, 6, 8, player, player_shadow, false, true, 1, false);
	
	
	//player.setFriction(0.01);
	
	var player2 = t.physics.add.sprite(CONSTANTS.CONFIGS.FRAME_WIDTH_OUT - (GROUND_HALF_WIDTH * 1/4), PLAYER_TOUCHING_GROUND_Y_COORD , 'img pack', TEXTURES.PIKACHU(0,0));

	var player2_shadow = t.add.sprite(CONSTANTS.CONFIGS.FRAME_WIDTH_OUT - (GROUND_HALF_WIDTH * 1/4), PLAYER_TOUCHING_GROUND_Y_COORD + PLAYER_HALF_LENGTH - 2, 'img pack', TEXTURES.SHADOW);
	
	picaVolley.player2 = new Player(true, 1, 6, 8, player2, player2_shadow, false, false, 2, true);
	
	//player2.setFriction(0.01);
	
	// this.gem is a local variable.
	$.each(picaVolley.groundTiles, function(index, item){
		t.physics.add.collider(player, item, function (_player, _platform)
        {
            if (_player.body.touching.up && _platform.body.touching.down)
            {
				//picaVolley.player1.state = 1;
            }
			picaVolley.player1.object.setVelocity(0,0);
			
			if(picaVolley.player1.getState() == 4)
			{
				//넘어짐 애니메이션 0.5초 실행
				picaVolley.player1.playMotion("pica diving end");
				picaVolley.player1.setState(5);
			}
        });
		
		t.physics.add.collider(player2, item, function (_player, _platform)
        {
            if (_player.body.touching.up && _platform.body.touching.down)
            {
				//picaVolley.player2.state = 1;
            }
			picaVolley.player2.object.setVelocity(0,0);
			
			if(picaVolley.player2.getState() == 4)
			{
				//넘어짐 애니메이션 0.5초 실행
				picaVolley.player2.playMotion("pica diving end");
				picaVolley.player2.setState(5);
			}
        });
	});
	
	$.each(picaVolley.boundTiles, function(index, item){
		t.physics.add.collider(player, item, function (_player, _platform)
        {
			
        });
		
		t.physics.add.collider(player2, item, function (_player, _platform)
        {
			
        });
	});
	
	
}

function setBall(){
	if(picaVolley.ball)
	{
		//picaVolley.ball = t.physics.add.sprite(GROUND_HALF_WIDTH, 30, 'img pack', TEXTURES.BALL(0));
		//picaVolley.ball.play("ball normal");
		
		picaVolley.ball.playMotion({ key: 'ball normal', frameRate: 0 });
	}
	else
	{
		var ball = t.physics.add.sprite(GROUND_HALF_WIDTH/2, 30, 'img pack', TEXTURES.BALL(0));
		var ball_hyper = t.add.sprite(GROUND_HALF_WIDTH/2, 30, 'img pack', TEXTURES.BALL_HYPER);
		var ball_trail = t.add.sprite(GROUND_HALF_WIDTH/2, 30, 'img pack', TEXTURES.BALL_TRAIL);
		var ball_punch = t.add.sprite(GROUND_HALF_WIDTH/2, 30, 'img pack', TEXTURES.BALL_PUNCH);
		var ball_shadow = t.add.sprite(GROUND_HALF_WIDTH/2, PLAYER_TOUCHING_GROUND_Y_COORD + PLAYER_HALF_LENGTH - 2, 'img pack', TEXTURES.SHADOW);
		
		//ball_hyper.setAlpha(0);
		//ball_trail.setAlpha(0);
		ball_punch.setAlpha(0);
		ball_punch.setScale(0);
		
		
		picaVolley.ball = new Ball(ball, ball_hyper, ball_trail, ball_punch, ball_shadow, t);
		//picaVolley.ball.play("ball normal");
		
		ball.setCollideWorldBounds(true);
		ball.setFrictionX(0);
	
		
		// t.physics.add.collider(ball.object, picaVolley.player1.object, function (_ball, _player)
        // {
            // console.log("bound1");
			// var directionVector = {x:0,y:0};
			// _ball.body.setAcceleration(x, y);
        // });
		
		// t.physics.add.collider(ball.object, picaVolley.player2.object, function (_ball, _player)
        // {
            // console.log("bound2");
        // });
		
		$.each(picaVolley.groundTiles, function(index, item){
				
			t.physics.add.collider(ball, item, function (_ball, _platform)
			{

				if(!picaVolley.ball.isPunching())
				{
					picaVolley.ball.is_on_ground = true;
				}
				
				if(state != CONFIGS.STATE_GAMESET_WAIT)
				{
					picaVolley.ball.punch(t);
					
					var winner_team = 1;
					
					if(ball.x <= GROUND_HALF_WIDTH)
					{
						winner_team = 2;
					}
					else
					{
						winner_team = 1;
					}
					gameSet(winner_team);
				}
				
				/* if (_ball.body.touching.up && _platform.body.touching.down)
				{
					console.log("3");
					picaVolley.ball.punch(t);
					//picaVolley.player1.state = 1;
					
				} */
			});
			
			t.physics.add.overlap(ball, item);
		});
		
		$.each(picaVolley.ceilingTiles, function(index, item){
				
			t.physics.add.collider(ball, item, function (_ball, _platform)
			{
				picaVolley.ball.object.setVelocity(picaVolley.ball.object.body.velocity.x, 0);
			});
		});
		
		$.each(picaVolley.boundTiles, function(index, item){
				
			t.physics.add.collider(ball, item, function (_ball, _platform)
			{
				
			});
			
			t.physics.add.overlap(ball, item);
		});
	
		ball.on("overlapstart", function() {
			if(ball.y <= PLAYER_TOUCHING_GROUND_Y_COORD + PLAYER_HALF_LENGTH - 2)
			{
				
				soundFactory.play("balltouchground");
		
				if(state != CONFIGS.STATE_GAMESET_WAIT)
				{
					picaVolley.ball.punch(t);
					
					var winner_team = 1;
					
					if(ball.x <= GROUND_HALF_WIDTH)
					{
						winner_team = 2;
					}
					else
					{
						winner_team = 1;
					}
					gameSet(winner_team);
				}
			}
		});
	
		ball.on("overlapend", function() {
			
			picaVolley.ball.is_on_ground = false;
		});
		
		ball.setBounce(1);
	}
	
	picaVolley.ball.object.body.setAllowGravity(false);
}

function startGame(){
	setTimeScale(1);
	drawScoresToScoreBoards(team_score);
}

function gameSet(winner_team){
	
	state = CONFIGS.STATE_GAMESET_WAIT;
	
	
	current_serve_team = winner_team;
	team_score[winner_team-1] += 1;
	
	drawScoresToScoreBoards(team_score);
	console.log(team_score[winner_team-1]);
	
	if(team_score[winner_team-1] >= score_to_win)
	{
		showConclusion(winner_team);
	}
	else
	{
		setTimeScale(slowMotionFPS / normalFPS);
		setTimer(function(){
			
			fade(false, 300, function(){
				setStart();
			});
		}, 1500);
	}
}

function drawScore(){ //현재 점수 보여주기/갱신
	
}

function setStart(first){ //셋트 시작

	if(!first)
	{
		drawReadyMessage(true);
	}
	
	picaVolley.ball.playMotion({ key: 'ball normal', frameRate: 0 });
	
	fade(true, 800, function(){
		picaVolley.ball.object.body.setAllowGravity(true);
		drawReadyMessage(false);
		state = CONFIGS.STATE_PLAYING;
	});
		
	setTimeScale(1);
	picaVolley.ball.object.setVelocity(0);
	picaVolley.ball.object.body.setAllowGravity(false);
	
	picaVolley.player1.resetBody();
	picaVolley.player2.resetBody();
	
	var turnPlayer = picaVolley.player1;
	
	if(picaVolley.player2.team == current_serve_team)
	{
		
	}
	
		
	picaVolley.ball.object.setPosition(turnPlayer.basePosition.x + (turnPlayer.basePosition.x > GROUND_HALF_WIDTH ? -20 : 20), 30);
	
	
}

function showConclusion(winner_team){ //결과 화면 출력
	drawGameEndMessage();
	picaVolley.state = CONFIGS.STATE_CLEAR;
	
	soundFactory.play("pipikachu");
	
	if(picaVolley.player1.team == winner_team)
	{
		picaVolley.player1.playMotion("pica winner");
		picaVolley.player2.playMotion("pica loser");
	}
	else
	{
		picaVolley.player2.playMotion("pica winner");
		picaVolley.player1.playMotion("pica loser");
	}
	
	setTimer(function(){
		
		soundFactory.stop("bgm");
		t.scene.restart();
		
	}, 5000);
	
	
}

function matched()
{
	picaVolley.control = {};
	picaVolley.control.left = t.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
	picaVolley.control.up = t.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
	picaVolley.control.right = t.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
	picaVolley.control.down = t.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
	picaVolley.control.enter = t.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
}

/**
 * Add child to parent and set local position
 * @param {PIXI.Container} parent
 * @param {PIXI.Sprite} child
 * @param {number} x local x
 * @param {number} y local y
 */
function addChildToParentAndSetLocalPosition(parent, child, x, y) {
	
  parent.add(child)
  parent.x = 0;//CONSTANTS.CONFIGS.FRAME_WIDTH_OUT/2;
  parent.y = 0;//CONSTANTS.CONFIGS.FRAME_HEIGHT_OUT/2;
  child.setOrigin(0,0);
  child.x = x;
  child.y = y;
}

/**
 * Make background
 * @param {Object.<string,PIXI.Texture>} textures
 * @return {PIXI.Container}
 */
function makeBGContainer() {
  const bgContainer = t.add.container(0,0);

  // sky
  let tile;
  for (let j = 0; j < 12; j++) {
    for (let i = 0; i < 432 / 16; i++) {
      tile = t.add.image(0, 0, 'img pack', TEXTURES.SKY_BLUE);
      addChildToParentAndSetLocalPosition(bgContainer, tile, 16 * i, 16 * j);
    }
  }

  // mountain
  tile = t.add.image(0, 0, 'img pack', TEXTURES.MOUNTAIN);
  addChildToParentAndSetLocalPosition(bgContainer, tile, 0, 188);

  // ground_red
  for (let i = 0; i < 432 / 16; i++) {
	tile = t.add.image(0, 0, 'img pack', TEXTURES.GROUND_RED);
    addChildToParentAndSetLocalPosition(bgContainer, tile, 16 * i, 248);
  }
	
  picaVolley.groundTiles = [];
  picaVolley.ceilingTiles = [];
  picaVolley.boundTiles = [];
  
  // ground_line
  for (let i = 1; i < 432 / 16 - 1; i++) {
	tile = t.add.image(0, 0, 'img pack', TEXTURES.GROUND_LINE);
    addChildToParentAndSetLocalPosition(bgContainer, tile, 16 * i, 264);
  }
  
  tile = t.add.image(0, 0, 'img pack', TEXTURES.GROUND_LINE_LEFT_MOST);
  addChildToParentAndSetLocalPosition(bgContainer, tile, 0, 264);
  tile = t.add.image(0, 0, 'img pack', TEXTURES.GROUND_LINE_RIGHT_MOST);
  addChildToParentAndSetLocalPosition(bgContainer, tile, 432 - 16, 264);

  // ground_yellow
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 432 / 16; i++) {
	  tile = t.add.image(0, 0, 'img pack', TEXTURES.GROUND_YELLOW);
      addChildToParentAndSetLocalPosition(
        bgContainer,
        tile,
        16 * i,
        280 + 16 * j
      );
    }
  }

  // net pillar
  tile = t.add.image(0, 0, 'img pack', TEXTURES.NET_PILLAR_TOP);
  addChildToParentAndSetLocalPosition(bgContainer, tile, 213, 176);
  for (let j = 0; j < 12; j++) {
    tile = t.add.image(0, 0, 'img pack', TEXTURES.NET_PILLAR);
    addChildToParentAndSetLocalPosition(bgContainer, tile, 213, 184 + 8 * j);
  }
  
  var bloxk_net = t.add.rectangle(216, 176 + (8*6), 2, 8*12, 0x6666ff);
  t.physics.add.existing(bloxk_net, true);
  picaVolley.boundTiles.push(bloxk_net);

  
  var block_left = t.add.rectangle(0, PLAYER_TOUCHING_GROUND_Y_COORD + PLAYER_HALF_LENGTH, GROUND_WIDTH, 2, 0x6666ff);
  var block_right = t.add.rectangle(GROUND_WIDTH, PLAYER_TOUCHING_GROUND_Y_COORD + PLAYER_HALF_LENGTH, GROUND_WIDTH, 2, 0x6666ff);
  t.physics.add.existing(block_left, true);
  t.physics.add.existing(block_right, true);
  picaVolley.groundTiles.push(block_left);
  picaVolley.groundTiles.push(block_right);
  
  
  var block_upper = t.add.rectangle(GROUND_HALF_WIDTH, 0, CONSTANTS.CONFIGS.FRAME_WIDTH_OUT, 1, 0x6666ff);
  t.physics.add.existing(block_upper, true);
  picaVolley.ceilingTiles.push(block_upper);
  
  //block_left.setFrictionX(0);
  //block_right.setFrictionX(0);
  
  
  return bgContainer;
}



$(function(){
  resize();
});

function resize(){
	
}

function setTouchScrolling(set){
  if(set){

    $(game.canvas).off("touchmove");
    $(game.canvas).on("touchmove", function(e){

    });
    document.ontouchmove = function(event){
        return true;
    }
  } else {

    $(game.canvas).off("touchmove");
    $(game.canvas).on("touchmove", function(e){
      e.preventDefault();
    });

    document.ontouchmove = function(event){
        event.preventDefault();
    }
  }

}

function setPlayerPosition(player, other_player, userInput, position){
	
	if(player.getImmutable())
	{
		return;
	}
	
	if(userInput.xDirection != 0 && player.getState() < 4)
	{
		player.moveX(player.speed * userInput.xDirection);
	}
	
	if(position == 0)
	{
		if(player.getX() <= player.object.width/2)
		{
			player.object.x = player.object.width/2;
		}
		else if(player.getX() > GROUND_HALF_WIDTH - player.object.width/2 - 5)
		{
			player.setX(GROUND_HALF_WIDTH - player.object.width/2 - 5);
		}
	}
	else
	{
		if(player.getX() <= GROUND_HALF_WIDTH + player.object.width/2 + 5)
		{
			player.setX(GROUND_HALF_WIDTH + player.object.width/2 + 5);
		}
		else if(player.getX() > GROUND_WIDTH - player.object.width/2)
		{
			player.setX(GROUND_WIDTH - player.object.width/2);
		}
	}
	
	
	if(userInput.yDirection == -1 && player.getState() == 1)
	{
		soundFactory.play("chu");
		
		console.log("try jumping");
		player.setState(2);
		//player.object.y += player.speed * userInput.yDirection;
		player.object.setVelocity(0, player.speed * 65 * userInput.yDirection);
		player.playMotion("pica jump");
		//console.log(picaVolley.ball.mass);
	}
	
	if (userInput.powerHit === 1 && (userInput.xDirection !== 0 || userInput.yDirection !== 0)) {
		
		if(player.getState() == 1) //is walking
		{
			
			soundFactory.play("chu");
			
			player.setState(4);
			player.object.setVelocity(player.speed * 40 * userInput.xDirection, -100);
			player.playMotion("pica diving");
			player.flipTo(userInput.xDirection != 1);
		}
		else if(player.getState() == 2) //is jumping
		{
		
			console.log("get power shot");
			player.playMotion("pica angry");
			
		}
	}
	
	
	if(player.getState() != 1 && player.object.body.velocity.y == 0 && player.object.y >= (PLAYER_TOUCHING_GROUND_Y_COORD - 2))
	{
		if(player.getState() == 5)
		{
			player.setImmutable(true);
			
			setTimer(function(){
				player.playMotion("pica walk");
				player.flipToBase();
				player.setState(1);
				player.setImmutable(false);
			}, 500);
		}
		else
		{
			player.playMotion("pica walk");
			player.flipToBase();
			player.setState(1);
		}
	}
	else if(player.getState() == 2)
	{
		//console.log(player.object.y);
	}
	
	
}

function distance(object1, object2)
{
	return Math.abs(Math.sqrt(Math.pow(object1.x - object2.x, 2) + Math.pow(object1.y - object2.y, 2)));
}

function checkBallCollision(player, other_player, ball, userInput){
	
	//if(ball.object.body.velocity.y > 0 && player.object.y > ball.object.y && Math.abs(player.object.x - ball.object.x) <= (player.object.width) && Math.abs(player.object.y - ball.object.y) <= (player.object.height/2) && (player.object.y > ball.object.y + (ball.object.height/2)))
	if(ball.object.body.velocity.y > 0 && distance(player.object, ball.object) < player.object.height * 3/5)
	{
		console.log("hit ball");
		hitBall(player, ball, userInput);
	}
}

function hitBall(player, ball, userInput) {

	if (player.object.anims.currentAnim.key == 'pica angry' && player.getState() == 2)
	{
		console.log("power hit");
		soundFactory.play("pika");
		
		var speed = 600;
		var xVelocity = 0;
		var yVelocity = 0;
		
		ball.setEffVisible(true);
		
		if(userInput.yDirection == 0)
		{
			xVelocity = player.object.x > GROUND_HALF_WIDTH ? -300 : 300;
			yVelocity = 20
		}
		else
		{
			xVelocity = player.object.x > GROUND_HALF_WIDTH ? -30 : 30;
			yVelocity = userInput.yDirection * 60;
		}
		
		var directionVector = new Vector2(xVelocity, yVelocity);
		directionVector.setScala(speed);
		
		var VelocityVector = directionVector.get();
		
		ball.punch();
		
		//y2 = x2 - z2;
		
		//powerhit
		ball.object.setVelocity(VelocityVector.x, VelocityVector.y);
	}
	else
	{
		
		var speed = 450;
		
		//var directionVector = new Vector2(ball.object.body.velocity.x, -ball.object.body.velocity.y);//new Vector2((ball.object.x - player.object.x - (ball.object.body.velocity.x/20)), (ball.object.y - player.object.y));
		//var directionVector = new Vector2((ball.object.x - player.object.x)/4, (ball.object.y - player.object.y));
		var directionVector = new Vector2((ball.object.x - player.object.x)/4, -15);
		directionVector.setScala(speed);
		
		ball.setEffVisible(false);
		
		var VelocityVector = directionVector.get();
		
		if(directionVector.x > 0)
		{
			ball.playMotion({ key: 'ball normal', frameRate: (directionVector.x)/10 });
		}
		else if(directionVector.x < 0)
		{
			ball.playMotion({ key: 'ball normal reverse', frameRate: -(directionVector.x)/10 });
		}
		else
		{
			ball.object.stop();
		}
		
		
		//y2 = x2 - z2;
		
		//powerhit
		ball.object.setVelocity(VelocityVector.x, VelocityVector.y);
		//normalhit
	}
}

function fade(show, duration, callback){
	
	if(show)
	{
		t.cameras.main.fadeIn(duration);
	}
	else
	{
		t.cameras.main.fadeOut(duration);
	}
	
	
	if(typeof callback == 'function')
	{	
		//t.camera.fade(show ? 0xffffff : 0x000000, duration, callback);
		
		t.cameras.main.once('camerafade'+(show ? 'in' : 'out')+'complete', function (camera) {
            callback();
        });
		
	}
}

/**
 * Make a container with cloud sprites
 * @param {Object.<string,PIXI.Texture>} textures
 * @return {PIXI.Container}
 */
function makeCloudContainer(textures) {
  const cloudContainer = t.add.container(0,0);

  for (let i = 0; i < NUM_OF_CLOUDS; i++) {
    const cloud = t.add.image(0, 0, 'img pack', TEXTURES.CLOUD);

	cloud.setOrigin(0,0);
    cloudContainer.add(cloud);
  }

  return cloudContainer;
}

/**
 * Make a container with wave sprites
 * @param {Object.<string,PIXI.Texture>} textures
 * @return {PIXI.Container}
 */
function makeWaveContainer(textures) {
  const waveContainer = t.add.container(0,0);
  
  for (let i = 0; i < 432 / 16; i++) {
    const tile = t.add.image(0, 0, 'img pack', TEXTURES.WAVE);
    addChildToParentAndSetLocalPosition(waveContainer, tile, 16 * i, 0);
  }

  return waveContainer;
}

class Wave {
  constructor() {
    this.verticalCoord = 0;
    this.verticalCoordVelocity = 2;
    this.yCoords = [];
    for (let i = 0; i < 432 / 16; i++) {
      this.yCoords.push(314);
    }
  }
}


class Cloud {
  constructor() {
    this.topLeftPointX = -68 + (rand() % (432 + 68));
    this.topLeftPointY = rand() % 152;
    this.topLeftPointXVelocity = 1 + (rand() % 2);
    this.sizeDiffTurnNumber = rand() % 11;
  }

  get sizeDiff() {
    // this same as return [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0][this.sizeDiffTurnNumber]
    return 5 - Math.abs(this.sizeDiffTurnNumber - 5);
  }

  get spriteTopLeftPointX() {
    return this.topLeftPointX - this.sizeDiff;
  }

  get spriteTopLeftPointY() {
    return this.topLeftPointY - this.sizeDiff;
  }

  get spriteWidth() {
    return 48 + 2 * this.sizeDiff;
  }

  get spriteHeight() {
    return 24 + 2 * this.sizeDiff;
  }
}

/**
* Draw clouds and wave
*/
function drawCloudsAndWave() {
    const cloudArray = picaVolley.cloudArray;
    const wave = picaVolley.wave;

    cloudAndWaveEngine(cloudArray, wave);
	
	
	//container.iterate(callback);
	
    for (let i = 0; i < NUM_OF_CLOUDS; i++) {
      const cloud = cloudArray[i];
      const cloudSprite = picaVolley.cloudContainer.list[i];
      cloudSprite.x = cloud.spriteTopLeftPointX;
      cloudSprite.y = cloud.spriteTopLeftPointY;
      // @ts-ignore
      cloudSprite.displayWidth = cloud.spriteWidth;
      // @ts-ignore
      cloudSprite.displayHeight = cloud.spriteHeight;
	  //console.log(cloudSprite.width);
    }

    for (let i = 0; i < 432 / 16; i++) {
      const waveSprite = picaVolley.waveContainer.list[i];
      waveSprite.y = wave.yCoords[i];
    }
}

/**
 * FUN_00404770
 * Move clouds and wave
 * @param {Cloud[]} cloudArray
 * @param {Wave} wave
 */
function cloudAndWaveEngine(cloudArray, wave) {
  for (let i = 0; i < 10; i++) {
    cloudArray[i].topLeftPointX += cloudArray[i].topLeftPointXVelocity;
    if (cloudArray[i].topLeftPointX > 432) {
      cloudArray[i].topLeftPointX = -68;
      cloudArray[i].topLeftPointY = rand() % 152;
      cloudArray[i].topLeftPointXVelocity = 1 + (rand() % 2);
    }
    cloudArray[i].sizeDiffTurnNumber =
      (cloudArray[i].sizeDiffTurnNumber + 1) % 11;
  }

  wave.verticalCoord += wave.verticalCoordVelocity;
  if (wave.verticalCoord > 32) {
    wave.verticalCoord = 32;
    wave.verticalCoordVelocity = -1;
  } else if (wave.verticalCoord < 0 && wave.verticalCoordVelocity < 0) {
    wave.verticalCoordVelocity = 2;
    wave.verticalCoord = -(rand() % 40);
  }

  for (let i = 0; i < 432 / 16; i++) {
    wave.yCoords[i] = 314 - wave.verticalCoord + (rand() % 3);
  }
}


/**
 * Make score boards
 * @param {Object.<string,PIXI.Texture>} textures
 * @return {PIXI.Container} child with index 0 for player 1 score board, child with index 1 for player2 score board
 */
function makeScoreBoardSprite() {

  const numberAnimatedSprites = [null, null];
  numberAnimatedSprites[0] = t.add.sprite(0, 0, 'img pack', TEXTURES.NUMBER(0));
  numberAnimatedSprites[1] = t.add.sprite(0, 0, 'img pack', TEXTURES.NUMBER(0));

  const scoreBoard = t.add.container(0,0);
  addChildToParentAndSetLocalPosition(
    scoreBoard,
    numberAnimatedSprites[0],
    32,
    0
  ); // for units
  addChildToParentAndSetLocalPosition(
    scoreBoard,
    numberAnimatedSprites[1],
    0,
    0
  ); // for tens

  return scoreBoard;
}

/**
   * Draw scores to each score board
   * @param {number[]} scores [0] for player1 score, [1] for player2 score
   */
function drawScoresToScoreBoards(scores) {
	for (let i = 0; i < 2; i++) {
	  const scoreBoard = picaVolley.scoreBoards[i];
	  const score = scores[i];
	  const unitsAnimatedSprite = scoreBoard.list[0];
	  const tensAnimatedSprite = scoreBoard.list[1];
	  // @ts-ignore
	  unitsAnimatedSprite.setTexture("img pack", TEXTURES.NUMBER(score % 10));
	  unitsAnimatedSprite.setOrigin(0,0);
	  // @ts-ignore
	  tensAnimatedSprite.setTexture("img pack", TEXTURES.NUMBER(Math.floor(score / 10) % 10));
	  tensAnimatedSprite.setOrigin(0,0);
	  if (score >= 10) {
		tensAnimatedSprite.setVisible(true);
	  } else {
		tensAnimatedSprite.setVisible(false);
	  }
	}
}

/**
* refered FUN_00403f20
* Draw game start message as frame goes
* @param {number} frameCounter current frame number
* @param {number} frameTotal total frame number for game start message
*/
function drawGameStartMessage() {

	const gameStartMessage = picaVolley.messages.fight;
	
	gameStartMessage.setVisible(true);
	gameStartMessage.setScale(1);

	const w = gameStartMessage.width; // game start message texture width
	const h = gameStartMessage.height; // game start message texture height
	const halfWidth = w/2;
	const halfHeight = h/2;
	gameStartMessage.x = 216 - halfWidth;
	gameStartMessage.y = 50 + 2 * halfHeight;
	gameStartMessage.width = 2 * halfWidth;
	gameStartMessage.height = 2 * halfHeight;
	
	
	t.tweens.add({
		targets: gameStartMessage,
		scale:0.5,
		duration: 2000,
		x:216 - w/4,
		y:50,
		ease: 'linear',
		repeat: 0,
		onComplete: function(){
			gameStartMessage.setVisible(false);
		}
	});
}

/**
* Draw ready message
* @param {boolean} bool turn on?
*/
function drawReadyMessage(bool) {
	//picaVolley.messages.ready.visible = bool;
	
	const gameReadyMessage = picaVolley.messages.ready;
	
	gameReadyMessage.setVisible(bool);
	
	gameReadyMessage.x = 216 - gameReadyMessage.width/2;
	gameReadyMessage.y = 50;
	
	// t.tweens.add({
		// targets: gameStartMessage,
		// alpha:0,
		// duration: 0,
		// x:216 - w/2,
		// y:50,
		// repeatDelay:250,
		// ease: 'linear',
		// repeat: 4,
		// onComplete: function(){
			// gameReadyMessage.setVisible(false);
		// }
	// });
}

/**
* Togle ready message.
* Turn off if it's on, turn on if it's off.
*/
function toggleReadyMessage() {
	//picaVolley.messages.ready.visible = !picaVolley.messages.ready.visible;
	picaVolley.messages.ready.alpha = (picaVolley.messages.ready.alpha+1)%2;
}

/**
* refered FUN_00404070
* Draw game end message as frame goes
* @param {number} frameCounter
*/
function drawGameEndMessage() {
	const gameEndMessage = picaVolley.messages.gameEnd;
	const w = gameEndMessage.width; // game end message texture width;
	const h = gameEndMessage.height; // game end message texture height;
	
	gameEndMessage.setVisible(true);
	gameEndMessage.setScale(0.5);
	gameEndMessage.x = 216 - w/2;
	gameEndMessage.y = 50 - w/2;
	
	t.tweens.add({
		targets: gameEndMessage,
		scale:1,
		duration: 2000,
		x:216 - w,
		y:50,
		ease: 'linear',
		repeat: 0
	});
}

/**
 * Make sprite with the texture on the path and with the given anchor x, y
 * @param {Object.<string,PIXI.Texture>} textures
 * @param {string} path
 * @param {number} anchorX anchor.x, number in [0, 1]
 * @param {number} anchorY anchor.y, number in [0, 1]
 * @return {PIXI.Sprite}
 */
function makeSpriteWithAnchorXY(path, anchorX, anchorY) {
  const sprite = t.add.sprite(0,0,'img pack', path);
  sprite.setOrigin(anchorX, anchorY);
  sprite.setVisible(false);
  return sprite;
}



function setTimer(callback, delay){
	t.time.addEvent({
		delay:delay,
		callback:callback,
		loop:false
	});
}