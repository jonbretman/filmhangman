### Film Hangman

To run locally clone repo, install dependencies, build and start server.

```sh
$ git clone https://github.com/jonbretman/filmhangman.git
$ cd filmhangman
$ npm install
$ grunt
$ node ./app.js
```

### Technologies / Libraries used
* Canvas
* CSS3 Transitions
* localStorage
* SASS (CSS Preprocessor)
* RequireJS (AMD)
* Underscore.js (Utility library)
* Node (For Grunt and Express)
* Grunt (Build process)
* Express (For simple local server)

### Improvements

If I was to continue development of this I would make the following improvements.

* Design and UI - I am definitely not a designer but think with a bit more time could make the UI a lot nicer.
* Use a Movie database for pulling in films. I think that https://www.themoviedb.org would probably be a good choice.
* Show the movie poster below the letters blurred out, and then un-blur it when the user guessed correctly.
* Use templates (mustache / handlebars etc..) instead of creating DOM elements in JS. Although ok for a simple project this does not scale well.
* Write some tests - really wanted to do this but didn't have time in the end.