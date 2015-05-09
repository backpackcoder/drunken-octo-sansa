/* exported Table */
'use strict';

/**
 * A simple Table that functions as a queue pusing data
 * into the bottom of the table and popping it out the top
 * @param config
 * @constructor
 */
function Table(config) {
    var t = this;

    /**
     * The Table will be appended to this element
     * @type {HTMLElement}
     */
    t.el = config.el;


    /**
     * The name to display for the table
     * @type {Array}
     */
    var _name = config.name;


    /**
     * The field names to display for the columns
     * @type {Array}
     */
    var _fields = config.fields;


    /**
     * Create a rows for the table
     * @param values {Array} The cell values
     * @param header {boolean} true if header <th>
     * @returns {*HTMLElement} the <tr>
     * @private
     */
    function _makeRow(values, header) {
        var html = '<tr>';
        var tag = header ? 'th' : 'td';
        for (var i = 0; i < values.length; i++) {
            html += '<' + tag + '>' + (values[i] || '') + '</' + tag + '>';
        }
        html += '</tr>';
        return html;
    }


    /**
     * Adds a row to the bottom of the table
     * @param values {Array}
     */
    t.pushRow = function (values) {
        t._bodyEl.innerHTML += _makeRow(values);
        return t;
    };


    /**
     * Pops the row out of the table
     * @param processRowFunction {function} called after
     * row is removed with the row passed as argument
     */
    t.popRow = function (processRowFunction) {
        var row = [];
        var trEls = t.el.querySelectorAll('tbody tr');
        if (trEls.length === 0) {
            processRowFunction(null);
        } else {
            var tds = trEls[0].querySelectorAll('td');
            for (var i = 0; i < tds.length; i++) {
                row.push(tds[i].innerText);
            }
            t._bodyEl.removeChild(trEls[0]);
            processRowFunction(row);
        }
        return this;
    };


    /**
     * Are there rows in the table
     * @returns {boolean}
     */
    t.hasRows = function () {
        return t.el.querySelectorAll('tbody tr').length !== 0;
    };


    /**
     * Render the table
     * @returns {Table}
     */
    t.render = function () {
        var html = '<table><caption>' + (_name || '') + '</caption>' +
            '<thead>' + _makeRow(_fields, true) + '</thead>' +
            '<tbody></tbody></table>';
        t.el.innerHTML = html;
        t._bodyEl = t.el.querySelector('tbody');
        return t;
    };
}
