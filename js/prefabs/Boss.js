var FebreAmarela = FebreAmarela || {};

FebreAmarela.Boss = function (game, x, y, key, health, points) {
    Phaser.Sprite.call(this, game, x, y, key);

    this.game = game;
    this.anchor.setTo(0.5);
    this.health = health;

    this.animations.add('movimento', [0,1], 10, true);
    this.play('movimento');

    this.pi = 0;
    this.path = [];
    this.createPath(points);

    this.game.physics.arcade.enable(this);
};

FebreAmarela.Boss.prototype = Object.create(Phaser.Sprite.prototype);
FebreAmarela.Boss.prototype.constructor = FebreAmarela.Boss;


FebreAmarela.Boss.prototype.update = function () {

    if (this.path.length > 0){
        this.position.x = this.path[this.pi].x;
        this.position.y = this.path[this.pi].y;
        this.pi++;

        if(this.pi >= this.path.length){
            this.pi = 0;
        }
    } else {
        if (this.position.x < 0.05 * this.game.world.width){
            this.position.x = 0.05 * this.game.world.width + 2;
            this.body.velocity.x *= -1;
        }else if (this.position.x > 0.95 * this.game.world.width){
            this.position.x = 0.95 * this.game.world.width - 2;
            this.body.velocity.x *= -1;
        }

        if (this.position.y < 0.05 * this.game.world.height){
            this.position.y = 0.05 * this.game.world.height + 2;
            this.body.velocity.y *= -1;
        }else if (this.position.y > 0.95 * this.game.world.height){
            this.position.y = 0.95 * this.game.world.height - 2;
            this.body.velocity.y *= -1;
        }
    }
};

FebreAmarela.Boss.prototype.damage = function (amount) {
    Phaser.Sprite.prototype.damage.call(this, amount);

    if (this.health <= 0){
        var emitter = this.game.add.emitter(this.x, this.y, 300);
        emitter.makeParticles('bossParticle');
        emitter.minParticleSpeed.setTo(-100, -100);
        emitter.maxParticleSpeed.setTo(300, 300);
        emitter.gravity = 0;
        emitter.start(true, 500, null, 500);
    }
};

FebreAmarela.Boss.prototype.createPath = function(points){
    if(points.x && points.x.length > 0){
        points.x.forEach(function(t,i,array){
            array[i] = t/640 * this.game.world.width;
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