/* global SinonController */
'use strict';

var sinonEl = document.getElementById('divSinonController');
var formEl = document.getElementById('formRequest');

function addEventListener(el, eventName, handler) {
    if (el.addEventListener) {
        el.addEventListener(eventName, handler);
    } else {
        el.attachEvent('on' + eventName, function(){
            handler.call(el);
        });
    }
}

new SinonController({
    el: sinonEl
}).render().start();

addEventListener(formEl, 'submit', function (ev) {
    ev.preventDefault();
    var url = document.querySelector('input[name="url"]').value;
    var method = document.querySelector('select[name="method"]').value;
    var body = document.querySelector('textarea[name="requestBody').value;

    var request = new XMLHttpRequest();
    request.open(method, url, true);

    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            var tbodyEl = document.querySelector('#tblResponse tbody');
            var firstRow = tbodyEl.querySelectorAll('tr')[0];
            if ( 'No Responses' === firstRow.innerText.trim() ) {
                tbodyEl.removeChild(firstRow);
            }
            tbodyEl.innerHTML += '<tr class="' + this.statusText + '"><td style="text-align: center">' + this.status + '</td><td>' + this.responseText + '</td></tr>';
        }
    };

    request.setRequestHeader('Content-Type', 'application/json');
    request.send(body);
    request = null;
});
