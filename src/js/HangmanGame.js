define(
    'HangmanGame',
    [
        'HangmanDrawing',
        'HangmanPhrase',
        'HangmanKeyboard'
    ],
    function (HangmanDrawing, HangmanPhrase, HangmanKeyboard) {

        var HangmanGame = function () {
            _.bindAll.apply(_, [this].concat(_.functions(this)));
        };

        HangmanGame.prototype = {

            start: function () {

                var drawing = new HangmanDrawing();
                drawing.appendTo(document.body);
                drawing.demo(function () {

                    // demo finished

                    // start game

                });

                var phrase = new HangmanPhrase('Saving Private Ryan');
                phrase.appendTo(document.body);

                var keyboard = new HangmanKeyboard();
                keyboard.appendTo(document.body);

                keyboard.on('letter', function (e) {

                    console.log(e.letter);

                });
            }

        };

        return HangmanGame;

});