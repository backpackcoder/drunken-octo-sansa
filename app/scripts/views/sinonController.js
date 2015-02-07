/*global Backbone, Mustache, Templates, sinon */
/* exported SinonController */
'use strict';

var SinonController = Backbone.View.extend({
    poller: null,

    currentRequest: 0,

    events: {
        'click button' : 'sendResponse'
    },

    initialize: function(options) {
        // jshint unused:false
        this.server = null;
    },

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

    stop: function() {
        this.server.restore();
        if (this.poller) {
            window.clearInterval(this.poller);
        }
        return this;
    },

    reset: function(){
        this.start();
        this.stop();
    },

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
            this.$el.find('ol').replaceWith(
            $(Mustache.render(Templates.sinonController,
                { requests: requests }))
                .find('ol'));
        }
        this.$el.find('textarea').val(responseTxt);
        this.$el.find('button').prop('disabled',
            (requests.length === 0));
        return this;
    },

    sendResponse: function(ev) {
        ev.preventDefault();
        this.server.requests[this.currentRequest].respond(200,
            { 'Content-Type': 'application/json' },
            this.$el.find('textarea').val());
        this.render();
    }
});