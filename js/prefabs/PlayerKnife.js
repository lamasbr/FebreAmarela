// namespace
var FebreAmarela = FebreAmarela || {};

// construtor objeto
FebreAmarela.PlayerKnife = function (game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'knife');

    this.anchor.setTo(0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
};

FebreAmarela.PlayerKnife.prototype = Object.create(Phaser.Sprite.prototype);
FebreAmarela.PlayerKnife.prototype.constructor = FebreAmarela.PlayerKnife;