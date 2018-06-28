var FebreAmarela = FebreAmarela || {};

FebreAmarela.Player = function (game, data, cursors, shootKey, playerKnifes) {
    Phaser.Sprite.call(this, game, data.player.x, data.player.y, 'player', 0);

    this.data = data;
    this.cursors = cursors;
    this.shootKey = shootKey;
    this.playerKnifes = playerKnifes;
    this.direcao = 1;

    this.anchor.setTo(0.5);
    this.animations.add('walking', [1,2,3,4,5,6,7,8,9,10], 10, true);
    this.game.physics.arcade.enable(this);
    this.customParams = {};

    this.body.collideWorldBounds = true;
    game.camera.follow(this);
};

FebreAmarela.Player.prototype = Object.create(Phaser.Sprite.prototype);

FebreAmarela.Player.prototype.constructor = FebreAmarela.Player;

FebreAmarela.Player.prototype.createPlayerKnifes = function (){
    var knife = this.playerKnifes.getFirstExists(false);
    if (!knife) {
        knife = new FebreAmarela.PlayerKnife(this.game, this.x, this.y);
        this.playerKnifes.add(knife);
    } else {
        knife.reset(this.x, this.y);
    }

    knife.scale.setTo(1 * this.direcao, 1);
    knife.body.velocity.x = 300 * this.direcao;
    knife.body.allowGravity = false;
};

FebreAmarela.Player.prototype.update = function (){
    this.body.velocity.x = 0;
    if(this.cursors.left.isDown){
        this.direcao = -1;
        this.body.velocity.x = -this.data.player.RUNNING_SPEED;
        this.scale.setTo(-1, 1);
        this.play('walking');
    }else if(this.cursors.right.isDown){
        this.direcao = 1;
        this.body.velocity.x = this.data.player.RUNNING_SPEED;
        this.scale.setTo(1, 1);
        this.play('walking');
    } else {
        this.animations.stop();
        this.frame = 0;
    }

    if((this.cursors.up.isDown) && this.body.touching.down){
        this.body.velocity.y = -this.data.player.JUMPING_SPEED;
    }

    if(this.shootKey.justDown){
        this.createPlayerKnifes();
    }
};