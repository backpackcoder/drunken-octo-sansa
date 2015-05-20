/* global Templates, sinon, Table, addClass, removeClass, hasClass, dos */
/* exported SinonController */
'use strict';

/**
 * A view to allow a user to interact with a sinon.fakeServer
 */
function SinonController(config) {
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

    /* The button for saving the response */
    var _saveResponseButton = null;

    /* The saved response count label */
    var _countLabel = null;

    /* The request table */
    var _requestTable = null;


    /**
     * Updates the button states and response count label
     * @private
     */
    function _update() {
        // Validate the body json
        var jsonStr = _jsonTextArea.value;
        if (jsonStr || jsonStr.trim() !== '') {
            _saveResponseButton.removeAttribute('disabled');
        } else {
            _saveResponseButton.setAttribute('disabled', 'disabled');
        }

        // Validate status
        if ('200' === _statusSelect.value) {
            try {
                if ('' !== jsonStr.trim()) {
                    JSON.parse(jsonStr);
                }
                removeClass(_jsonTextArea, 'error');
            }
            catch (e) {
                addClass(_jsonTextArea, 'error');
            }
        }

        // Validate requests exist
        if (!_requestTable.hasRows() ||
            (hasClass(_jsonTextArea, 'error') && ('200' === _statusSelect.value) )) {
            _sendButton.setAttribute('disabled', 'disabled');
        } else {
            _sendButton.removeAttribute('disabled');
        }

        // Update response count
        try {
            _countLabel.innerText = dos.dataStore.counts();
        } catch (exp) {
            console.log(exp);
            _countLabel.innerText = '0/0';
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
            for (var i = 0; i < _server.requests.length; i++) {
                var req = _server.requests[i];
                if ((4 !== req.readyState) && (_addedRequests.indexOf(i) === -1)) {
                    _requestTable.pushRow([
                        i.toString(),
                        req.method,
                        req.url,
                        req.requestBody ]);
                    _addedRequests.push(i);
                }
            }
            _update();
        }, 1000);
        /* setInterval */
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
    t.create = function () {
        t.el.innerHTML = Templates.sinonController;
        _countLabel = t.el.querySelector('span.count-response');

        _sendButton = t.el.querySelector('button[type="submit"]');
        addEventListener(_sendButton, 'click', function (ev) {
            ev.preventDefault();
            _requestTable.popRow(function (row) {
                _server.requests[row[0]].respond(
                    parseInt(_statusSelect.value),
                    { 'Content-Type': 'application/json' },
                    _jsonTextArea.value);
            });
            _update();
        });

        _saveResponseButton = t.el.querySelector('button.save-response');
        addEventListener(_saveResponseButton, 'click', function (ev) {
            ev.preventDefault();
            dos.dataStore.add(_jsonTextArea.value);
            _update();
        });

        var nextResponseButton = t.el.querySelector('button.next-response');
        addEventListener(nextResponseButton, 'click', function (ev) {
            ev.preventDefault();
            _jsonTextArea.value = dos.dataStore.next();
            _update();
        });

        var prevResponseButton = t.el.querySelector('button.prev-response');
        addEventListener(prevResponseButton, 'click', function (ev) {
            ev.preventDefault();
            _jsonTextArea.value = dos.dataStore.prev();
            _update();
        });

        var clearResponseButton = t.el.querySelector('button.clear-response');
        addEventListener(clearResponseButton, 'click', function (ev) {
            ev.preventDefault();
            dos.dataStore.clear();
            _update();
        });

        _jsonTextArea = t.el.querySelector('textarea');
        addEventListener(_jsonTextArea, 'keyup', _update);

        _statusSelect = t.el.querySelector('select[name="statusCode"]');
        addEventListener(_statusSelect, 'change', _update);

        _requestTable = new Table({
            el: t.el.querySelector('.requests'),
            name: 'Requests',
            fields: ['id', 'Method', 'Url', 'Body']
        }).create();

        _update();
        return t;
    };
    /* render */
}
