/* global Backbone, Mustache, Templates, sinon */
/* exported SinonController */
'use strict';

/**
 * A view to allow a user to interact with a sinon.fakeServer
 */
var SinonController = Backbone.View.extend({
    poller: null,

    currentRequest: 0,

    events: {
        'click button' : 'sendResponse'
    },


    /**
     * Creates a SinonController
     * @param options No options
     */
    initialize: function(options) {
        // jshint unused:false
        this.server = null;
    },


    /**
     * Starts the sinon fakeServer.  While the server is started all requests
     * will be routed through the fake server.
     * @returns {SinonController}
     */
    start: function() {
        var t = this;
        this.server = sinon.fakeServer.create();
        this.currentRequest = 0;
        if (this.poller) {
            window.clearInterval(this.poller);
        }
        this.poller = window.setInterval(function(){
            t.render();
        }, 1000);
        return this;
    },


    /**
     * Stops the sinon fakeServer.  While the server is stopped all requests
     * will be sent out normally
     * @returns {SinonController}
     */
    stop: function() {
        this.server.restore();
        if (this.poller) {
            window.clearInterval(this.poller);
        }
        return this;
    },


    /**
     * Starts and then stops the sinon fakeServer
     * @returns {SinonController}
     */
    reset: function(){
        this.start();
        this.stop();
        return this;
    },


    /**
     * Renders the HTML
     * @returns {SinonController}
     */
    render: function() {
        var requests = [], setIndex = false;
        this.currentRequest = 0;
        if (this.server) {
            for (var i = 0; i < this.server.requests.length; i++) {
                if (this.server.requests[i].readyState !== 4) {
                    if (! setIndex) {
                        setIndex = true;
                        this.currentRequest = i;
                    }
                    requests.push(this.server.requests[i]);
                }
            }
        }

        var responseTxt = this.$el.find('textarea').val();
        if (this.$el.is(':empty')) {
            this.$el.html(
                Mustache.render(Templates.sinonController,
                    { requests: requests })
            );
        } else {
            this.$el.find('tbody').replaceWith(
            $(Mustache.render(Templates.sinonController,
                { requests: requests }))
                .find('tbody'));
        }
        this.$el.find('textarea').val(responseTxt);
        this.$el.find('button').prop('disabled',
            (requests.length === 0));
        if (requests.length === 0) {
            this.$el.find('thead').hide();
        } else {
            this.$el.find('thead').show();
        }
        return this;
    },


    /**
     * Sends the response back to the calling method
     * @param ev {event} The event
     */
    sendResponse: function(ev) {
        ev.preventDefault();
        this.server.requests[this.currentRequest].respond(200,
            { 'Content-Type': 'application/json' },
            this.$el.find('textarea').val());
        this.render();
    }
});