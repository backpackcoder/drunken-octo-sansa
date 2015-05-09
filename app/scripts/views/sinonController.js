/* global Templates, sinon, Table */
/* exported SinonController */
'use strict';

/**
 * A view to allow a user to interact with a sinon.fakeServer
 */
function SinonController(config) {
    // Helper functions
    function $addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    function $removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    function $hasClass(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    }

    function $addEventListener(el, eventName, handler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, handler);
        } else {
            el.attachEvent('on' + eventName, function(){
                handler.call(el);
            });
        }
    }

    var t = this;

    /* the root HTML element */
    this.el = config.el;

    /* requests added to table */
    var _addedRequests = [];

    /* The sinon.fakeSever instance */
    var _server = null;

    /* The polling timeer for new requests */
    var _poller = null;

    /* The TextArea for response json */
    var _jsonTextArea = null;

    /* The Select for the response status code */
    var _statusSelect = null;

    /* The Button for sending the response */
    var _sendButton = null;

    /* The request table */
    var _requestTable = null;

    /**
     * Validates control and updates the send button
     * @private
     */
    function _updateSendButtonState() {
        var jsonStr = _jsonTextArea.value;
        if ('200' === _statusSelect.value) {
            try {
                if ( '' !== jsonStr.trim() ) {
                    JSON.parse(jsonStr);
                }
                $removeClass(_jsonTextArea, 'error');
            }
            catch (e) {
                $addClass(_jsonTextArea, 'error');
            }
        }


        if ( ! _requestTable.hasRows() ||
            ($hasClass(_jsonTextArea, 'error') && ('200' === _statusSelect.value) ) ) {
            _sendButton.setAttribute('disabled', 'disabled');
        } else {
            _sendButton.removeAttribute('disabled');
        }
    }


    /**
     * Starts the sinon fakeServer.  While the server is started all requests
     * will be routed through the fake server.
     * @returns {SinonController}
     */
    t.start = function () {
        _server = sinon.fakeServer.create();
        if (_poller) {
            window.clearInterval(_poller);
        }

        _poller = window.setInterval(function () {
            for(var i=0; i < _server.requests.length; i++) {
                var req = _server.requests[i];
                if ((4 !== req.readyState) &&  (_addedRequests.indexOf(i) === -1)) {
                    _requestTable.pushRow([
                        i.toString(),
                        req.method,
                        req.url,
                        req.requestBody ]);
                    _addedRequests.push(i);
                }
            }
            _updateSendButtonState();
        }, 1000); /* setInterval */
        return t;
    };


    /**
     * Stops the sinon fakeServer.  While the server is stopped all requests
     * will be sent out normally
     * @returns {SinonController}
     */
    t.stop = function () {
        _server.restore();
        if (_poller) {
            window.clearInterval(_poller);
        }
        return t;
    };


    /**
     * Starts and then stops the sinon fakeServer
     * @returns {SinonController}
     */
    t.reset = function () {
        return t.start().stop();
    };


    /**
     * Renders the HTML
     * @returns {SinonController}
     */
    t.render = function () {
        t.el.innerHTML = Templates.sinonController;

        _sendButton = t.el.querySelector('button');
        $addEventListener(_sendButton, 'click', function(ev) {
                ev.preventDefault();
                _requestTable.popRow(function(row){
                    _server.requests[row[0]].respond(
                        parseInt(_statusSelect.value),
                        { 'Content-Type': 'application/json' },
                        _jsonTextArea.value);
                }); /* popRow */
                _updateSendButtonState();
            }); /* on click */

        _jsonTextArea = t.el.querySelector('textarea');
        $addEventListener(_jsonTextArea, 'keyup', _updateSendButtonState);

        _statusSelect = t.el.querySelector('select[name="statusCode"]');
        $addEventListener(_statusSelect, 'change', _updateSendButtonState);

        _requestTable = new Table({
            el : t.el.querySelector('.requests'),
            name : 'Requests',
            fields : ['id', 'Method', 'Url', 'Body']
        }).render();

        _updateSendButtonState();
        return t;
    }; /* render */
}
