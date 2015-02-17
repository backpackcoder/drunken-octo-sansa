/* global Templates, sinon */
/* exported SinonController */
'use strict';

/**
 * A view to allow a user to interact with a sinon.fakeServer
 */
function SinonController(config) {
    var t = this;

    /* The JQuery object reference to the root HTML element */
    this.$el = $(config.el);

    /* index of the current request (used by response) */
    var _currentRequest = 0;

    /* The sinon.fakeSever instance */
    var _server = null;

    /* The polling timeer for new requests */
    var _poller = null;


    var _validateJson = function() {
        var jsonTxt = t.$el.find('textarea').val();
        var hasRequests = t.$el.find('td.no-requests').length === 0;
        var isValid = true;
        if ('200' === t.$el.find('select[name="statusCode"]').val()) {
            try {
                JSON.parse(jsonTxt);
                t.$el.find('textarea').removeClass('error');
            }
            catch (e) {
                isValid = false;
                t.$el.find('textarea').addClass('error');
            }
        }
        t.$el.find('button').prop('disabled', !(isValid && hasRequests));
    };


    /**
     * Starts the sinon fakeServer.  While the server is started all requests
     * will be routed through the fake server.
     * @returns {SinonController}
     */
    t.start = function () {
        _server = sinon.fakeServer.create();
        _currentRequest = 0;
        if (_poller) {
            window.clearInterval(_poller);
        }
        _poller = window.setInterval(function () {
            t.render();
        }, 1000);
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
        var i = 0, hasRequests = false;

        if (t.$el.is(':empty')) {
            t.$el.html(Templates.sinonController);
            t.$el.find('button').click(t.sendResponse);
            t.$el.find('select[name="statusCode"]').on('change', _validateJson);
            t.$el.find('textarea').on('keyup', _validateJson);
        }

        t.$el.find('tbody').empty().append('<tr><td class="no-requests" colspan="3">No requests</td></tr>');

        if (_server) {
            _currentRequest = _server.requests.length;
            for (i = 0; i < _server.requests.length; i++) {
                if (4 === _server.requests[i].readyState) {
                    t.$el.find('.request-' + i.length).remove();
                } else {
                    hasRequests = true;
                    _currentRequest = Math.min(i, _currentRequest);
                    t.$el.find('tbody td.no-requests').parent().remove();
                    if (t.$el.find('.request-' + i).length == 0) {
                        $('<tr><td>' + _server.requests[i].method + '</td>' +
                            '<td>' + _server.requests[i].url + '</td>' +
                            '<td>' + (_server.requests[i].requestBody || '') + '</td></tr>')
                            .addClass('request-' + i)
                            .appendTo(t.$el.find('tbody'));
                    }
                }
            }
        }
        _validateJson();
        return this;
    };


    /**
     * Sends the response back to the calling method
     * @param ev {event} The event
     */
    t.sendResponse = function (ev) {
        ev.preventDefault();
        var data = t.$el.find('textarea').val();
        var status = new Number(t.$el.find('select[name="statusCode"]').val());
        var contentType = { 'Content-Type': 'application/json' };
        _server.requests[_currentRequest].respond(
            parseInt(status), contentType, data);
        t.render();
    };
}
