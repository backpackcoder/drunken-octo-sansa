'use strict';
// This file writes out the browser banner

var browserStr = (function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem !== null) {
            return 'Opera ' + tem[1];
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
        M.splice(1, 1, tem[1]);
    }
    return M.join(' ');
})();

var browserClass = (function (browser) {
    if (('MSIE 7' === browser) || ('MSIE 8' === browser)) {
        return 'alert-danger';
    } else if ('MSIE 9' === browser) {
        return 'alert-warning';
    } else {
        return 'alert-success';
    }
})(browserStr);

var barEl = document.getElementById('divBrowser');
barEl.classList.add(browserClass);
barEl.innerText = browserStr.replace('MSIE', 'Internet Explorer') + ' - ' + navigator.userAgent;
