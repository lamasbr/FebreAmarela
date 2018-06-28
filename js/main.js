// inicializando o framework
var game = new Phaser.Game(1024,450, Phaser.AUTO);

game.state.add('GameStateIntro', FebreAmarela.GameStateIntro);
game.state.add('GameStateInstrucoes', FebreAmarela.GameStateInstrucoes);
game.state.add('GameStateFloresta', FebreAmarela.GameStateFloresta);
game.state.add('GameStateCerrado', FebreAmarela.GameStateCerrado);
game.state.add('GameStateDeserto', FebreAmarela.GameStateDeserto);
game.state.add('GameStateBoss', FebreAmarela.GameStateBoss);
game.state.add('GameStateGameOver', FebreAmarela.GameStateGameOver);
game.state.add('GameStateGameWin', FebreAmarela.GameStateGameWin);
game.state.start('GameStateIntro');