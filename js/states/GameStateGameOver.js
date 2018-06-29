// namespace (caso exista, usa, senão, cria vazio)
var FebreAmarela =  FebreAmarela || {};

FebreAmarela.GameStateGameOver = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.world.setBounds(0, 0, 1024, 450);
    },

    preload: function () {
        this.load.image('background', 'assets/images/backgrounds/floresta.png');
        this.load.image('gameOver', 'assets/images/gameOver.png');
        this.load.image('startGame', 'assets/images/btnStartGame.png');
    },

    create: function () {
        this.background = this.game.add.tileSprite(0, 0, 1024, 450, 'background');

        this.gameOver = this.add.sprite(this.game.world.centerX, this.game.world.centerY - 30, 'gameOver');
        this.gameOver.anchor.setTo(0.5);

        this.startGame = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 170, 'startGame');
        this.startGame.anchor.setTo(0.5);
        this.startGame.inputEnabled = true;
        this.startGame.input.pixelPerfectClick = true;
        this.startGame.events.onInputDown.add(this.listener, this);
    },

    update: function () {
        this.background.tilePosition.x = 0.5;
    },

    listener: function(){
        game.state.start('GameStateInstrucoes');
    }
};