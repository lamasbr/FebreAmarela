var FebreAmarela =  FebreAmarela || {};

FebreAmarela.GameStateDeserto = {

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

        this.game.world.setBounds(0, 0, 3000, 450);
    },

    preload: function () {
        this.load.image('background', 'assets/images/backgrounds/deserto.png');
        this.load.image('platforma', 'assets/images/plataformas/areia/areiaGrande.png');
        this.load.image('platformaPequena', 'assets/images/plataformas/areia/areiaPequena.png');
        this.load.image('ponte', 'assets/images/plataformas/areia/ponteDetalhe.png');
        this.load.image('pneu', 'assets/images/lixos/pneu.png');
        this.load.image('garrafa', 'assets/images/lixos/garrafa.png');
        this.load.image('planta', 'assets/images/lixos/planta.png');
        this.load.image('start', 'assets/images/start.png');
        this.load.image('goal', 'assets/images/goal.png');
        this.load.image('knife', 'assets/images/player/knife.png');

        this.load.spritesheet('player', 'assets/images/player/player_spritesheet.png', 82,100,11,0,0);
        this.load.spritesheet('mosquito', 'assets/images/inimigos/mosquito_spritesheet2.png', 36, 18, 2, 1, 2);

        this.load.text('deserto', 'assets/data/deserto.json');
    },

    create: function () {
        this.levelData = JSON.parse(this.game.cache.getText('deserto'));
        this.background = this.game.add.tileSprite(0, 0, 3000, 450, 'background');

        this.createGameSet();

        this.createStart();
        this.createGoal();

        this.initPlayerKnifes();

        this.player = new FebreAmarela.Player(this.game, this.levelData, this.cursors, this.shootKey, this.playerKnifes);
        this.game.add.existing(this.player);

        this.createLixos();
        this.createMosquitos();

        this.createHUDMosquitos();
        this.createHUDLixos();
    },

    update: function () {
        this.background.tilePosition.x = 0.5;
        this.game.physics.arcade.collide(this.player, this.platforms);
        this.game.physics.arcade.overlap(this.player, this.mosquitos, this.killPlayer, null, this);
        this.game.physics.arcade.overlap(this.playerKnifes, this.mosquitos, this.killMosquito, null, this);
        this.game.physics.arcade.overlap(this.player, this.lixos, this.recolheLixo, null, this);
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

    createHUDMosquitos: function(){
        this.scoreHUD1 = this.game.add.text(20, 15, "Mosquitos: " + this.scoreMosquitos, {font: "20px Arial Black", fill: "#ffd200", align: "center"});

        this.scoreHUD1.stroke = "#d9c32d";
        this.scoreHUD1.strokeThickness = 5;
        this.scoreHUD1.setShadow(2, 2, "#333333", 2, true, true);
        this.scoreHUD1.fixedToCamera = true;
    },

    createHUDLixos: function(){
        this.scoreHUD2 = this.game.add.text(20, 40, "Lixos: " + this.scoreLixos, {font: "20px Arial Black", fill: "#ffd200", align: "center"});

        this.scoreHUD2.stroke = "#d9c32d";
        this.scoreHUD2.strokeThickness = 5;
        this.scoreHUD2.setShadow(2, 2, "#333333", 2, true, true);
        this.scoreHUD2.fixedToCamera = true;
    },

    initPlayerKnifes: function(){
        this.playerKnifes = this.add.group();
        this.playerKnifes.enableBody = true;
        this.playerKnifes.physicsBodyType = Phaser.Physics.ARCADE;
    },

    createMosquitos: function(){
        this.mosquitos = this.add.group();
        this.mosquitos.enableBody = true;
        this.levelData.mosquitos.forEach(function (element){
            var mosquito = new FebreAmarela.Mosquito(this.game, element.x, element.y, 'mosquito', element.points);
            this.mosquitos.add(mosquito);
            this.scoreMosquitos += 1;
        }, this);
        this.mosquitos.setAll('body.allowGravity', false);
    },

    createLixos: function(){
        this.lixos = this.add.group();
        this.lixos.enableBody = true;
        this.levelData.lixos.forEach(function (element) {
            lixo = this.lixos.create(element.x, element.y, element.img);
            this.scoreLixos += 1;
        }, this);
        this.lixos.setAll('body.allowGravity', false);
    },

    recolheLixo: function(player, lixo){
        lixo.kill();
        lixo.destroy();

        this.scoreLixos -= 1;
        this.scoreHUD2.setText("Lixos: " + this.scoreLixos);
    },

    killPlayer: function(){
        game.state.start('GameStateGameOver');
    },

    killMosquito: function(knife, mosquito){
        mosquito.kill();
        knife.kill();

        this.scoreMosquitos -= 1;
        this.scoreHUD1.setText("Mosquitos: " + this.scoreMosquitos);
    },

    win: function(){
        if(this.scoreMosquitos === 0 && this.scoreLixos === 0){
            game.state.start('GameStateBoss');
        }
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