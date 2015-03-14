/* global $ */
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
     * @type {*|jQuery|HTMLElement}
     */
    t.$el = $(config.el);


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
     * @returns {*|jQuery|HTMLElement} the <tr>
     * @private
     */
    function _makeRow(values, header) {
        var $tr = $('<tr/>');
        for(var i=0; i < values.length; i++)
        {
            $tr.append(
                $( header ? '<th/>' : '<td/>' )
                    .text( values[i] || '' ) );
        }
        return $tr;
    }


    /**
     * Adds a row to the bottom of the table
     * @param values {Array}
     */
    t.pushRow = function(values) {
        t.$body.append( _makeRow(values) );
        return t;
    };



    /**
     * Pops the row out of the table
     * @param processRowFunction {function} called after
     * row is removed with the row passed as argument
     */
    t.popRow = function(processRowFunction) {
        var row = [];
        var $tr = t.$el.find('tbody tr').first();
        if ($tr.length === 0) {
            processRowFunction(null);
        } else {

            $tr.find('td').each(function() {
                row.push( $(this).text() );
            });
            processRowFunction(row);
        }
        $tr.remove();
        return this;
    };


    /**
     * Are there rows in the table
     * @returns {boolean}
     */
    t.hasRows = function() {
        return t.$body.find('tr').length !== 0;
    };


    /**
     * Render the table
     * @returns {Table}
     */
    t.render = function () {
        t.$body = $('<tbody/>');
        t.$el.append( $('<table/>') )
            .append( $('<caption/>').text( _name || '' ))
            .append( $('<thead/>')
                .append( _makeRow( _fields, true) ))
            .append(t.$body);
        return t;
    };
}
