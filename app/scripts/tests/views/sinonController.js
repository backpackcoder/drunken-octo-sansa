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
            this.expectNoRequests();
            $.ajax(testRequest404);
            this.clock.tick(1200);
            this.expectNoRequests();
            this.sc.start();
            $.ajax(testRequest1);
            this.clock.tick(1200);
            this.expectRows([testRequest1]);
            this.sc.stop();
            $.ajax(testRequest404);
            this.clock.tick(1200);
            this.expectRows([testRequest1]);
        });


        it('should list requests', function () {
            this.expectNoRequests();
            this.sc.start();
            $.ajax(testRequest1);
            this.clock.tick(1200);
            this.expectRows([testRequest1]);
            $.ajax(testRequest2);
            this.clock.tick(1200);
            this.expectRows([testRequest1, testRequest2]);
            this.sc.stop();
        });


        it('should respond to a request', function () {
            this.expectNoRequests();
            this.sc.start();
            var callback = sinon.spy();
            $.ajax($.extend(testRequest1, { success: callback }));
            this.clock.tick(1200);
            this.$ta.val('{ "id": 1 }');
            this.$btn.click();
            expect(callback.calledOnce).toBeTruthy();
            expect(callback.calledWith({ id: 1})).toBeTruthy();
            this.expectNoRequests();
            this.sc.stop();
        });


        it('can respond with error http status codes', function () {
            this.sc.start();
            var callback = sinon.spy();
            $.ajax($.extend(testRequest1, { error: callback }));
            this.clock.tick(1200);
            this.$sel.val(400);
            this.$btn.click();
            expect(callback.calledOnce).toBeTruthy();
            expect(callback.calledWithMatch({ status: 400 })).toBeTruthy();
            this.expectNoRequests();
            this.sc.stop();
        });


        it('should support multiple requests', function () {
            this.expectNoRequests();
            this.sc.start();
            var callback = sinon.spy();
            $.ajax($.extend(testRequest1, { success: callback }));
            $.ajax($.extend(testRequest2, { success: callback }));
            this.clock.tick(1200);
            this.$ta.val('{ "id": 1 }');
            this.$btn.click();
            expect(callback.calledOnce).toBeTruthy();
            expect(callback.calledWith({ id: 1})).toBeTruthy();
            this.expectRows([testRequest2]);
            this.$ta.val('{ "id": 2 }');
            this.$btn.click();
            expect(callback.callCount).toBe(2);
            expect(callback.calledWith({ id: 2})).toBeTruthy();
            this.expectNoRequests();
            this.sc.stop();
        });


        it('should preserve form in render', function () {
            this.expectNoRequests();
            this.$ta.val('test text');
            this.$sel.val(400);
            this.clock.tick(1200);
            expect(this.$ta.val()).toBe('test text');
            expect(this.$sel.val()).toBe('400');
        });


        it('should auto update requests', function () {
            this.sc.start();
            this.expectNoRequests();
            var callback = sinon.spy();
            $.ajax($.extend(testRequest2, { success: callback }));
            this.expectNoRequests();
            this.clock.tick(1000);
            this.expectRows([testRequest2]);
            this.sc.stop();
        });



        it('should disable/enable send response button', function(){
            this.sc.start();
            // initial state 200, no request, empty text
            this.expectNoRequests();
            expect(this.$ta.val()).toBe('');
            expect(this.$sel.val()).toBe('200');
            expect(this.$btn.prop('disabled')).toBeTruthy();

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
            expect(this.$btn.prop('disabled')).toBeFalsy();

            // 200, request, invalid text
            this.$ta.val(' : 1}').trigger('keyup');
            expect(this.$btn.prop('disabled')).toBeTruthy();
        });


        it('should add error class to textare for invalid json', function(){
            this.expectNoRequests();
            expect(this.$ta.val()).toBe('');
            expect(this.$ta.hasClass('error')).toBeTruthy();
            $.ajax(testRequest1);
            this.$ta.val('{ "id" :').trigger('keyup');
            this.$ta.val('{ "id" : 1 }').trigger('keyup');
            expect(this.$ta.hasClass('error')).toBeFalsy();
        });
    });
})();
