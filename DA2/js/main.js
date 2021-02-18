import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

class MyScene extends Phaser.Scene {

    constructor() {
        super();
        this.ship = null;
        this.reticle = null;
        this.timer = null;
        this.text = null;
        this.score = 0;
        this.spriteBounds = null;
        this.explosion = null;
    }

    preload() {
      this.load.image('spaceship', 'assets/Spaceship.png');
      this.load.image('reticle', 'assets/Reticle.png');
      this.load.image('asteroid', 'assets/Asteroid.png');
      this.load.audio('explosion', 'assets/01_Explosion_v1.ogg');
    }

    create() {
      this.physics.world.setBounds(0, 0, 800*4, 600*4);

      this.ship = this.physics.add.image(400, 570, 'spaceship');

      this.explosion = this.sound.add('explosion', {loop: false});
      /*this.reticle = this.physics.add.image(400, 400, 'reticle');

      this.reticle.setCollideWorldBounds(true);

      game.canvas.addEventListener('mousedown', function () {
        game.input.mouse.requestPointerLock();
      });

      this.input.keyboard.on('keydown_Q', function (event) {
        if (game.input.mouse.locked) {
          game.input.mouse.releasePointerLock();
        }
      }, 0, this);

      this.input.on('pointermove', function (pointer) {
        if (this.input.mouse.locked) {
          this.reticle.x += pointer.movementX;
          this.reticle.y += pointer.movementY;
        }
      }, this);
*/
      this.input.on('pointermove', function (pointer) {
        var angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(this.ship.x, this.ship.y, pointer.x, pointer.y);
        this.ship.setAngle(angle);
      }, this);

      this.text = this.add.text(10, 10, '', {font: '48px Arial', fill: '#ffffff'});

      this.timer = this.time.addEvent({delay: 20000, callback:this.gameOver, callbackScope:this});

      this.spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -100, -100);

      for (var i = 0; i < 300; i++) {
        var pos = Phaser.Geom.Rectangle.Random(this.spriteBounds);
        var block = this.physics.add.image(pos.x, pos.y, 'asteroid');

        block.setInteractive();

        block.on('clicked', this.clickHandler, this);

        block.setVelocity(Phaser.Math.Between(200, 300), Phaser.Math.Between(200, 300));
        block.setBounce(1).setCollideWorldBounds(true);

        if(Math.random() > 0.5) {
          block.body.velocity.x *= -1;
        }
        else {
          block.body.velocity.y *= -1;
        }
      }

      this.input.on('gameobjectup', function (pointer, gameObject) {
        gameObject.emit('clicked', gameObject);
      }, this);

    }

    update() {
      this.text.setText('Time left: ' + (Math.floor(20000 - this.timer.getElapsed()) / 1000) + '\nScore: ' + this.score);
    }

    gameOver() {
      this.input.off('gameobjectup');
    }

    clickHandler(block) {
      this.score++;
      this.explosion.play();
      block.off('clicked', this.clickHandler);
      block.input.enabled = false;
      block.setVisible(false);
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
