/* global Templates, sinon, _, $, Table */
/* exported SinonController */
'use strict';

/**
 * A view to allow a user to interact with a sinon.fakeServer
 */
function SinonController(config) {
    var t = this;

    /* The JQuery object reference to the root HTML element */
    this.$el = $(config.el);

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
        if ('200' === _statusSelect.val()) {
            try {
                JSON.parse( _jsonTextArea.val() );
                _jsonTextArea.removeClass('error');
            }
            catch (e) {
                _jsonTextArea.addClass('error');
            }
        }
        _sendButton.prop('disabled',
            ( ! _requestTable.hasRows() ||
                (_jsonTextArea.hasClass('error') && ('200' === _statusSelect.val()) ) ) );
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
            _.each(_server.requests, function(req, idx) {
                if ((4 !== req.readyState) &&  !_.contains(_addedRequests, idx)) {
                    _requestTable.pushRow([
                        idx.toString(),
                        req.method,
                        req.url,
                        req.requestBody ]);
                    _addedRequests.push(idx);
                } /* if */
            }); /* _.each(server.request */
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
        t.$el.html(Templates.sinonController);

        _sendButton = t.$el.find('button')
            .on('click', function(ev) {
                ev.preventDefault();
                _requestTable.popRow(function(row){
                    _server.requests[row[0]].respond(
                        parseInt(_statusSelect.val()),
                        { 'Content-Type': 'application/json' },
                        _jsonTextArea.val());
                }); /* popRow */
                _updateSendButtonState();
            }); /* on click */

        _jsonTextArea = t.$el.find('textarea')
            .on('keyup', _updateSendButtonState);

        _statusSelect = t.$el.find('select[name="statusCode"]')
            .on('change', _updateSendButtonState);

        _requestTable = new Table({
            el : t.$el.find('.requests'),
            name : 'Requests',
            fields : ['id', 'Method', 'Url', 'Body']
        }).render();

        _updateSendButtonState();
        return t;
    }; /* render */
}
