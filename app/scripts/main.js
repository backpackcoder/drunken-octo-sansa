/* global SinonController */
'use strict';

$(function(){
    new SinonController({
        el: $('#divSinonController')[0]
    }).render().start();


    $('#btnSend').click(function(ev){
        ev.preventDefault();
        $.ajax($('input[name="url"]').val(), {
            success: function(data) {
                $('<div></div>')
                    .addClass('alert alert-success')
                    .text(JSON.stringify(data))
                    .appendTo('#ddResponse');
            },
            error: function(a,b,c) {
                $('<div></div>')
                    .addClass('alert alert-error')
                    .text(c.message)
                    .appendTo('#ddResponse');
            }
        });
    });
});

