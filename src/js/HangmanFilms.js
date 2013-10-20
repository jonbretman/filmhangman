define('HangmanFilms', function () {

    var hasLocalStorage = (function () {

        if (!window.localStorage) {
            return false;
        }

        try {
            localStorage.setItem('foo', 'bar');
            return localStorage.getItem('foo') === 'bar';
        }
        catch (e) {
            return false;
        }

    })();

    var HangmanFilms = function () {
        this.load_();
    };

    HangmanFilms.prototype = {

        completed_: [],

        films_: [
            'Unbreakable',
            'The Green Mile',
            'Saving Private Ryan',
            'Ghostbusters',
            'Sin City',
            'Captain America',
            'Avengers Assemble',
            'Schindlers List',
            'The Boy in the Striped Pyjamas'
        ],

        currentFilm_: null,

        load_: function () {

            if (hasLocalStorage) {
                try {
                    var data = JSON.parse(localStorage.getItem('hangman_films'));
                    this.completed_ = data.completed;
                    this.films_ = data.films;
                }
                catch (e) {
                }
            }

        },

        save_: function () {

            if (hasLocalStorage) {
                localStorage.setItem('hangman_films', JSON.stringify({
                    films: this.films_,
                    completed: this.completed_
                }));
            }

        },

        getCurrent: function () {
            return this.films_[this.films_.length - 1];
        },

        getNext: function () {

            // if we've run out of films swap the lists
            if (this.films_.length === 0) {
                this.films_ = this.completed_;
                this.completed_.length = 0;
            }

            // if there is a current film add it to the completed list
            if (this.currentFilm_) {
                this.completed_.unshift(this.films_.pop());
                this.save_();
            }

            // return the film at the end of the list
            this.currentFilm_ = this.films_[this.films_.length - 1];
            return this.currentFilm_;
        }

    };

    return HangmanFilms;
});