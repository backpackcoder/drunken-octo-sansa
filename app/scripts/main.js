/* global jasmine  */
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
    var browserStr = (function(){
        var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\bOPR\/(\d+)/);
            if(tem !== null) { return 'Opera '+ tem[1]; }
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!== null) { M.splice(1, 1, tem[1]); }
        return M.join(' ');
    })();

    var browserClass = (function(browser) {
        if ('MSIE 7' === browser) {
            return 'alert-danger';
        } else if ('MSIE 8' === browser) {
            return 'alert-warning';
        } else if ('MSIE 9' === browser) {
            return 'alert-info';
        } else if ('MSIE 10' === browser) {
            return 'alert-success';
        } else if (browser !== null && browser.indexOf('Chrome') > -1) {
            return 'alert-success';
        } else {
            return 'alert-danger';
        }
    })(browserStr);

    $('#divBrowser')
        .text(browserStr.replace('MSIE', 'Internet Explorer') + ' - ' + navigator.userAgent)
        .addClass(browserClass);
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

