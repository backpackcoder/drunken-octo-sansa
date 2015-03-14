/* global describe, it, beforeEach, afterEach, expect, sinon, SinonController, $ */
'use strict';

(function () {
    describe('SinonController', function () {
        var testRequest404 = {
            url: '/expected-404',
            async: false,
            method: 'GET'
        };

        var testRequest1 = {
            url: '/test1',
            method: 'GET',
            data: null
        };

        var testRequest2 = {
            url: '/test2',
            method: 'PUT',
            data: '{\n  "id": 100\n}'
        };


        beforeEach(function () {
            var t = this;
            this.sc = new SinonController({
                el : '<div/>'
            }).render();
            this.$ws = this.sc.$el;
            this.clock = sinon.useFakeTimers();
            this.$ta = this.$ws.find('textarea');
            this.$sel = this.$ws.find('select[name="statusCode"]');
            this.$btn = this.$ws.find('button');
            
            /**
             * Expects "No Requests" text in the table
             */
            this.expectNoRequests = function () {
                var $tr = t.$ws.find('tbody tr');
                expect($tr.length).toEqual(0);
            };

            /**
             * Checks a row of request objects
             * @param rows
             */
            this.expectRows = function (rows) {
                var $tr = t.$ws.find('tbody tr');
                for (var i = rows.length - 1; i >= 0; i--) {
                    var $td = $( $tr[i]).find('td');
                    expect( $( $td[1] ).text() ).toEqual(rows[i].method);
                    expect( $( $td[2] ).text() ).toEqual(rows[i].url);
                    expect( $( $td[3] ).text() ).toEqual(rows[i].data || '');
                }
            };
        });


        afterEach(function () {
            this.clock.restore();
            this.$ws.remove();
        });


        it('can be startered and stopped', function () {
            var t = this;
            function _sendAndExpect(request, rows) {
                $.ajax(request);
                t.clock.tick(1100);
                t.expectRows(rows);
            }

            this.expectNoRequests();
            _sendAndExpect(testRequest404, []);
            this.expectNoRequests();
            this.sc.start();
            _sendAndExpect(testRequest1, [testRequest1]);
            this.sc.stop();
            _sendAndExpect(testRequest404, [testRequest1]);
        });


        it('should support multiple requests', function () {
            this.sc.start();
            var callback = sinon.spy(), errorCallback = sinon.spy();
            $.ajax($.extend(testRequest1, { success: callback, error: errorCallback }));
            $.ajax($.extend(testRequest2, { success: callback, error: errorCallback }));
            this.clock.tick(1200);
            this.$ta.val('{ "id": 1 }');
            this.$btn.click();
            expect(callback.calledOnce).toBeTruthy();
            expect(callback.calledWith({ id: 1})).toBeTruthy();
            this.expectRows([testRequest2]);
            this.$sel.val(400);
            this.$btn.click();
            expect(errorCallback.calledOnce).toBeTruthy();
            expect(errorCallback.calledWithMatch({ status: 400 })).toBeTruthy();
            this.expectNoRequests();
            this.sc.stop();
        });


        it('should disable/enable send response button', function(){
            this.sc.start();

            // non 200, no request
            this.$sel.val(400).trigger('change');
            expect(this.$btn.prop('disabled')).toBeTruthy();

            // non 200, request
            $.ajax(testRequest1);
            this.clock.tick(1500);
            this.$sel.val(500).trigger('change');
            expect(this.$btn.prop('disabled')).toBeFalsy();

            // 200, request, empty text
            this.$sel.val(200).trigger('change');
            expect(this.$btn.prop('disabled')).toBeTruthy();

            // 200, request, valid text
            this.$ta.val('{ "id"  : 1}').trigger('keyup');
            expect(this.$ta.hasClass('error')).toBeFalsy();
            expect(this.$btn.prop('disabled')).toBeFalsy();

            // 200, request, invalid text
            this.$ta.val(' : 1}').trigger('keyup');
            expect(this.$ta.hasClass('error')).toBeTruthy();
            expect(this.$btn.prop('disabled')).toBeTruthy();
        });
    });
})();
