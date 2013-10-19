requirejs.config({

    shim: {
        'libs/underscore': {
            exports: '_'
        }
    }

});

require(['HangmanGame'], function (HangmanGame) {

    var game = new HangmanGame();
    game.start();

});