/* global describe, it, expect, sinon, Table */
'use strict';

(function () {
    describe('Table', function () {
        /**
         * Returns a test table from the given test data
         * @param config
         * @returns {Table}
         */
        function getTable(config) {
            config = config || {};
            config.el = document.createElement('div');
            return new Table(config);
        }

        // Test data
        var data1 = {
            config: {
                name: 'Test Table 1',
                fields: [ 'field1', 'field2', null ]
            },
            headers: [ 'field1', 'field2', '' ],
            caption: ''
        };

        var data2 = {
            config: {
                name: null, fields: []
            },
            headers: [],
            caption: ''
        };

        var row1 = ['r1c1', 'r1c2', 'r1c3', 'r1c4'];
        var row2 = ['r2c1', 'r2c2', 'r2c3', 'r2c4'];
        // End of test data


        it('should render the fields as headers', function () {
            var tbl = getTable(data1.config).render();
            var thEl = tbl.el.querySelectorAll('th');
            expect(thEl.length).toBe(data1.config.fields.length);
            for (var i = 0; i < thEl.length; i++) {
                expect(thEl[i].innerText).toBe(data1.headers[i]);
            }
        });


        it('should render name in the caption', function () {
            var tbl = getTable(data1.config).render();
            var captionEl = tbl.el.querySelector('caption');
            expect(captionEl.innerText).toBe(data1.config.name);

            tbl = getTable(data2.config).render();
            captionEl = tbl.el.querySelector('caption');
            expect(captionEl.innerText).toBe('');
        });


        it('should push a row to the bottom of the table', function () {
            var tbl = getTable(data1.config).render();

            var trEls = tbl.el.querySelectorAll('tbody tr');
            expect(trEls.length).toBe(0);
            tbl.pushRow(row1);
            trEls = tbl.el.querySelectorAll('tbody tr');
            expect(trEls.length).toBe(1);
            var tdEls = trEls[0].querySelectorAll('td');
            for (var i = 0; i < tdEls.length; i++) {
                expect(tdEls[i].innerText).toBe(row1[i]);
            }

            tbl.pushRow(row2);
            trEls = tbl.el.querySelectorAll('tbody tr');
            expect(trEls.length).toBe(2);
            tdEls = trEls[0].querySelectorAll('td');
            for (i = 0; i < tdEls.length; i++) {
                expect(tdEls[i].innerText).toBe(row1[i]);
            }
            tdEls = trEls[1].querySelectorAll('td');
            for (i = 0; i < tdEls.length; i++) {
                expect(tdEls[i].innerText).toBe(row2[i]);
            }
        });


        it('shoud pop a row from the top of the table', function () {
            var tbl = getTable(data1.config).render();
            var callback = sinon.spy();
            tbl.popRow(callback);
            expect(callback.calledWith(null)).toBeTruthy();

            tbl.pushRow(row1);
            callback = sinon.spy();
            tbl.popRow(callback);
            var trEls = tbl.el.querySelectorAll('tbody tr');
            expect(trEls.length).toBe(0);
            expect(callback.calledWith(row1)).toBeTruthy();
        });


        it('should detect if it has rows', function () {
            var tbl = getTable(data1.config).render();
            expect(tbl.hasRows()).toBeFalsy();
            tbl.pushRow(row1);
            expect(tbl.hasRows()).toBeTruthy();
        });
    });
    /* End of describe */
}());
