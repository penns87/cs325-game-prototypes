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
        this.background = null;
        this.pirateship = null;
        this.cursors = null;
        this.crosshair = null;
        this.gold = 0;
        this.text = null;
        this.timer = null;
        this.finalText = null;
        this.music = null;
    }

    preload() {
      this.load.image("background", "assets/Ocean.png");
      this.load.image("pirateship", "assets/PirateShip.png");
      this.load.image("othership", "assets/OtherShip.png");
      this.load.image("crosshair", "assets/Crosshair.png");
      this.load.audio("seashanty", "assets/SeaShanty.mp3");
    }

    create() {
      this.background = this.add.image(400, 300, "background").setScale(1.68);

      this.music = this.sound.add('seashanty', {loop: true});
      this.music.setVolume(0.3);
      this.music.play();

      this.text = this.add.text(10, 120, '', {font: '48px Arial', fill: '#000000'});
      this.finalText = this.add.text(115, 300, '', {font: '48px Arial', fill: '#000000'});
      this.timer = this.time.addEvent({delay: 60000, callback:this.gameOver, callbackScope:this});

      this.pirateship = this.physics.add.image(400, 350, "pirateship").setScale(0.2);
      this.pirateship.setSize(200, 100, true);
      this.pirateship.setCollideWorldBounds(true);
      this.pirateship.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0,285,800,165));

      var x = Phaser.Math.Between(50, 750);
      var y = Phaser.Math.Between(300, 450);

      while(Phaser.Math.Difference(x, this.pirateship.x) <= 50) {
        x = Phaser.Math.Between(50, 750);
      }

      while(Phaser.Math.Difference(y, this.pirateship.y) <= 30) {
        y = Phaser.Math.Between(300, 450);
      }

      this.othership = this.physics.add.image(x, y, 'othership').setScale(0.2);
      this.othership.setSize(200, 100, true);

      this.physics.add.overlap(this.pirateship, this.othership, (x,y) => this.attackShip(x,y));

      this.cursors = this.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN');
    }

    update() {
      if(this.cursors.LEFT.isDown) {
        this.pirateship.x -= 1;
      }
      else if(this.cursors.RIGHT.isDown) {
        this.pirateship.x += 1;
      }
      else if(this.cursors.UP.isDown) {
        this.pirateship.y -= 1;
      }
      else if(this.cursors.DOWN.isDown) {
        this.pirateship.y += 1;
      }

      this.text.setText('Time left: ' + (Math.floor(60000 - this.timer.getElapsed()) / 1000) + '\nGold: ' + this.gold);
    }

    attackShip(pirateship, othership) {
/*
      this.input.keyboard.enabled = false;
      this.cursors.LEFT.isDown = false;
      this.cursors.RIGHT.isDown = false;
      this.cursors.UP.isDown = false;
      this.cursors.DOWN.isDown = false;

      this.crosshair = this.physics.add.image(400,300,'crosshair');
      this.crosshair.setInteractive();
      this.input.on('gameobjectdown', this.onClicked);
*/
      this.gold += 500;

      var x = Phaser.Math.Between(50, 750);
      var y = Phaser.Math.Between(300, 450);

      while(Phaser.Math.Difference(x, this.pirateship.x) <= 50) {
        x = Phaser.Math.Between(50, 750);
      }

      while(Phaser.Math.Difference(y, this.pirateship.y) <= 30) {
        y = Phaser.Math.Between(300, 450);
      }

      othership.destroy();
      this.othership = this.physics.add.image(x, y, 'othership').setScale(0.2);
      this.othership.setSize(200, 100, true);
      this.physics.add.overlap(this.pirateship, this.othership, (x,y) => this.attackShip(x,y));
    }
/*
    onClicked(pointer, gameObject) {
      gameObject.destroy();
      this.input.keyboard.enabled = true;
      this.gold += 500;
    }
*/
    gameOver() {
      this.pirateship.destroy();
      this.othership.destroy();
      this.finalText.setText('You plundered ' + this.gold + ' gold');
      //this.crosshair.destroy();
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
