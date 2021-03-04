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
        this.trash = null;
        this.remaining = 160;
        this.text = null;
        this.info = null;
        this.win = null;
        this.lose = null;
        this.timer = null;
        this.music = null;
        this.winaudio = null;
        this.loseaudio = null;
    }

    preload() {
      this.load.image("background", "assets/PixelHouseItch.png");
      this.load.image("paper", "assets/paperball.png");
      this.load.audio("music", "assets/music.mp3");
      this.load.audio("win", "assets/win.mp3");
      this.load.audio("lose", "assets/lose.mp3");
    }

    create() {
      this.background = this.add.image(400,200,"background").setScale(3);

      this.music = this.sound.add('music', {loop: false});
      this.music.setVolume(0.3);
      this.music.play();

      this.winaudio = this.sound.add('win', {loop: false});
      this.winaudio.setVolume(0.3);

      this.loseaudio = this.sound.add('lose', {loop: false});
      this.loseaudio.setVolume(0.3);

      this.text = this.add.text(10, 10, '', {font: '36px Arial', fill: '#ffffff'});
      this.info = this.add.text(450,10,'', {font: '28px Arial', fill: '#ffffff'});
      this.win = this.add.text(10,550,'', {font: '36px Arial', fill: '#ffffff'});
      this.lose = this.add.text(590,550,'', {font: '36px Arial', fill: '#ffffff'});

      this.timer = this.time.addEvent({delay: 50000, callback:this.gameOver, callbackScope:this});

      this.input.setDefaultCursor('url(assets/cursor.cur), pointer');

      for(var i = 0; i < 100; i++) {
        var x = Phaser.Math.Between(200, 600);
        var y = Phaser.Math.Between(310, 455);
        this.trash = this.physics.add.image(x, y, "paper").setScale(0.05);
        this.trash.setInteractive();
        this.trash.on('clicked', this.clickHandler, this);
      }

      for(var i = 0; i < 20; i++) {
        var x = Phaser.Math.Between(310, 490);
        var y = Phaser.Math.Between(250, 300);
        this.trash = this.physics.add.image(x, y, "paper").setScale(0.05);
        this.trash.setInteractive();
        this.trash.on('clicked', this.clickHandler, this);
        x = Phaser.Math.Between(310, 490);
        y = Phaser.Math.Between(460, 510);
        this.trash = this.physics.add.image(x, y, "paper").setScale(0.05);
        this.trash.setInteractive();
        this.trash.on('clicked', this.clickHandler, this);
      }

      for(var i = 0; i < 10; i++) {
        var x = Phaser.Math.Between(100, 190);
        var y = Phaser.Math.Between(360, 410);
        this.trash = this.physics.add.image(x, y, "paper").setScale(0.05);
        this.trash.setInteractive();
        this.trash.on('clicked', this.clickHandler, this);
        x = Phaser.Math.Between(610, 700);
        y = Phaser.Math.Between(360, 410);
        this.trash = this.physics.add.image(x, y, "paper").setScale(0.05);
        this.trash.setInteractive();
        this.trash.on('clicked', this.clickHandler, this);
      }

      this.input.on('gameobjectup', function (pointer, gameObject) {
        gameObject.emit('clicked', gameObject);
      }, this);
    }

    clickHandler(trash) {
      this.remaining--;
      trash.off('clicked', this.clickHandler);
      trash.input.enabled = false;
      trash.setVisible(false);
    }

    gameOver() {
      this.input.off('gameobjectup');
      this.music.stop();
      if(this.remaining > 0) {
        this.lose.setText("YOU LOSE!");
        this.loseaudio.play();
      }
      else {
        this.win.setText("YOU WIN!");
        this.winaudio.play();
      }
    }

    update() {
      this.text.setText('Trash remaining: ' + this.remaining + '\nTime left: ' + (Math.floor(50000 - this.timer.getElapsed()) / 1000));
      this.info.setText("Your mom is coming home!\n\t\t\tClean your room before\n\t\t\t\t\t\tit's too late!");
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
