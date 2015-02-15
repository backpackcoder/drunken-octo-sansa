/*global describe, it, SinonController, $ */
'use strict';

(function () {
    describe('SinonController', function () {
        var TestRequest_404 = {
            url: '/expected-404',
            async: false,
            method: 'GET'
        };

        var TestRequest1 = {
            url: '/test1',
            method: 'GET',
            data : null
        };

        var TestRequest2 = {
            url: '/test2',
            method: 'PUT',
            data: '{"id": 100}'
        };

        beforeEach(function() {
            this.$ws = $('<div></div>').css('display', 'none');
            this.sc = new SinonController({
                el: this.$ws[0]
            }).render();
            this.clock = sinon.useFakeTimers();

            /**
             * Expects "No Requests" text in the table
             */
            this.expectNoRequests = function() {
                expect(this.$ws.find('tbody tr').length).toEqual(1);
                expect(this.$ws.find('tbody tr').text()).toEqual('No requests');
            };

            /**
             * Checks a row of request objects
             * @param rows
             */
            this.expectRows = function(rows) {
                expect(this.$ws.find('tbody tr').length).toEqual(rows.length);
                for(var i=rows.length-1; i >= 0; i--) {
                    expect(this.$ws.find('tbody tr:nth-child(' + (i + 1) + ') td:nth-child(1)').text()).toEqual(rows[i].method);
                    expect(this.$ws.find('tbody tr:nth-child(' + (i + 1) + ') td:nth-child(2)').text()).toEqual(rows[i].url);
                    expect(this.$ws.find('tbody tr:nth-child(' + (i + 1) + ') td:nth-child(3)').text()).toEqual(rows[i].data || '');
                }
            };
        });


        afterEach(function() {            
            this.clock.restore();
            this.$ws.remove();
            delete(this.expectRows);
            delete(this.expectNoRequests);
        });


        it('can be startered and stopped', function(){
            this.expectNoRequests();
            $.ajax(TestRequest_404);
            this.sc.render();
            this.expectNoRequests();

            this.sc.start();
            $.ajax(TestRequest1);
            this.sc.render();
            this.expectRows([TestRequest1]);
            this.sc.stop();

            $.ajax(TestRequest_404);
            this.sc.render();
            this.expectRows([TestRequest1]);
        });


        it('should list requests', function () {
            this.expectNoRequests();

            this.sc.start();
            $.ajax(TestRequest1);
            this.sc.render();
            this.expectRows([TestRequest1]);


            $.ajax(TestRequest2);
            this.sc.render();
            this.expectRows([TestRequest1, TestRequest2]);
            this.sc.stop();
        });


        it('should respond to a request', function(){
            this.expectNoRequests();
            expect(this.$ws.find('button').prop('disabled')).toBeTruthy();

            this.sc.start();
            var callback = sinon.spy();
            $.ajax($.extend(TestRequest1, { success: callback }));
            this.sc.render();
            this.$ws.find('textarea').val('{ "id": 1 }');
            this.$ws.find('button').click();
            expect(callback.calledOnce).toBeTruthy();
            expect(callback.calledWith({ id: 1})).toBeTruthy();
            this.expectNoRequests();
            this.sc.stop();
        });


        it('can respond with error http status codes', function(){
            this.sc.start();
            var callback = sinon.spy();
            $.ajax($.extend(TestRequest1, { error: callback }));
            this.sc.render();
            this.$ws.find('select[name="statusCode"]').val(400);
            this.$ws.find('button').click();
            expect(callback.calledOnce).toBeTruthy();
            expect(callback.calledWithMatch({ status: 400 })).toBeTruthy();
            this.expectNoRequests();
            this.sc.stop();
        });


        it('should support multiple requests', function() {
            this.expectNoRequests();

            this.sc.start();
            var callback = sinon.spy();
            $.ajax($.extend(TestRequest1, { success: callback }));
            $.ajax($.extend(TestRequest2, { success: callback }));
            this.sc.render();
            expect(this.$ws.find('button').prop('disabled')).toBeFalsy();
            this.$ws.find('textarea').val('{ "id": 1 }');
            this.$ws.find('button').click();
            expect(callback.calledOnce).toBeTruthy();
            expect(callback.calledWith({ id: 1})).toBeTruthy();
            this.expectRows([TestRequest2]);

            this.$ws.find('textarea').val('{ "id": 2 }');
            this.$ws.find('button').click();
            expect(callback.callCount).toBe(2);
            expect(callback.calledWith({ id: 2})).toBeTruthy();
            this.expectNoRequests();
            expect(this.$ws.find('button').prop('disabled')).toBeTruthy();
            this.sc.stop();
        });


        it('should preserve response text in render', function() {
            this.expectNoRequests();
            expect(this.$ws.find('button').prop('disabled')).toBeTruthy();
            this.$ws.find('textarea').val('test text');
            this.sc.render();
            expect(this.$ws.find('textarea').val()).toEqual('test text');
        });


        it('should auto update', function() {
            this.sc.start();
            this.expectNoRequests();
            expect(this.$ws.find('button').prop('disabled')).toBeTruthy();

            var callback = sinon.spy();
            $.ajax($.extend(TestRequest2, { success: callback }));
            this.expectNoRequests();
            expect(this.$ws.find('button').prop('disabled')).toBeTruthy();

            this.clock.tick(1000);
            expect(this.$ws.find('button').prop('disabled')).toBeFalsy();
            this.expectRows([TestRequest2]);
            this.sc.stop();
        });
    });
})();
