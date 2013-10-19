define('HangmanGame', ['HangmanDrawing'], function (HangmanDrawing) {

    var HangmanGame = function () {

    };

    HangmanGame.prototype = {

        start: function () {
            var drawing = new HangmanDrawing();
            drawing.appendTo(document.body);

                drawing.drawBaseLeft(function () {
                    drawing.drawBaseRight(function () {
                        drawing.drawUpright(function () {
                            drawing.drawTopBeam(function () {
                                drawing.drawRope(function () {
                                    drawing.drawHead(function () {
                                        drawing.drawBody(function () {
                                            drawing.drawLegs(function () {
                                                drawing.drawArms_(function () {
                                                    drawing.clear();
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });

        }

    };

    return HangmanGame;

});