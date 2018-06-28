var FebreAmarela =  FebreAmarela || {};

FebreAmarela.GameStateBoss = {

    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1000;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.shootKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.scoreLixos = 0;
        this.scoreMosquitos = 0;

        this.game.world.setBounds(0, 0, 1024, 450);
    },

    preload: function () {
        this.load.image('background', 'assets/images/backgrounds/deserto.png');
        this.load.image('platforma', 'assets/images/plataformas/areia/areiaGrande.png');
        this.load.image('platformaPequena', 'assets/images/plataformas/areia/areiaPequena.png');
        this.load.image('ponte', 'assets/images/plataformas/areia/ponteDetalhe.png');
        this.load.image('start', 'assets/images/start.png');
        this.load.image('goal', 'assets/images/goal.png');

        this.load.spritesheet('player', 'assets/images/player/player_spritesheet.png', 82,100,11,0,0);
        this.load.image('knife', 'assets/images/player/knife.png');

        this.load.spritesheet('boss', 'assets/images/inimigos/boss_spritesheet.png', 172, 86, 2, 1, 2);
        this.load.image('bossParticle', 'assets/images/inimigos/particulaInimigo.png');

        this.load.text('bossData', 'assets/data/boss.json');
    },

    create: function () {
        this.levelData = JSON.parse(this.game.cache.getText('bossData'));
        this.background = this.game.add.tileSprite(0, 0, 1024, 450, 'background');

        this.createGameSet();

        this.createStart();
        this.createGoal();

        this.initPlayerKnifes();

        this.player = new FebreAmarela.Player(this.game, this.levelData, this.cursors, this.shootKey, this.playerKnifes);
        this.game.add.existing(this.player);

        this.initBoss();
    },

    update: function () {
        this.background.tilePosition.x = 0.5;
        this.game.physics.arcade.collide(this.player, this.platforms);
        this.game.physics.arcade.overlap(this.enemies, this.player, this.killPlayer, null, this);
        this.game.physics.arcade.overlap(this.playerKnifes, this.enemies, this.damageBoss, null, this);
        this.game.physics.arcade.overlap(this.player, this.goal, this.win, null, this);

        if(this.player.body.onFloor()){
            this.killPlayer();
        }
    },

    createGameSet: function(){
        this.platforms = this.add.group();
        this.platforms.enableBody = true;

        this.levelData.platformData.forEach(function (element) {
            this.platforms.create(element.x, element.y, element.tipo);
        }, this);

        this.platforms.setAll('body.allowGravity', false);
        this.platforms.setAll('body.immovable', true);
    },

    initPlayerKnifes: function(){
        this.playerKnifes = this.add.group();
        this.playerKnifes.enableBody = true;
        this.playerKnifes.physicsBodyType = Phaser.Physics.ARCADE;
    },

    killPlayer: function(){
        game.state.start('GameStateGameOver');
    },

    initBoss: function (){
        this.enemies = this.add.group();
        this.enemies.enableBody = true;

        var points = {
            "x": [591,181,618,166,501,601,224,591],
            "y": [52,167,211,21,279,133,249,52]
        };

        var boss = new FebreAmarela.Boss(this.game, 900, 80, 'boss', 10, points);
        this.enemies.add(boss);

        boss.body.velocity.x = 5; boss.body.velocity.y = 5;
    },

    damageBoss: function (knife, boss) {
        boss.damage(1);
        knife.kill();
    },

    win: function(){
        game.state.start('GameStateGameWin');
    },

    createStart: function(){
        this.start = this.add.sprite(this.levelData.start.x, this.levelData.start.y, 'start');
        this.game.physics.arcade.enable(this.start);
        this.start.body.allowGravity = false;
    },

    createGoal: function(){
        this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
        this.game.physics.arcade.enable(this.goal);
        this.goal.body.allowGravity = false;
    }
};