/* global SinonController */
'use strict';

$(function () {
    new SinonController({
        el: $('#divSinonController')[0]
    }).render().start();

    $('#formRequest').submit(function (ev) {
        ev.preventDefault();
        $.ajax($('input[name="url"]').val(), {
            type: $('select[name="method"]').val(),
            complete: function(xhr, statusText) {
                if ( 'No Responses' === $('#tblResponse tbody tr').text().trim() ) {
                    $('#tblResponse tbody tr').remove();
                }

                $('<tr></tr>')
                    .addClass(statusText)
                    .append($('<td></td>').text(xhr.status).css('text-align', 'center'))
                    .append($('<td></td>').text(xhr.responseText))
                    .appendTo('#tblResponse tbody');
            }
        });
    });
});
