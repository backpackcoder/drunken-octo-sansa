/* global jasmine */
/* exported console */
'use strict';

// Hookup fake console for IE
if (!console) {
    var console = {
        /* jshint unused:vars */
        log: function(a,b,c,d,e,f,g,h) {
            // no op
        }
    };
}

$(function(){
    // Setup jasmine tests
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;
    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);
    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };
    jasmineEnv.execute();
    $('.jasmine_reporter').appendTo('#unitTests').fadeIn();
});

