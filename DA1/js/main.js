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
        this.platforms = null;
        this.player = null;
        this.cursors = null;
        this.bouncy = null;
        this.button = null;
        this.door = null;
    }

    preload() {
      this.load.image('sky', 'assets/sky.png');
      this.load.image('ground', 'assets/platform.png');
      this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48 });
      this.load.image('redbutton1', 'assets/RedButton1.png');
      this.load.image('redbutton2', 'assets/RedButton3.png');
      this.load.image('door1', 'assets/door1.png');
      this.load.image('door2', 'assets/door2.png');
    }

    create() {
      this.add.image(400, 300, 'sky');

      this.platforms = this.physics.add.staticGroup();
      this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
      this.platforms.create(400, 400, 'ground');

      this.player = this.physics.add.sprite(100, 450, 'dude');

      this.player.setBounce(0.1);
      this.player.setCollideWorldBounds(true);

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

    this.button = this.physics.add.image(400, 375, 'redbutton1');
    this.button.body.setAllowGravity(false);

    this.door = this.physics.add.image(750, 500, 'door1').setScale(.25).refreshBody();
    this.door.body.setAllowGravity(false);

    this.physics.add.collider(this.player, this.platforms);

    this.physics.add.overlap(this.player, this.button, (x,y) => this.pressButton(x,y));
    }

    pressButton(player, button) {
      this.button.disableBody(true, true);
      this.door.disableBody(true, true);
      this.button = this.physics.add.image(400, 395, 'redbutton2');
      this.button.body.setAllowGravity(false);
      this.door = this.physics.add.image(625, 375, 'door2').setScale(.25).refreshBody();
      this.door.body.setAllowGravity(false);
    }

    update() {
      if (this.cursors.left.isDown)
    {
        this.player.setVelocityX(-160);

        this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown)
    {
        this.player.setVelocityX(160);

        this.player.anims.play('right', true);
    }
    else
    {
        this.player.setVelocityX(0);

        this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down)
    {
        this.player.setVelocityY(-330);
    }
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade', arcade: { gravity: { y: 300 } } }
    });
