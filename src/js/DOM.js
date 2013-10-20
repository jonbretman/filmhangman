define('DOM', function () {

    var arraySlice = Array.prototype.slice;
    var arrayPush = Array.prototype.push;
    var toString = Object.prototype.toString;
    var arrayIndexOf = Array.prototype.indexOf;
    var idRegExp = /^#[a-zA-Z_\-0-9]+$/;
    var classRegExp = /^\.[a-zA-Z_\-0-9]+$/;
    var htmlRegExp = /^<.*>$/;

    var isList = function (list) {
        return list && typeof list === 'object' && typeof list.length === 'number';
    };

    var isString = function (str) {
        return toString.call(str) === '[object String]';
    };

    var isElement = function (node) {
        return node && (node.nodeType === 1 || node.nodeType === 9);
    };

    var isDocument = function (doc) {
        return doc && doc.nodeType === 9;
    };

    var isWindow = function (win) {
        return win && win.window === win;
    };

    var map = function (arr, fn) {
        var res = [];
        for (var i = 0; i < arr.length; i++) {
            res.push(fn(arr[i], i));
        }
        return res;
    };

    var tempElement = document.createElement('div');

    var stringToHTML = function (str) {
        tempElement.innerHTML = str;
        var els = arraySlice.call(tempElement.childNodes);
        tempElement.innerHTML = '';
        return els;
    };

    var matches = function (element, selector) {

        if (!element || element.nodeType !== 1) {
            return false;
        }

        var prefixes = ['webkitM', 'mozM', 'oM', 'm'];

        // try and use matchesSelector
        for (var i = 0; i < prefixes.length; i++) {
            if (element[prefixes[i] + 'atchesSelector']) {
                return element[prefixes[i] + 'atchesSelector'](selector);
            }
        }

        // fall back to performing a selector:
        var match;
        var parent = element.parentNode;
        var temp = !parent;

        if (temp) {
            parent = tempElement;
            parent.appendChild(element);
        }

        match = $(parent).find(selector).indexOf(element) !== -1;

        if (temp) {
            tempElement.removeChild(element);
        }

        return match;
    };

    var $ = function (selector) {

        if (!(this instanceof $)) {
            return new $(selector);
        }

        // falsey - return empty collection
        if (!selector) {
            return this;
        }

        // single node
        if (selector.nodeType === 1) {
            this[0] = selector;
            this.length = 1;
            return this;
        }

        // selector string
        if (isString(selector)) {

            selector = selector.trim();

            if (htmlRegExp.test(selector)) {
                selector = stringToHTML(selector);
            }
            else {
                return this.find(selector.trim());
            }
        }

        // array or array-like object
        if (isList(selector)) {
            for (var i = 0; i < selector.length; i++) {
                this[i] = selector[i];
            }
            this.length = selector.length;
        }

        return this;
    };

    $.prototype = {

        length: 0,

        indexOf: arrayIndexOf,

        find: function (selector) {

            // by id
            if (idRegExp.test(selector)) {
                var res = document.getElementById(selector.substring(1));
                return $(res ? [res] : null);
            }

            var method = 'querySelectorAll';

            if (classRegExp.test(selector)) {
                method = 'getElementsByClassName';
                selector = selector.substring(1);
            }

            // single element in collection or empty collection
            if (this.length < 2) {
                return $(arraySlice.call((this[0] || document)[method](selector)));
            }

            var results = [];
            var i = 0;
            var length = this.length;

            // multiple elements in collection, search through all
            for (; i < length; i++) {
                arrayPush.apply(results, arraySlice.call(this[i][method](selector)));
            }

            return $(results);
        },

        addClass: function (c) {
            if (!isString(c)) {
                return this;
            }
            var classes = c.split(' ');
            for (var i = 0, l = this.length; i < l; i++) {
                for (var j = 0, length = classes.length; j < length; j++) {
                    this[i].classList.add(classes[j]);
                }
            }
            return this;
        },

        removeClass: function (c) {
            if (!isString(c)) {
                return this;
            }
            var classes = c.split(' ');
            for (var i = 0, l = this.length; i < l; i++) {
                for (var j = 0, length = classes.length; j < length; j++) {
                    this[i].classList.remove(classes[j]);
                }
            }
            return this;
        },

        hasClass: function (c) {
            for (var i = 0; i < this.length; i++) {
                if (this[i].classList.contains(c)) {
                    return true;
                }
            }
            return false;
        },

        html: function (html) {
            if (arguments.length === 0) {
                return this.length === 0 ? null : this[0].innerHTML.trim();
            }
            for (var i = 0, length = this.length; i < length; i++) {
                this[i].innerHTML = html;
            }
            return this;
        },

        text: function (text) {
            if (arguments.length === 0) {
                return this.length === 0 ? null : this[0].innerText.trim();
            }
            for (var i = 0, length = this.length; i < length; i++) {
                this[i].innerText = text;
            }
            return this;
        },

        remove: function () {
            for (var i = 0, length = this.length; i < length; i++) {
                if (this[i].parentNode) {
                    this[i].parentNode.removeChild(this[i]);
                }
            }
            return this;
        },

        each: function (fn) {
            for (var i = 0, length = this.length; i < length; i++) {
                fn.apply(this[i], [this[i], i, this]);
            }
            return this;
        },

        closest: function (selector) {
            var node = this[0];
            while (node && !matches(node, selector)) {
                node = node !== document ? node.parentNode : null;
            }
            return $(node);
        },

        on: function (event, selector, fn) {
            if (arguments.length === 2) {
                fn = selector;
                selector = null;
            }
            return this.each(function () {
                this.addEventListener(event, function (e) {
                    if (!selector) {
                        return fn.apply(this, arguments);
                    }
                    var delegate = $(e.target).closest(selector);
                    if (delegate && delegate.length === 1) {
                        return fn.apply(delegate[i], arguments);
                    }
                    return true;
                }, false);
            });
        },

        off: function (event, fn) {
            for (var i = 0, length = this.length; i < length; i++) {
                this[i].removeEventListener(event, fn);
            }
            return this;
        },

        attr: function (key) {
            if (this.length === 0) {
                return null;
            }
            return this[0].getAttribute(key);
        }

    };

    return $;

});