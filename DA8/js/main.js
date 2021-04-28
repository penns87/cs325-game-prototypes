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

class levelOne extends Phaser.Scene {

    constructor() {
        super();
        this.background = null;
        this.ground = null;
        this.player = null;
        this.cursors = null;
        this.bombs = null;
        this.gameOver = false;
        this.text = null;
        this.music = null;
        this.spikes = null;
        this.spiketimer = null;
        this.clock = null;
    }

    preload() {
      this.load.image("background", "assets/Background.png");
      this.load.image("ground", "assets/ground.png");
      this.load.image("bomb", "assets/bomb.png");
      this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48 });
      this.load.audio('swing3', 'assets/swing3.mp3');
      this.load.image("spikes", "assets/spikes.png");
      this.load.plugin('rexclockplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexclockplugin.min.js', true);
    }

    create() {
      this.background = this.add.image(400,300,"background").setScale(1.5);

      this.ground = this.physics.add.staticGroup();
      this.ground.create(400, 800, "ground").setScale(2).refreshBody();

      this.player = this.physics.add.sprite(130, 450, 'dude');

      this.player.setBounce(0.1);
      this.player.setCollideWorldBounds(true);

      this.text = this.add.text(10, 70, '', { fontSize: '32px', fill: '#fff' });

      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.ground, this.player);

    //this.bombs = this.physics.add.group();
    //this.physics.add.collider(this.bombs, this.level);

    //this.physics.add.overlap(this.player, this.bombs, (x,y) => this.hitBomb(x,y));

    this.spiketimer = this.time.addEvent({delay: Phaser.Math.Between(3000, 7000), callback:this.spawnSpike, callbackScope:this});

    this.clock = this.plugins.get('rexclockplugin').add(this);
    this.clock.start();
    }

    update() {
      if (this.gameOver)
      {
        return;
      }

    this.player.anims.play('right', true);

    if (this.cursors.up.isDown && this.player.body.onFloor())
    {
        this.player.setVelocityY(-330);
    }

    this.text.setText('Time Survived: ' + (Phaser.Math.CeilTo(this.clock.now * 0.001)));
    }

    hitBomb(player, bomb) {
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play('turn');
      this.gameOver = true;
    }

    hitspikes(player, spikes) {
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play('turn');
      this.gameOver = true;
    }

    spawnSpike() {
      this.spikes = this.physics.add.group();
      var spike = this.spikes.create(800, 477, "spikes").setScale(3);
      spike.body.setAllowGravity(false);
      spike.setVelocityX(-200);
      spike.setSize(15, 3, true);
      this.physics.add.overlap(this.player, spike, (x,y) => this.hitspikes(x,y));
      spike = this.spikes.create(850, 477, "spikes").setScale(3);
      spike.body.setAllowGravity(false);
      spike.setVelocityX(-200);
      spike.setSize(15, 3, true);
      this.physics.add.overlap(this.player, spike, (x,y) => this.hitspikes(x,y));
      spike = this.spikes.create(900, 477, "spikes").setScale(3);
      spike.body.setAllowGravity(false);
      spike.setVelocityX(-200);
      spike.setSize(15, 3, true);
      this.physics.add.overlap(this.player, spike, (x,y) => this.hitspikes(x,y));
      this.spiketimer = this.time.addEvent({delay: Phaser.Math.Between(3000, 5000), callback:this.spawnSpike, callbackScope:this});
    }

}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: levelOne,
    physics: { default: 'arcade', arcade: { gravity: { y: 400 }, debug: false } }
    });
