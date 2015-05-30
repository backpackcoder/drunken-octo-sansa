/* exported addEventListener, addClass, removeClass, hasClass */
'use strict';

function addEventListener(el, eventName, handler) {
    if (el.addEventListener) {
        el.addEventListener(eventName, handler);
    } else {
        el.attachEvent('on' + eventName, function () {
            handler.call(el);
        });
    }
}

function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
}

function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}

function hasClass(el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
}

(function() {
    /* The response localStorage key */
    var _storageKey = 'data.saved.response';

    function getResponses() {
        var dataJson = localStorage.getItem(_storageKey);
        var data = {
            idx: 0,
            responses: []
        };
        try {
            data = JSON.parse(dataJson);
        } catch (exp) {
            console.log(exp);
        }
        return data;
    }

    function storeResponses(data) {
        localStorage.setItem(_storageKey, JSON.stringify(data));
    }


    window.dos = {
        dataStore: {
            counts: function () {
                var data = getResponses();
                return data.idx + '/' + data.responses.length;
            },
            add: function(response) {
                var data = getResponses();
                data.responses.push(response);
                if (data.idx === 0) {
                    data.idx = 1;
                }
                storeResponses(data);
            },
            next: function () {
                var data = getResponses();
                data.idx++;
                if (data.idx > data.responses.length) {
                    data.idx = 1;
                }
                storeResponses(data);
                return data.responses[data.idx - 1];
            },
            prev: function () {
                var data = getResponses();
                data.idx--;
                if (data.idx < 1) {
                    data.idx = data.responses.length;
                }
                storeResponses(data);
                return data.responses[data.idx - 1];
            },
            clear: function () {
                var data = {
                    idx: 0,
                    responses: []
                };
                storeResponses(data);
            }
        }
    };
})();
