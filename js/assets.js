/**
 * Manages the paths (file locations) of the game assets.
 */
'use strict';

const ASSETS_PATH = {
  SPRITE_RESOURCE: './images/sprite_sheet.png',
  SPRITE_SHEET: './images/sprite_sheet.json',
  TEXTURES: {},
  SOUNDS: {},
};

const TEXTURES = ASSETS_PATH.TEXTURES;
TEXTURES.PIKACHU = (i, j) => `pikachu/pikachu_${i}_${j}.png`;
TEXTURES.PIKACHU_WALK_PREFIX = 'pikachu/pikachu_0_';
TEXTURES.PIKACHU_JUMP_PREFIX = 'pikachu/pikachu_1_';
TEXTURES.PIKACHU_SLIDING_PREFIX = 'pikachu/pikachu_2_';

TEXTURES.BALL = (s) => `ball/ball_${s}.png`;
TEXTURES.NUMBER = (n) => `number/number_${n}.png`;

TEXTURES.SKY_BLUE = 'objects/sky_blue.png';
TEXTURES.MOUNTAIN = 'objects/mountain.png';
TEXTURES.GROUND_RED = 'objects/ground_red.png';
TEXTURES.GROUND_LINE = 'objects/ground_line.png';
TEXTURES.GROUND_LINE_LEFT_MOST = 'objects/ground_line_leftmost.png';
TEXTURES.GROUND_LINE_RIGHT_MOST = 'objects/ground_line_rightmost.png';
TEXTURES.GROUND_YELLOW = 'objects/ground_yellow.png';
TEXTURES.NET_PILLAR_TOP = 'objects/net_pillar_top.png';
TEXTURES.NET_PILLAR = 'objects/net_pillar.png';
TEXTURES.SHADOW = 'objects/shadow.png';
TEXTURES.BALL_HYPER = 'ball/ball_hyper.png';
TEXTURES.BALL_TRAIL = 'ball/ball_trail.png';
TEXTURES.BALL_PUNCH = 'ball/ball_punch.png';
TEXTURES.CLOUD = 'objects/cloud.png';
TEXTURES.WAVE = 'objects/wave.png';

TEXTURES.SACHISOFT = 'messages/common/sachisoft.png';
TEXTURES.READY = 'messages/common/ready.png';
TEXTURES.GAME_END = 'messages/common/game_end.png';

TEXTURES.MARK = 'messages/ja/mark.png';
TEXTURES.POKEMON = 'messages/ja/pokemon.png';
TEXTURES.PIKACHU_VOLLEYBALL = 'messages/ja/pikachu_volleyball.png';
TEXTURES.FIGHT = 'messages/ja/fight.png';
TEXTURES.WITH_COMPUTER = 'messages/ja/with_computer.png';
TEXTURES.WITH_FRIEND = 'messages/ja/with_friend.png';
TEXTURES.GAME_START = 'messages/ja/game_start.png';

TEXTURES.SITTING_PIKACHU = 'sitting_pikachu.png';

const SOUNDS = ASSETS_PATH.SOUNDS;
SOUNDS.BGM = './sound/bgm.mp3';
SOUNDS.PIPIKACHU = './sound/WAVE140_1.wav';
SOUNDS.PIKA = './sound/WAVE141_1.wav';
SOUNDS.CHU = './sound/WAVE142_1.wav';
SOUNDS.PI = './sound/WAVE143_1.wav';
SOUNDS.PIKACHU = './sound/WAVE144_1.wav';
SOUNDS.POWERHIT = './sound/WAVE145_1.wav';
SOUNDS.BALLTOUCHESGROUND = './sound/WAVE146_1.wav';
