/* global describe, it, expect, sinon, $, Table */
'use strict';

(function () {
    describe('Table', function () {
        /**
         * Returns a test table from the given test data
         * @param config
         * @returns {Table}
         */
        function getTable(config) {
            return new Table($.extend(
                config,
                { el : '<div></div>' }
            ));
        }

        // Test data
        var data1 = {
            config : {
                name : 'Test Table 1',
                fields : [ 'field1', 'field2', null ]
            },
            headers : [ 'field1', 'field2', '' ],
            caption : ''
        };

        var data2 = {
            config : {
                name : null, fields: []
            },
            heaers : [],
            caption : ''
        };

        var row1 = ['r1c1', 'r1c2', 'r1c3', 'r1c4'];
        var row2 = ['r2c1', 'r2c2', 'r2c3', 'r2c4'];
        // End of test data


        it('should render the fields as headers', function () {
            var tbl = getTable(data1.config).render();
            var $th = tbl.$el.find('th');
            expect($th.length).toBe(data1.config.fields.length);
            $th.each(function(idx, el) {
                expect($(el).text()).toBe(data1.headers[idx]);
            });
        });


        it('should render name in the caption', function(){
            var tbl = getTable(data1.config).render();
            var $caption = tbl.$el.find('caption');
            expect($caption.text()).toBe(data1.config.name);

            tbl = getTable(data2.config).render();
            $caption = tbl.$el.find('caption');
            expect($caption.text()).toBe('');
        });


        it('should push a row to the bottom of the table', function(){
            var tbl = getTable(data1.config).render();

            var $tr = tbl.$el.find('tbody tr');
            expect($tr.length).toBe(0);
            tbl.pushRow(row1);
            $tr = tbl.$el.find('tbody tr');
            expect($tr.length).toBe(1);
            $tr.find('td').each(function(idx, el) {
                expect($(el).text()).toBe(row1[idx]);
            });

            tbl.pushRow(row2);
            $tr = tbl.$el.find('tbody tr');
            expect($tr.length).toBe(2);
            $tr.first().find('td').each(function(idx, el) {
                expect($(el).text()).toBe(row1[idx]);
            });
        });


        it('shoud pop a row from the top of the table', function() {
            var tbl = getTable(data1.config).render();
            var callback = sinon.spy();
            tbl.popRow(callback);
            expect(callback.calledWith(null)).toBeTruthy();

            tbl.pushRow(row1);
            callback = sinon.spy();
            tbl.popRow(callback);
            var $tr = tbl.$el.find('tbody tr');
            expect($tr.length).toBe(0);
            expect(callback.calledWith(row1)).toBeTruthy();
        });


        it('should detect if it has rows', function() {
            var tbl = getTable(data1.config).render();
            expect(tbl.hasRows()).toBeFalsy();
            tbl.pushRow(row1);
            expect(tbl.hasRows()).toBeTruthy();
        });
    }); /* End of describe */
}());
