define('Events', ['libs/underscore'], function (_) {

    return {

        /**
         * Add an event listener
         * @param event
         * @param fn
         * @return {*}
         */
        on: function (event, fn) {
            this.__events__ = this.__events__ || {};
            if (!this.__events__[event]) {
                this.__events__[event] = [];
            }
            this.__events__[event].push(fn);
            return this;
        },

        once: function (event, fn) {
            var once = _.once(_.bind(function () {
                this.off(event, once);
                fn.apply(this, arguments);
            }, this));
            return this.on(event, once);
        },

        /**
         * Removes an event listener
         * @param event
         * @param fn
         * @return {*}
         */
        off: function (event, fn) {
            this.__events__ = this.__events__ || {};

            var events = this.__events__[event];
            if (!events || events.length === 0) {
                return this;
            }

            if (arguments.length < 2) {
                events.length = 0;
            }
            else {
                for (var i = 0; i < events.length; i++) {
                    if (events[i] === fn) {
                        events.splice(i, 1);
                    }
                }
            }

            return this;
        },

        /**
         * Triggers an event
         * @param event
         * @return {*}
         */
        trigger: function (event) {
            this.__events__ = this.__events__ || {};
            var events = this.__events__[event];
            var args = Array.prototype.splice.call(arguments, 1, 1);
            if (!events || events.length === 0) {
                return this;
            }
            for (var i = events.length - 1; i >= 0; i--) {

                // check handler is a function
                if (_.isFunction(events[i])) {

                    // catch any errors
                    try {
                        events[i].apply(this, args);
                    }
                    catch (e) {
                    }

                }

            }
            return this;
        }

    };

});