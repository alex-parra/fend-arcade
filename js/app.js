/**
 * FROGGER HTML5 CANVAS GAME
 * by Alex Parra da Silva for Udacity FEND
 * more info: https://github.com/alex-parra/fend-arcade
 */

var logged = 0;
var allEnemies = [];
var player = null;




//---------------------------------------------------------------------------
// !- APP object

var APP = {
  sceneW: 505, // canvas width. See engine.js
  sceneH: 606, // canvas height. See engine.js
  enemies: 10, // how many enemies to draw
  levelTime: 5, // seconds

  gameStarted: 0, // Flag to keep game status. Never played.
  gameOver: 0, // Flag to keep game status. Player lost all health.
  levelUp: 0, // Flag to keep game status. Player is between levels.

  init: function(){
    player = new Player();
    this.generateEnemies();

    // Let's tweak the appearance a bit. Thinking GameBoy.
    jQuery(function($){
      var gameFrame = $('<div class="game-frame" />');
      gameFrame.append('<div class="canvas-wrap" />');
      gameFrame.find('.canvas-wrap').append($('canvas'));
      $('body').prepend(gameFrame);
      var gameTips = $('<div class="game-tips" />');
      gameTips.append('<p>Use ARROWS to move your character</p>');
      gameTips.append('<p>LEVEL UP by dodging BUGS for time required by level</p>');
      gameTips.append('<p>Avoid the BUGS, the WATER, the game EDGES and the GRASS</p>');
      gameFrame.append(gameTips);
    });
  },

  // Randomly return a position (one of the rows) for each enemy
  randomEnemyRow: function(){
    var rowsY = [APP.sceneH/2 - 80, APP.sceneH/2 - 165, APP.sceneH/2 - 250];
    return rowsY[this.randomInt(0, rowsY.length)];
  },

  // Random int function. min inclusive, max exclusive.
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  randomInt: function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Rounding Error safe function
  // see: http://www.jacklmoore.com/notes/rounding-in-javascript/
  roundNum: function(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  },

  // Get the Player current level
  getPlayerLevel: function(){
    return player.level;
  },

  // Get Level Passing Target Time.
  getLevelTime: function(){
    return this.getPlayerLevel() * this.levelTime;
  },

  // Start game, Start Level, Restart Game
  handleInput: function(key, evt){
    if( key === 'SPACE' && this.gameStarted === 0 ) {
      this._startGame();
    }
    if( key === 'SPACE' && this.levelUp === 1 ) {
      this.levelUp = 0;
    }
    if( key === 'SPACE' && this.gameOver === 1 ) {
      this._restartGame();
    }
  },

  // To begin, we only need to set the flag
  _startGame: function(){
    this.gameStarted = 1;
  },

  // Reset the game entities and flags
  _restartGame: function(){
    this.gameStarted = 1;
    this.gameOver = 0;
    this.generateEnemies();
    player = new Player();
  },

  // Check if Player has reached Level Target Time
  checkScore: function(){
    var score = player.score;
    if( this.getLevelTime() <= score ) {
      this.setLevelUp();
    }
  },

  // Set the Level up flag, regenerate enemies to increase speed, trigger player level up
  setLevelUp: function(){
    this.levelUp = 1;
    this.generateEnemies();
    player.doLevelUp();
  },

  // Instantiate Enemies
  generateEnemies: function(){
    allEnemies = []; // make sure the enemies array is empty;
    for(var i=0; i < this.enemies; i++ ) {
      allEnemies.push(new Enemy());
    }
  },

  // This function is called at Player.update()
  // Ideally, the Engine.update would call this but I wanted to leave engine.js untouched
  update: function(){
    if( player.health === 0 ) {
      this.gameOver = 1;
    }
  },

  // Renders APP related screen elements.
  // This function is called at Player.render(). See APP.update() comments
  screenRender: function(){
    // Footer credit. All screens
    ctx.clearRect(0, APP.sceneH-20, APP.sceneW, 20);
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'right';
    ctx.fillStyle = "#555";
    ctx.font = "normal 10px Helvetica";
    ctx.fillText('Game developed by Alex Parra @ Udacity FEND', APP.sceneW-5, APP.sceneH-3);

    if( this.gameStarted === 0 ) {
      this._gameStartScreen();
      return;
    } else if( this.levelUp ) {
      this._levelUpScreen();
      return;
    } else if( this.gameOver === 1 ) {
      this._gameOverScreen();
      return;
    } else {
      ctx.clearRect(0,0,APP.sceneW, 50); // clear the game stats at the top

      // Health Stat
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.fillStyle = "#BB453E";
      if( player.health > 20 ) {
        ctx.fillStyle = "#BFB540";
      }
      if( player.health > 50 ) {
        ctx.fillStyle = "#46B03B";
      }
      ctx.font = "normal 20px Helvetica";
      ctx.fillText('\u2764 '+ this.roundNum(player.health, 0), 5, 18);

      // Level Stat
      ctx.textBaseline = 'top';
      ctx.textAlign = 'right';
      ctx.fillStyle = "#111111";
      ctx.font = "normal 20px Helvetica";
      ctx.fillText('\u272A '+ player.level, APP.sceneW-5, 15);
      ctx.font = "normal 12px Helvetica";
      ctx.fillText('Target: '+ this.getLevelTime() +'s', APP.sceneW-5, 35);

      // Score Stat
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.fillStyle = "#111111";
      ctx.font = "bold 24px Helvetica";
      ctx.fillText(this.roundNum(player.score, 1)+'s', APP.sceneW/2, 18);
    }
  },

  // Renders the game start Screen
  _gameStartScreen: function(){
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 50, APP.sceneW, APP.sceneH-70);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    ctx.font = "normal 20px Helvetica";
    ctx.fillStyle = "#eeeeee";
    ctx.fillText('welcome to', APP.sceneW/2, APP.sceneH/2 - 40);

    ctx.font = "bold 40px Helvetica";
    ctx.fillStyle = "#ffffff";
    ctx.fillText('~ FROGGER ~', APP.sceneW/2, APP.sceneH/2);

    ctx.font = "normal 12px Helvetica";
    ctx.fillStyle = "#ffffff";
    ctx.fillText('TIP: The GRASS has tiny invisible BUGS that slowly eat your feet!', APP.sceneW/2, 150+APP.sceneH/2);

    ctx.textBaseline = 'bottom';
    ctx.font = "normal 20px Helvetica";
    ctx.fillStyle = "#ffffff";
    ctx.fillText('Press SPACE to start.', APP.sceneW/2, APP.sceneH - 30);
  },

  // Render the Level Up screen
  _levelUpScreen: function(){
    ctx.clearRect(0,0,APP.sceneW, 50); // clear the game stats at the top

    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 50, APP.sceneW, APP.sceneH-70);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = "bold 40px Helvetica";
    ctx.fillStyle = "#46B03B";
    ctx.fillText('Level '+ player.level, APP.sceneW/2, APP.sceneH/2);
    ctx.font = "bold 20px Helvetica";
    ctx.fillStyle = "#ffffff";
    ctx.fillText('Target Time: '+ this.getLevelTime() +'secs', APP.sceneW/2, 30+APP.sceneH/2);

    ctx.textBaseline = 'bottom';
    ctx.font = "normal 20px Helvetica";
    ctx.fillStyle = "#ffffff";
    ctx.fillText('Press SPACE to start level.', APP.sceneW/2, APP.sceneH - 30);
  },

  // Renders the GAME OVER screen
  _gameOverScreen: function(){
    ctx.clearRect(0,0,APP.sceneW, 50); // clear the game stats at the top

    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 50, APP.sceneW, APP.sceneH-70);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = "bold 40px Helvetica";
    ctx.fillStyle = "#ff0000";
    ctx.fillText('Game Over', APP.sceneW/2, APP.sceneH/2);

    ctx.textBaseline = 'bottom';
    ctx.font = "normal 20px Helvetica";
    ctx.fillStyle = "#ffffff";
    ctx.fillText('Press SPACE to play again.', APP.sceneW/2, APP.sceneH - 30);
  },

  // Utility to check if Game is "ongoing"
  playerCanMove: function(){
    return ( this.gameStarted === 1 && this.levelUp === 0 && this.gameOver === 0 );
  }

};




//---------------------------------------------------------------------------
// !- ENEMY

// Enemies our player must avoid
var Enemy = function() {
  this.reset = 1;
  this.x = 0;
  this.y = 0;
  this.speed = 0;
  this.sprite = 'images/enemy-bug.png';
  this.width = 101;
  this.height = 171;
  this.topOffset = -50;
  this.strength = 0;
  this.doReset();
};

// The hit box defines an area around the center of the BUG that triggers collisions.
Enemy.prototype.getHitBox = function(){
  var x1 = this.x + 18;
  var y1 = this.y + 90;
  var x2 = x1 + 75;
  var y2 = y1 + 40;
  return {xLeft:x1, yTop:y1, xRight:x2, yBottom:y2, w: x2-x1, h: y2-y1};
};

// Reset the enemy props
Enemy.prototype.doReset = function(){
  if( this.reset === 1 ) {
    this.x = -1 * this.width * APP.randomInt(1,10);
    this.y = APP.randomEnemyRow();
    this.speed = APP.randomInt(20, 60) * APP.getPlayerLevel(); // pixels / second
    this.strength = Math.floor(this.speed/10);
    this.reset = 0;
  }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // multiply any movement by "dt" parameter to ensure the same speed for all computers.
  this.x += Math.round(this.speed * dt);
  if( this.x > APP.sceneW ) {
    this.reset = 1;
  }

  this.doReset();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};







//---------------------------------------------------------------------------
// !- PLAYER

// This class requires an update(), render() and a handleInput() method.
var Player = function() {
  this.reset = 1;
  this.x = 0;
  this.y = 0;
  this.width = 101;
  this.height = 171;
  this.topOffset = -50; // the image has a lot of white space. This "offset" is used to position the player easily
  this.sprite = 'images/char-boy.png';
  this.maxY = APP.sceneH - this.height + this.topOffset; // How far down the player can go. Bottom grass row

  this.score = 0;
  this.health = 100;
  this.level = 1;

  this.doReset();
};

// The hit box defines an area around the center of the PLAYER that triggers collisions.
Player.prototype.getHitBox = function(){
  var x1 = this.x + 31;
  var y1 = this.y + 100;
  var x2 = x1 + 40;
  var y2 = y1 + 40;
  return {xLeft:x1, yTop:y1, xRight:x2, yBottom:y2, w: x2-x1, h: y2-y1};
};

// Reset the Player props
Player.prototype.doReset = function(){
  if( this.reset === 1 ) {
    this.reset = 0;
    this.x = Math.floor( (APP.sceneW/2) - (this.width/2) );
    this.y = Math.floor( APP.sceneH - this.height + this.topOffset - (this.height/2) );
  }
};

// Check player various props and trigger APP.update()
// This method is called by Engine.updateEntities()
Player.prototype.update = function(dt){
  this.checkPositionIsValid();
  this.checkEnemyCollisions();
  this.checkHealth();
  this.doReset();

  this.updateScore(dt);

  APP.update(); // Ideally this should be called by Engine.updateEntities, but I wanted to leave engine.js untouched.
};

// Render the Player character on screen and trigger APP.renderScreen()
// This function is called by Engine.renderEntities.
Player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

  APP.screenRender(); // Ideally this should be called by Engine.updateEntities, but I wanted to leave engine.js untouched.
};

// Respond to valid keyboard commands
Player.prototype.handleInput = function(keyString, evt){
  if( APP.playerCanMove() && ['up', 'right', 'down', 'left'].indexOf(keyString) !== undefined ) {
    this.move(keyString);
    evt.preventDefault();
  }
};

// Move the player up/down/left/right
Player.prototype.move = function(dir){
  switch( dir ) {
    case 'up':
    case 'down':
      var dirNum = ( dir === 'up' ) ? -1 : 1;
      this.y += Math.floor(this.height/2) * dirNum;
    break;
    case 'left':
    case 'right':
      var dirNum = ( dir === 'left' ) ? -1 : 1;
      this.x += Math.floor(this.width) * dirNum;
    break;
  }
};

// Check if the Player is in a valid position.
Player.prototype.checkPositionIsValid = function(){
  var valid = true;
  if( this.x < 0 || this.x >= APP.sceneW ) {
    valid = false;
  }
  if( this.y < 0 || this.y > this.maxY ) {
    valid = false;
  }
  if( valid === false ) {
    this.outOfBounds();
  }
};

// Test is Player is bitten by some Enemy
Player.prototype.checkEnemyCollisions = function(){
  // no need to check collisions if we're already in "reset mode"
  if( this.reset === 1 ) return;

  var playerBox = this.getHitBox();
  
  // TODO: replace for..in with forEach or for
  for( enemyIndex in allEnemies ) {
    var enemyBox = allEnemies[enemyIndex].getHitBox();

    if( enemyBox.xRight < 0 ) {
      continue; // If the enemy has not entered the scene, skip it early.
    }

    // Test for HitBox Overlaping
    if( enemyBox.xLeft < playerBox.xRight && enemyBox.xRight > playerBox.xLeft && enemyBox.yTop < playerBox.yBottom && enemyBox.yBottom > playerBox.yTop ) {
      this.bugBite(allEnemies[enemyIndex].strength);
      break; // no need to check other enemies
    }
  }
};

// Update Player when bitten
Player.prototype.bugBite = function(damage){
  this.reset = 1;
  this.health = this.health - damage;
};

// Update Player when out-of-bounds
Player.prototype.outOfBounds = function(){
  this.reset = 1;
  this.health = this.health - 1;
};

// Check Player Health
Player.prototype.checkHealth = function(){
  if( this.health > 100 ) {
    this.health = 100;
  }
  if( this.health <= 0 ) {
    this.health = 0;
    APP.gameOver = 1;
  }
};

// Update Player Score
Player.prototype.updateScore = function(dt){
  var grassY = Math.floor( APP.sceneH - this.height + this.topOffset - (this.height/2) );
  if( this.y < grassY ) {
    this.score += dt;
  } else if( APP.playerCanMove() ) {
    // The GRASS has little invisible bugs that slowly eat your feet!
    this.health -= this.level * dt;
  }
  APP.checkScore();
};

// Update Player for new Level
Player.prototype.doLevelUp = function(){
  this.level += 1;
  this.health += this.level * 2;
  this.score = 0;
  this.reset = 1;
  this.doReset();
};

//---------------------------------------------------------------------------
// !- LOAD THE GAME

APP.init();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
//
// This Listner needs to be after APP.init so that the player var has been instanciated
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  allowedKeys[32] = 'SPACE';
  if( e.keyCode === 32 ) {
    APP.handleInput(allowedKeys[e.keyCode], e);
  }

  player.handleInput(allowedKeys[e.keyCode], e);
});

