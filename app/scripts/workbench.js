/* global SinonController */
'use strict';

var sinonEl = document.getElementById('divSinonController');
var htmlEl = document.getElementById('taHtml');
var cssEl = document.getElementById('taCss');
var jsEl = document.getElementById('taJs');
var workbenchEl = document.getElementById('divWorkbench');
var styleTag = document.getElementById('cssStyle');
var formEl = document.querySelector('.ui-codeedit > form');

new SinonController({
    el: sinonEl
}).render().start();

addEventListener(htmlEl, 'keyup', function (ev) {
    ev.preventDefault();
    workbenchEl.innerHTML = htmlEl.value;
});

addEventListener(cssEl, 'keyup', function (ev) {
    ev.preventDefault();
    styleTag.innerHTML = cssEl.value;
});

addEventListener(formEl, 'submit', function (ev) {
    ev.preventDefault();
    eval(jsEl.value); // jshint ignore:line
});

