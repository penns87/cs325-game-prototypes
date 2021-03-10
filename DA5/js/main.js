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
        this.tiles = null;
        this.map = null;
        this.level = null;
        this.player = null;
        this.cursors = null;
        this.coins = null;
        this.bombs = null;
        this.gameOver = false;
        this.score = 0;
        this.text = null;
        this.music = null;
    }

    preload() {
      this.load.image("background", "assets/Background.png");
      this.load.image("tiles", "assets/Tileset.png");
      this.load.image("bomb", "assets/bomb.png");
      this.load.tilemapTiledJSON("levelone", "assets/levelone.json");
      this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48 });
      this.load.spritesheet('coin', 'assets/Coin.png', {frameWidth: 10, frameHeight: 10 });
      this.load.audio('swing3', 'assets/swing3.mp3');
    }

    create() {
      this.background = this.add.image(400,300,"background").setScale(1.5);

      this.map = this.make.tilemap({key:"levelone"});

      this.tiles = this.map.addTilesetImage("Tileset", "tiles");

      this.level = this.map.createStaticLayer("Tile Layer 1", this.tiles, 0, 0);
      this.level.setCollisionByProperty({collides:true});

      this.player = this.physics.add.sprite(130, 470, 'dude');
      this.player.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0,50,800,500));

      this.player.setBounce(0.1);
      this.player.setCollideWorldBounds(true);

      this.text = this.add.text(10, 70, "Score: 0", { fontSize: '32px', fill: '#fff' });

      this.music = this.sound.add('swing3', { loop: true });
      this.music.setVolume(0.2);
      this.music.play();

      this.anims.create({
        key: 'shine',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

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

    this.physics.add.collider(this.player, this.level);

    this.coins = this.physics.add.group();
    this.physics.add.collider(this.coins, this.level);

    var range = 50;
    for(var i = 0; i < 4; i++) {
      var coin = this.coins.create(range, 400, 'coin').setScale(1.5);
      coin.setCollideWorldBounds(true);
      coin.play('shine');
      coin = this.coins.create(range, 170, 'coin').setScale(1.5);
      coin.setCollideWorldBounds(true);
      coin.play('shine');
      range = range + 50;
    }

    range = 410;
    for(var i = 0; i < 4; i++) {
      var coin = this.coins.create(range, 300, 'coin').setScale(1.5);
      coin.setCollideWorldBounds(true);
      coin.play('shine');
      range = range + 50;
    }

    range = 610;
    for(var i = 0; i < 4; i++) {
      var coin = this.coins.create(range, 170, 'coin').setScale(1.5);
      coin.setCollideWorldBounds(true);
      coin.play('shine');
      range = range + 50;
    }

    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.level);

    this.physics.add.overlap(this.player, this.coins, (x,y) => this.collectCoin(x,y));

    this.physics.add.overlap(this.player, this.bombs, (x,y) => this.hitBomb(x,y));
    }

    update() {
      if (this.gameOver)
      {
        return;
      }
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

    if (this.cursors.up.isDown && this.player.body.onFloor())
    {
        this.player.setVelocityY(-330);
    }
    }

    collectCoin(player, coin) {
      coin.disableBody(true, true);

      this.score += 1;
      this.text.setText("Score: " + this.score);

      if(this.coins.countActive(true) === 0) {
        var range = 50;
        for(var i = 0; i < 4; i++) {
          var coin = this.coins.create(range, 400, 'coin').setScale(1.5);
          coin.setCollideWorldBounds(true);
          coin.play('shine');
          coin = this.coins.create(range, 170, 'coin').setScale(1.5);
          coin.setCollideWorldBounds(true);
          coin.play('shine');
          range = range + 50;
        }

        range = 410;
        for(var i = 0; i < 4; i++) {
          var coin = this.coins.create(range, 300, 'coin').setScale(1.5);
          coin.setCollideWorldBounds(true);
          coin.play('shine');
          range = range + 50;
        }

        range = 610;
        for(var i = 0; i < 4; i++) {
          var coin = this.coins.create(range, 170, 'coin').setScale(1.5);
          coin.setCollideWorldBounds(true);
          coin.play('shine');
          range = range + 50;
        }

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = this.bombs.create(x, 150, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }

    hitBomb(player, bomb) {
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play('turn');
      this.gameOver = true;
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: levelOne,
    physics: { default: 'arcade', arcade: { gravity: { y: 400 } } }
    });
