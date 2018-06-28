var FebreAmarela = FebreAmarela || {};

FebreAmarela.Mosquito = function (game, x, y, key, points) {
    Phaser.Sprite.call(this, game, x, y, key);

    this.game = game;
    this.anchor.setTo(0.5);

    this.animations.add('movimento', [0,1], 10, true);
    this.play('movimento');

    this.pi = 0;
    this.path = [];
    this.createPath(points);

    this.game.physics.arcade.enable(this);
};

FebreAmarela.Mosquito.prototype = Object.create(Phaser.Sprite.prototype);
FebreAmarela.Mosquito.prototype.constructor = FebreAmarela.Mosquito;


FebreAmarela.Mosquito.prototype.update = function () {

    if (this.path.length > 0){
        this.position.x = this.path[this.pi].x;
        this.position.y = this.path[this.pi].y;
        this.pi++;

        if(this.pi >= this.path.length){
            this.pi = 0;
        }
    } else {
        if (this.position.x < 0.01 * this.game.world.width){
            this.position.x = 0.01 * this.game.world.width + 2;
            this.body.velocity.x *= -1;
        }else if (this.position.x > 0.99 * this.game.world.width){
            this.position.x = 0.99 * this.game.world.width - 2;
            this.body.velocity.x *= -1;
        }
    }

    if (this.position.y > this.game.world.height){
        this.kill();
    }
};

FebreAmarela.Mosquito.prototype.createPath = function(points){
    if(points.x && points.x.length > 0){
        points.x.forEach(function(t,i,array){
            array[i] = t/3000 * this.game.world.width;
        }, this);

        var x = 1/500;

        for (var i = 0; i <= 1; i += x){
            var px = Phaser.Math.catmullRomInterpolation(points.x, i);
            var py = Phaser.Math.catmullRomInterpolation(points.y, i);
            this.path.push({ x: px, y: py });
        }
    } else {
        this.path = [];
    }
}